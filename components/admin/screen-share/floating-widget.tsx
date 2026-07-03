"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, MonitorOff, Users, X } from "lucide-react";

import { useScreenShare } from "@/components/admin/screen-share/screen-share-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function StreamVideo({
  stream,
  muted = false,
  label,
}: {
  stream: MediaStream;
  muted?: boolean;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="aspect-video w-full rounded-xl bg-black object-contain"
      aria-label={label}
    />
  );
}

export function ScreenShareFloating() {
  const [open, setOpen] = useState(false);
  const {
    ready,
    enabled,
    error,
    participants,
    isSharing,
    activeSharerId,
    remoteStream,
    localPreviewStream,
    startSharing,
    stopSharing,
  } = useScreenShare();

  const onlineCount = participants.length;
  const someoneSharing = Boolean(activeSharerId);
  const sharerName =
    participants.find((participant) => participant.id === activeSharerId)?.name ?? "Another admin";
  const watchingRemote = Boolean(remoteStream && !isSharing);
  const previewStream = isSharing ? localPreviewStream : remoteStream;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {open && (
        <div
          className="pointer-events-auto flex w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl"
          role="dialog"
          aria-label="Admin screen sharing"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Monitor className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Screen Share</p>
                <p className="text-[11px] text-muted-foreground">
                  {ready
                    ? enabled
                      ? `${onlineCount} admin${onlineCount === 1 ? "" : "s"} online`
                      : "Not configured"
                    : "Connecting…"}
                </p>
              </div>
            </div>
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

          <div className="flex max-h-[min(560px,calc(100vh-8rem))] flex-col gap-4 overflow-y-auto p-4">
            {!enabled && ready && (
              <p className="rounded-xl border border-dashed border-white/10 bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
                {error ??
                  "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live screen sharing between logged-in admins."}
              </p>
            )}

            {enabled && (
              <>
                <div className="rounded-xl border border-white/10 bg-card/30 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Online now
                  </div>
                  {participants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No other admins connected yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {participants.map((participant) => (
                        <li
                          key={participant.id}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <span>{participant.name}</span>
                          {participant.isSharing ? (
                            <Badge variant="default" className="text-[10px]">
                              Sharing
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              Online
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {previewStream && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {isSharing ? "You are sharing" : `Watching ${sharerName}`}
                    </p>
                    <StreamVideo
                      stream={previewStream}
                      muted={isSharing}
                      label={isSharing ? "Your shared screen preview" : "Remote shared screen"}
                    />
                  </div>
                )}

                {someoneSharing && !isSharing && !watchingRemote && (
                  <p className="text-sm text-muted-foreground">
                    {sharerName} is sharing their screen. Connecting…
                  </p>
                )}

                {error && enabled && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {isSharing ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => void stopSharing()}
                    >
                      <MonitorOff className="h-4 w-4" />
                      Stop sharing
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => void startSharing()}
                      disabled={Boolean(activeSharerId && !isSharing)}
                    >
                      <Monitor className="h-4 w-4" />
                      Share my screen
                    </Button>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Any admin logged into this portal can see who is online and watch a shared screen in
                  real time. Only one person can share at a time.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className={cn(
          "pointer-events-auto relative h-14 w-14 rounded-full shadow-lg",
          open && "bg-muted text-foreground hover:bg-muted/80"
        )}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close screen sharing" : "Open screen sharing"}
      >
        {open ? <X className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
        {someoneSharing && !open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
          </span>
        )}
      </Button>
    </div>
  );
}
