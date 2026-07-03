import type { AdminStore, ConsultantUsage } from "./types";

/** gpt-4o-mini list pricing (USD per 1M tokens) — override via env if OpenAI changes rates */
const INPUT_COST_PER_M = Number(process.env.OPENAI_INPUT_COST_PER_M ?? "0.15");
const OUTPUT_COST_PER_M = Number(process.env.OPENAI_OUTPUT_COST_PER_M ?? "0.60");

export const CONSULTANT_LIMITS = {
  monthlyBudgetUsd: Number(process.env.OPENAI_MONTHLY_BUDGET_USD ?? "5"),
  maxRequestsPerHour: Number(process.env.OPENAI_RATE_LIMIT_PER_HOUR ?? "12"),
  minIntervalMs: Number(process.env.OPENAI_MIN_REQUEST_INTERVAL_MS ?? "5000"),
  maxOutputTokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? "1000"),
  maxUserMessageChars: Number(process.env.OPENAI_MAX_USER_MESSAGE_CHARS ?? "2000"),
  maxConversationMessages: 20,
} as const;

export interface ConsultantUsageSummary {
  monthKey: string;
  spendUsd: number;
  budgetUsd: number;
  spendRemainingUsd: number;
  requestCount: number;
  requestsThisHour: number;
  maxRequestsPerHour: number;
  budgetExceeded: boolean;
  percentUsed: number;
}

export interface ConsultantLimitCheck {
  allowed: boolean;
  message?: string;
  usage: ConsultantUsageSummary;
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function emptyUsage(): ConsultantUsage {
  return {
    monthKey: currentMonthKey(),
    spendUsd: 0,
    requestCount: 0,
    recentRequestTimestamps: [],
    lastRequestAt: null,
  };
}

function normalizeUsage(raw: ConsultantUsage | null | undefined): ConsultantUsage {
  const monthKey = currentMonthKey();
  if (!raw || raw.monthKey !== monthKey) {
    return { ...emptyUsage(), monthKey };
  }
  return {
    monthKey: raw.monthKey,
    spendUsd: raw.spendUsd ?? 0,
    requestCount: raw.requestCount ?? 0,
    recentRequestTimestamps: Array.isArray(raw.recentRequestTimestamps)
      ? raw.recentRequestTimestamps
      : [],
    lastRequestAt: raw.lastRequestAt ?? null,
  };
}

function pruneRecentTimestamps(timestamps: string[]): string[] {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return timestamps.filter((ts) => new Date(ts).getTime() > oneHourAgo);
}

export function estimateTokenCost(promptTokens: number, completionTokens: number): number {
  const inputCost = (promptTokens / 1_000_000) * INPUT_COST_PER_M;
  const outputCost = (completionTokens / 1_000_000) * OUTPUT_COST_PER_M;
  return inputCost + outputCost;
}

/** Conservative upper bound before calling the API */
export function estimateMaxRequestCost(
  systemPromptChars: number,
  userMessagesChars: number
): number {
  const estimatedPromptTokens = Math.ceil((systemPromptChars + userMessagesChars) / 3.5);
  return estimateTokenCost(estimatedPromptTokens, CONSULTANT_LIMITS.maxOutputTokens);
}

export function buildUsageSummary(usage: ConsultantUsage): ConsultantUsageSummary {
  const recent = pruneRecentTimestamps(usage.recentRequestTimestamps);
  const budgetUsd = CONSULTANT_LIMITS.monthlyBudgetUsd;
  const spendUsd = Math.round(usage.spendUsd * 1_000_000) / 1_000_000;
  const spendRemainingUsd = Math.max(0, budgetUsd - spendUsd);

  return {
    monthKey: usage.monthKey,
    spendUsd,
    budgetUsd,
    spendRemainingUsd,
    requestCount: usage.requestCount,
    requestsThisHour: recent.length,
    maxRequestsPerHour: CONSULTANT_LIMITS.maxRequestsPerHour,
    budgetExceeded: spendUsd >= budgetUsd,
    percentUsed: budgetUsd > 0 ? Math.min(100, (spendUsd / budgetUsd) * 100) : 100,
  };
}

export async function getConsultantUsageFromStore(): Promise<ConsultantUsage> {
  const { getAdminStore } = await import("./store");
  const store = await getAdminStore();
  return normalizeUsage(store.consultantUsage);
}

export function checkConsultantLimits(
  usage: ConsultantUsage,
  options?: { estimatedRequestCostUsd?: number; userMessageLength?: number }
): ConsultantLimitCheck {
  const normalized = normalizeUsage(usage);
  const summary = buildUsageSummary(normalized);
  const recent = pruneRecentTimestamps(normalized.recentRequestTimestamps);
  const { monthlyBudgetUsd, maxRequestsPerHour, minIntervalMs, maxUserMessageChars } =
    CONSULTANT_LIMITS;

  if (options?.userMessageLength && options.userMessageLength > maxUserMessageChars) {
    return {
      allowed: false,
      message: `Message is too long. Keep questions under ${maxUserMessageChars} characters.`,
      usage: summary,
    };
  }

  if (summary.spendUsd >= monthlyBudgetUsd) {
    return {
      allowed: false,
      message: `Monthly AI budget reached ($${monthlyBudgetUsd.toFixed(2)}). Resets on the 1st of next month. Set OPENAI_MONTHLY_BUDGET_USD to increase.`,
      usage: summary,
    };
  }

  const estimated = options?.estimatedRequestCostUsd ?? 0;
  if (summary.spendUsd + estimated > monthlyBudgetUsd) {
    return {
      allowed: false,
      message: `This request may exceed the remaining monthly budget ($${summary.spendRemainingUsd.toFixed(2)} left of $${monthlyBudgetUsd.toFixed(2)}). Try a shorter question or wait until next month.`,
      usage: summary,
    };
  }

  if (recent.length >= maxRequestsPerHour) {
    return {
      allowed: false,
      message: `Rate limit reached (${maxRequestsPerHour} questions per hour). Wait a bit and try again.`,
      usage: summary,
    };
  }

  if (normalized.lastRequestAt) {
    const elapsed = Date.now() - new Date(normalized.lastRequestAt).getTime();
    if (elapsed < minIntervalMs) {
      const waitSec = Math.ceil((minIntervalMs - elapsed) / 1000);
      return {
        allowed: false,
        message: `Please wait ${waitSec} second${waitSec === 1 ? "" : "s"} before sending another question.`,
        usage: summary,
      };
    }
  }

  return { allowed: true, usage: summary };
}

export function applyConsultantUsage(
  store: AdminStore,
  tokens: { promptTokens: number; completionTokens: number }
): AdminStore {
  const usage = normalizeUsage(store.consultantUsage);
  const cost = estimateTokenCost(tokens.promptTokens, tokens.completionTokens);
  const now = new Date().toISOString();

  const nextUsage: ConsultantUsage = {
    monthKey: usage.monthKey,
    spendUsd: usage.spendUsd + cost,
    requestCount: usage.requestCount + 1,
    lastRequestAt: now,
    recentRequestTimestamps: [...pruneRecentTimestamps(usage.recentRequestTimestamps), now],
  };

  return { ...store, consultantUsage: nextUsage };
}
