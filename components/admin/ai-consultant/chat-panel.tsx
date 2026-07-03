"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Bot,
  Camera,
  ImagePlus,
  Loader2,
  Monitor,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type { ConsultantMessage } from "@/app/actions/consultant";
import {
  captureScreenFrame,
  readClipboardImage,
  readImageFile,
} from "@/components/admin/ai-consultant/image-utils";
import {
  type ConsultantUsageState,
  useConsultantChat,
} from "@/components/admin/ai-consultant/use-consultant-chat";
import { Button } from "@/components/ui/button";
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

function UsageMeter({ usage }: { usage: ConsultantUsageState }) {
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
        {usage.requestsThisHour}/{usage.maxRequestsPerHour} questions this hour
      </p>
    </div>
  );
}

function MessageBubble({ message }: { message: ConsultantMessage }) {
  return (
    <div
      className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          message.role === "user" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
        )}
      >
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] space-y-2 rounded-2xl px-4 py-3 text-sm leading-relaxed",
          message.role === "user" ? "bg-accent/15 text-foreground" : "bg-white/5 text-muted-foreground"
        )}
      >
        {message.images?.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={src}
            alt="Screenshot shared with consultant"
            className="max-h-48 w-full rounded-lg border border-white/10 object-contain"
          />
        ))}
        {message.content ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : message.images?.length ? (
          <p className="text-xs italic text-muted-foreground">Screenshot attached</p>
        ) : null}
      </div>
    </div>
  );
}

export interface AiConsultantChatPanelHandle {
  clearChat: () => void;
}

export interface AiConsultantChatPanelProps {
  variant?: "page" | "float";
  showStarters?: boolean;
  className?: string;
}

export const AiConsultantChatPanel = forwardRef<
  AiConsultantChatPanelHandle,
  AiConsultantChatPanelProps
>(function AiConsultantChatPanel({ variant = "page", showStarters = variant === "page", className }, ref) {
  const {
    messages,
    input,
    setInput,
    pendingImage,
    setPendingImage,
    error,
    setError,
    usage,
    isPending,
    scrollRef,
    sendMessage,
    clearChat,
    atLimit,
  } = useConsultantChat();

  useImperativeHandle(ref, () => ({ clearChat }), [clearChat]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturePending, setCapturePending] = useState(false);

  async function attachImage(dataUrl: string) {
    setPendingImage(dataUrl);
    setError(null);
  }

  async function handlePaste(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (!imageItem) return;

    e.preventDefault();
    try {
      const dataUrl = await readClipboardImage(imageItem);
      await attachImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not paste image.");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await readImageFile(file);
      await attachImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load image.");
    }
  }

  async function handleScreenCapture() {
    setCapturePending(true);
    setError(null);
    try {
      const dataUrl = await captureScreenFrame();
      await attachImage(dataUrl);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Screen capture was cancelled.");
      } else {
        setError(err instanceof Error ? err.message : "Could not capture screen.");
      }
    } finally {
      setCapturePending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const compact = variant === "float";

  return (
    <div className={cn("flex flex-col", className)}>
      {showStarters && (
        <div className="mb-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Try asking</p>
              <p className="text-xs text-muted-foreground">Or paste / capture a screenshot</p>
            </div>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {STARTER_QUESTIONS.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={isPending || atLimit}
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-50"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
          {usage && <UsageMeter usage={usage} />}
        </div>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto",
          compact ? "min-h-0 px-4 py-3" : "p-4 sm:p-6"
        )}
        aria-live="polite"
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Thinking…
          </div>
        )}
      </div>

      {error && (
        <p
          className={cn(
            "border-t border-white/10 text-sm text-destructive",
            compact ? "px-4 py-2" : "px-4 py-2 sm:px-6"
          )}
          role="alert"
        >
          {error}
        </p>
      )}

      {pendingImage && (
        <div className={cn("border-t border-white/10", compact ? "px-4 py-2" : "px-4 py-2 sm:px-6")}>
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingImage}
              alt="Screenshot ready to send"
              className="max-h-24 rounded-lg border border-white/10"
            />
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
              aria-label="Remove screenshot"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn("border-t border-white/10", compact ? "p-3" : "p-4 sm:p-6")}
        onPaste={handlePaste}
      >
        <div className="mb-2 flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending || atLimit || capturePending}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => void handleScreenCapture()}
            disabled={isPending || atLimit || capturePending}
          >
            {capturePending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Monitor className="h-3.5 w-3.5" />
            )}
            Capture screen
          </Button>
          <span className="flex items-center text-[11px] text-muted-foreground">
            <Camera className="mr-1 h-3 w-3" />
            Paste with Ctrl+V
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any field, job, or process — attach a screenshot to ask about what you see…"
            rows={2}
            className={cn("resize-none", compact ? "min-h-[44px] text-sm" : "min-h-[52px]")}
            disabled={isPending || atLimit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className={cn("shrink-0", compact ? "h-[44px] w-[44px]" : "h-[52px] w-[52px]")}
            disabled={isPending || atLimit || (!input.trim() && !pendingImage)}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>

        {!showStarters && usage && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            ${usage.spendUsd.toFixed(2)} / ${usage.budgetUsd.toFixed(2)} this month ·{" "}
            {usage.requestsThisHour}/{usage.maxRequestsPerHour} this hour
          </p>
        )}
      </form>
    </div>
  );
});
