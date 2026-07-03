"use client";

import { createContext, useContext } from "react";

import { useScreenShareRoom } from "@/lib/admin/screen-share/use-screen-share-room";

type ScreenShareContextValue = ReturnType<typeof useScreenShareRoom>;

const ScreenShareContext = createContext<ScreenShareContextValue | null>(null);

export function ScreenShareProvider({ children }: { children: React.ReactNode }) {
  const room = useScreenShareRoom();
  return <ScreenShareContext.Provider value={room}>{children}</ScreenShareContext.Provider>;
}

export function useScreenShare() {
  const context = useContext(ScreenShareContext);
  if (!context) {
    throw new Error("useScreenShare must be used within ScreenShareProvider");
  }
  return context;
}
