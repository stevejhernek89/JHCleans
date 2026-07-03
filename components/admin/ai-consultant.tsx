"use client";

import { useRef } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminSidebar } from "@/components/admin/admin-shell";
import {
  AiConsultantChatPanel,
  type AiConsultantChatPanelHandle,
} from "@/components/admin/ai-consultant/chat-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AiBusinessConsultant() {
  const { openSidebar } = useAdminSidebar();
  const chatRef = useRef<AiConsultantChatPanelHandle>(null);

  return (
    <>
      <AdminHeader
        title="AI Business Consultant"
        description="Ask questions about the website, admin portal, business model, and day-to-day operations. Paste or capture screenshots to get help with what you're seeing."
        onMenuClick={openSidebar}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => chatRef.current?.clearChat()}
          >
            New chat
          </Button>
        }
      />

      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <Card className="flex min-h-[calc(100vh-12rem)] flex-1 flex-col lg:col-span-2">
          <CardContent className="flex flex-1 flex-col p-0">
            <AiConsultantChatPanel ref={chatRef} variant="page" className="min-h-0 flex-1" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
