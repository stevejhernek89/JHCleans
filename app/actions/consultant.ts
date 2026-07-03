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
  /** Base64 data URLs (image/jpeg or image/png) attached to user messages */
  images?: string[];
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

type OpenAIChatMessage =
  | { role: "system"; content: string }
  | { role: "assistant"; content: string }
  | {
      role: "user";
      content: string | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
    };

function buildOpenAIMessages(
  systemPrompt: string,
  messages: ConsultantMessage[]
): OpenAIChatMessage[] {
  const apiMessages: OpenAIChatMessage[] = [{ role: "system", content: systemPrompt }];

  for (const message of messages) {
    if (message.role === "assistant") {
      apiMessages.push({ role: "assistant", content: message.content });
      continue;
    }

    const images = message.images?.filter((url) => url.startsWith("data:image/")) ?? [];
    if (images.length === 0) {
      apiMessages.push({ role: "user", content: message.content });
      continue;
    }

    const text =
      message.content.trim() ||
      "Please look at this screenshot and help me with what I'm seeing in the admin portal.";
    apiMessages.push({
      role: "user",
      content: [
        { type: "text", text },
        ...images.map((url) => ({
          type: "image_url" as const,
          image_url: { url },
        })),
      ],
    });
  }

  return apiMessages;
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
        "AI Business Consultant is not configured yet. Add OPENAI_API_KEY to your environment variables (local: .env.local, production: Vercel project settings) and redeploy.",
    };
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user") {
    return { success: false, message: "Please enter a question or attach a screenshot." };
  }

  if (messages.length > CONSULTANT_LIMITS.maxConversationMessages) {
    return {
      success: false,
      message: `Conversation is too long (max ${CONSULTANT_LIMITS.maxConversationMessages} messages). Start a new chat.`,
    };
  }

  const userText = lastMessage.content.trim();
  const imageCount = lastMessage.images?.length ?? 0;

  if (imageCount > CONSULTANT_LIMITS.maxImagesPerMessage) {
    return {
      success: false,
      message: `You can attach up to ${CONSULTANT_LIMITS.maxImagesPerMessage} screenshot per message.`,
    };
  }

  if (!userText && imageCount === 0) {
    return { success: false, message: "Please enter a question or attach a screenshot." };
  }

  const usageRecord = await getConsultantUsageFromStore();
  const siteContent = await getSiteContent();
  const systemPrompt = buildConsultantSystemPrompt(siteContent);
  const userMessagesChars = messages
    .filter((m) => m.role === "user")
    .reduce((sum, m) => sum + m.content.length, 0);

  const estimatedCost = estimateMaxRequestCost(systemPrompt.length, userMessagesChars, imageCount);
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
        messages: buildOpenAIMessages(systemPrompt, messages),
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
