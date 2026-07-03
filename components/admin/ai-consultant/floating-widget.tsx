"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Bot, Maximize2, Minimize2, X } from "lucide-react";

import {
  AiConsultantChatPanel,
  type AiConsultantChatPanelHandle,
} from "@/components/admin/ai-consultant/chat-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiConsultantFloating() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const chatRef = useRef<AiConsultantChatPanelHandle>(null);

  if (pathname === "/admin/consultant") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          className={cn(
            "pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl",
            expanded
              ? "fixed inset-4 sm:inset-auto sm:bottom-20 sm:right-6 sm:h-[min(720px,calc(100vh-7rem))] sm:w-[min(480px,calc(100vw-3rem))]"
              : "h-[min(520px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))]"
          )}
          role="dialog"
          aria-label="AI Business Consultant"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Consultant</p>
                <p className="text-[11px] text-muted-foreground">Ask anything · paste screenshots</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => chatRef.current?.clearChat()}
                title="New chat"
              >
                <span className="text-xs">New</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setExpanded((v) => !v)}
                title={expanded ? "Compact view" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
                title="Open full page"
              >
                <Link href="/admin/consultant">
                  <Maximize2 className="h-4 w-4 rotate-90" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AiConsultantChatPanel
            ref={chatRef}
            variant="float"
            showStarters={false}
            className="min-h-0 flex-1"
          />
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className={cn(
          "pointer-events-auto h-14 w-14 rounded-full shadow-lg",
          open && "bg-muted text-foreground hover:bg-muted/80"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close AI consultant" : "Open AI consultant"}
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </div>
  );
}
