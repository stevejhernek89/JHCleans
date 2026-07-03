"use server";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  buildUsageSummary,
  checkConsultantLimits,
  CONSULTANT_LIMITS,
  estimateMaxRequestCost,
  getConsultantUsageFromStore,
} from "@/lib/admin/consultant-limits";
import { buildConsultantSystemPrompt } from "@/lib/admin/consultant-knowledge";
import { recordConsultantUsage } from "@/lib/admin/store";
import { getSiteContent } from "@/lib/content/get-content";

export interface ConsultantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConsultantChatResult {
  success: boolean;
  message?: string;
  reply?: string;
  usage?: {
    spendUsd: number;
    budgetUsd: number;
    spendRemainingUsd: number;
    requestsThisHour: number;
    maxRequestsPerHour: number;
    percentUsed: number;
  };
}

export interface ConsultantUsageResult {
  success: boolean;
  usage?: ConsultantChatResult["usage"];
  message?: string;
}

async function requireAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}

export async function getConsultantUsageAction(): Promise<ConsultantUsageResult> {
  try {
    await requireAuth();
    const raw = await getConsultantUsageFromStore();
    const summary = buildUsageSummary(raw);
    return {
      success: true,
      usage: {
        spendUsd: summary.spendUsd,
        budgetUsd: summary.budgetUsd,
        spendRemainingUsd: summary.spendRemainingUsd,
        requestsThisHour: summary.requestsThisHour,
        maxRequestsPerHour: summary.maxRequestsPerHour,
        percentUsed: summary.percentUsed,
      },
    };
  } catch {
    return { success: false, message: "Unauthorized" };
  }
}

export async function consultantChatAction(
  messages: ConsultantMessage[]
): Promise<ConsultantChatResult> {
  try {
    await requireAuth();
  } catch {
    return { success: false, message: "You must be signed in to use the AI Business Consultant." };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      message:
        "AI Business Consultant is not configured yet. Add OPENAI_API_KEY to your environment variables (.env.local) and restart the dev server.",
    };
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user" || !lastMessage.content.trim()) {
    return { success: false, message: "Please enter a question." };
  }

  if (messages.length > CONSULTANT_LIMITS.maxConversationMessages) {
    return {
      success: false,
      message: `Conversation is too long (max ${CONSULTANT_LIMITS.maxConversationMessages} messages). Start a new chat.`,
    };
  }

  const userText = lastMessage.content.trim();
  const usageRecord = await getConsultantUsageFromStore();
  const siteContent = await getSiteContent();
  const systemPrompt = buildConsultantSystemPrompt(siteContent);
  const userMessagesChars = messages
    .filter((m) => m.role === "user")
    .reduce((sum, m) => sum + m.content.length, 0);

  const estimatedCost = estimateMaxRequestCost(systemPrompt.length, userMessagesChars);
  const limitCheck = checkConsultantLimits(usageRecord, {
    estimatedRequestCostUsd: estimatedCost,
    userMessageLength: userText.length,
  });

  if (!limitCheck.allowed) {
    return {
      success: false,
      message: limitCheck.message,
      usage: {
        spendUsd: limitCheck.usage.spendUsd,
        budgetUsd: limitCheck.usage.budgetUsd,
        spendRemainingUsd: limitCheck.usage.spendRemainingUsd,
        requestsThisHour: limitCheck.usage.requestsThisHour,
        maxRequestsPerHour: limitCheck.usage.maxRequestsPerHour,
        percentUsed: limitCheck.usage.percentUsed,
      },
    };
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: CONSULTANT_LIMITS.maxOutputTokens,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", response.status, errorBody);
      return {
        success: false,
        message: "The AI service returned an error. Check your API key and try again.",
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
      };
    };

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { success: false, message: "No response from the AI. Please try again." };
    }

    const promptTokens = data.usage?.prompt_tokens ?? 0;
    const completionTokens = data.usage?.completion_tokens ?? 0;

    if (promptTokens > 0 || completionTokens > 0) {
      await recordConsultantUsage({ promptTokens, completionTokens });
    }

    const updatedUsage = buildUsageSummary(await getConsultantUsageFromStore());

    return {
      success: true,
      reply,
      usage: {
        spendUsd: updatedUsage.spendUsd,
        budgetUsd: updatedUsage.budgetUsd,
        spendRemainingUsd: updatedUsage.spendRemainingUsd,
        requestsThisHour: updatedUsage.requestsThisHour,
        maxRequestsPerHour: updatedUsage.maxRequestsPerHour,
        percentUsed: updatedUsage.percentUsed,
      },
    };
  } catch (error) {
    console.error("Consultant chat error:", error);
    return {
      success: false,
      message: "Could not reach the AI service. Check your internet connection and try again.",
    };
  }
}
