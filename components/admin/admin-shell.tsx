"use client";

import { createContext, useContext, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AiConsultantFloating } from "@/components/admin/ai-consultant/floating-widget";
import { ScreenShareFloating } from "@/components/admin/screen-share/floating-widget";
import { ScreenShareProvider } from "@/components/admin/screen-share/screen-share-provider";
import { cn } from "@/lib/utils";

const SidebarContext = createContext<{
  openSidebar: () => void;
}>({ openSidebar: () => {} });

export function useAdminSidebar() {
  return useContext(SidebarContext);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <ScreenShareProvider>
        <div className="flex min-h-screen bg-background">
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/50 lg:hidden",
              sidebarOpen ? "block" : "hidden"
            )}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform lg:static lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <AdminSidebar />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
          <ScreenShareFloating />
          <AiConsultantFloating />
        </div>
      </ScreenShareProvider>
    </SidebarContext.Provider>
  );
}
