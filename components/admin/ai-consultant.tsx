"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import {
  consultantChatAction,
  getConsultantUsageAction,
  type ConsultantMessage,
} from "@/app/actions/consultant";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminSidebar } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STARTER_QUESTIONS = [
  "How do I handle a new booking from the website?",
  "What's the difference between Phone and Phone (tel link)?",
  "How should I set up my pricing plans?",
  "Walk me through adding a job to the calendar.",
  "How do I track supply expenses in Finances?",
  "What ZIP codes should go in Serviced vs Maybe?",
];

type UsageState = NonNullable<Awaited<ReturnType<typeof getConsultantUsageAction>>["usage"]>;

function UsageMeter({ usage }: { usage: UsageState }) {
  const atLimit = usage.percentUsed >= 100;
  return (
    <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Monthly AI budget</span>
        <span className={atLimit ? "text-destructive" : "text-muted-foreground"}>
          ${usage.spendUsd.toFixed(2)} / ${usage.budgetUsd.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            atLimit ? "bg-destructive" : usage.percentUsed > 80 ? "bg-amber-400" : "bg-primary"
          )}
          style={{ width: `${Math.min(100, usage.percentUsed)}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        {usage.requestsThisHour}/{usage.maxRequestsPerHour} questions this hour · Resets monthly
      </p>
    </div>
  );
}

export function AiBusinessConsultant() {
  const { openSidebar } = useAdminSidebar();
  const [messages, setMessages] = useState<ConsultantMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Business Consultant. I'm trained on the JHCleans website, admin portal, and business model. Ask me anything about filling out fields, managing jobs, tracking finances, or running the business — I'll give you clear, step-by-step answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadUsage = useCallback(async () => {
    const result = await getConsultantUsageAction();
    if (result.success && result.usage) {
      setUsage(result.usage);
    }
  }, []);

  useEffect(() => {
    void loadUsage();
  }, [loadUsage]);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const userMessage: ConsultantMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    scrollToBottom();

    startTransition(async () => {
      const result = await consultantChatAction(
        nextMessages.filter((m) => m.role === "user" || m.role === "assistant")
      );

      if (result.success && result.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.reply! }]);
        if (result.usage) setUsage(result.usage);
        scrollToBottom();
      } else {
        setError(result.message ?? "Something went wrong.");
        if (result.usage) setUsage(result.usage);
      }
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. What would you like to know about JHCleans or the admin portal?",
      },
    ]);
    setError(null);
  }

  return (
    <>
      <AdminHeader
        title="AI Business Consultant"
        description="Ask questions about the website, admin portal, business model, and day-to-day operations."
        onMenuClick={openSidebar}
        action={
          <Button type="button" variant="outline" size="sm" onClick={clearChat} disabled={isPending}>
            New chat
          </Button>
        }
      />

      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <Card className="lg:w-72 shrink-0 lg:sticky lg:top-6 lg:self-start">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Try asking</p>
                <p className="text-xs text-muted-foreground">Click a starter question</p>
              </div>
            </div>
            <ul className="space-y-2">
              {STARTER_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={isPending}
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-50"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
            {usage && <UsageMeter usage={usage} />}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Rate limits: 12 questions/hour, 5 sec between sends, $5/month max spend.
            </p>
          </CardContent>
        </Card>

        <Card className="flex min-h-[calc(100vh-12rem)] flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col p-0">
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      msg.role === "user" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-accent/15 text-foreground"
                        : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Thinking…
                </div>
              )}
            </div>

            {error && (
              <p className="border-t border-white/10 px-4 py-2 text-sm text-destructive sm:px-6" role="alert">
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-white/10 p-4 sm:p-6"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any admin field, job, pricing, or business process…"
                rows={2}
                className="min-h-[52px] resize-none"
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
              />
              <Button type="submit" size="icon" className="h-[52px] w-[52px] shrink-0" disabled={isPending || !input.trim() || (usage?.percentUsed ?? 0) >= 100}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
