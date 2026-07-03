"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  consultantChatAction,
  getConsultantUsageAction,
  type ConsultantMessage,
} from "@/app/actions/consultant";

export const WELCOME_MESSAGE =
  "Hi! I'm your AI Business Consultant. Ask me anything about the website, admin portal, or day-to-day operations. Paste or upload a screenshot, or capture your screen, and I'll help you with what you're seeing.";

export const CLEARED_MESSAGE =
  "Chat cleared. What would you like to know? You can paste a screenshot (Ctrl+V) or capture your screen anytime.";

export type ConsultantUsageState = NonNullable<
  Awaited<ReturnType<typeof getConsultantUsageAction>>["usage"]
>;

export function useConsultantChat() {
  const [messages, setMessages] = useState<ConsultantMessage[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<ConsultantUsageState | null>(null);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void getConsultantUsageAction().then((result) => {
      if (!cancelled && result.success && result.usage) {
        setUsage(result.usage);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const sendMessage = useCallback(
    (text: string, image?: string | null) => {
      const trimmed = text.trim();
      const imageToSend = image ?? pendingImage;
      if ((!trimmed && !imageToSend) || isPending) return;

      const userMessage: ConsultantMessage = {
        role: "user",
        content: trimmed,
        ...(imageToSend ? { images: [imageToSend] } : {}),
      };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");
      setPendingImage(null);
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
    },
    [isPending, messages, pendingImage, scrollToBottom]
  );

  const clearChat = useCallback(() => {
    setMessages([{ role: "assistant", content: CLEARED_MESSAGE }]);
    setInput("");
    setPendingImage(null);
    setError(null);
  }, []);

  const atLimit = (usage?.percentUsed ?? 0) >= 100;

  return {
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
  };
}
