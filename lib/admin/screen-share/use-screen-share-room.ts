"use client";

import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

import { getScreenShareSessionAction } from "@/app/actions/screen-share";
import {
  getOrCreateParticipantId,
  getOrCreateParticipantName,
  ICE_SERVERS,
} from "@/lib/admin/screen-share/config";
import type {
  PresenceMeta,
  ScreenShareParticipant,
  ScreenShareRoomState,
  SignalPayload,
} from "@/lib/admin/screen-share/types";

const initialState: ScreenShareRoomState = {
  ready: false,
  enabled: false,
  error: null,
  participants: [],
  isSharing: false,
  activeSharerId: null,
  remoteStream: null,
  localPreviewStream: null,
};

function parsePresenceState(
  state: Record<string, PresenceMeta[]>,
  selfId: string
): ScreenShareParticipant[] {
  const participants: ScreenShareParticipant[] = [];

  for (const [id, entries] of Object.entries(state)) {
    const meta = entries[0];
    if (!meta) continue;
    participants.push({
      id,
      name: meta.name,
      isSharing: meta.isSharing,
      joinedAt: meta.joinedAt,
    });
  }

  return participants.sort((a, b) => {
    if (a.id === selfId) return -1;
    if (b.id === selfId) return 1;
    return a.joinedAt - b.joinedAt;
  });
}

function getActiveSharer(participants: ScreenShareParticipant[]): string | null {
  return participants.find((participant) => participant.isSharing)?.id ?? null;
}

export function useScreenShareRoom() {
  const [state, setState] = useState<ScreenShareRoomState>(initialState);

  const supabaseRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const participantIdRef = useRef("");
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const makingOfferRef = useRef<Set<string>>(new Set());
  const stopSharingRef = useRef<() => Promise<void>>(async () => {});

  const updateParticipants = useCallback((participants: ScreenShareParticipant[]) => {
    setState((prev) => ({
      ...prev,
      participants,
      activeSharerId: getActiveSharer(participants),
    }));
  }, []);

  const sendSignal = useCallback((payload: SignalPayload) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "signal",
      payload,
    });
  }, []);

  const closePeerConnection = useCallback((peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc) return;
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.close();
    peerConnectionsRef.current.delete(peerId);
    makingOfferRef.current.delete(peerId);
  }, []);

  const closeAllPeerConnections = useCallback(() => {
    for (const peerId of [...peerConnectionsRef.current.keys()]) {
      closePeerConnection(peerId);
    }
  }, [closePeerConnection]);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setState((prev) => ({ ...prev, localPreviewStream: null }));
  }, []);

  const stopRemoteStream = useCallback(() => {
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current = null;
    setState((prev) => ({ ...prev, remoteStream: null }));
  }, []);

  const syncPresence = useCallback(async (meta: Partial<PresenceMeta>) => {
    const channel = channelRef.current;
    if (!channel) return;

    const current = channel.presenceState<PresenceMeta>()[participantIdRef.current]?.[0];
    await channel.track({
      name: current?.name ?? "Admin",
      isSharing: current?.isSharing ?? false,
      joinedAt: current?.joinedAt ?? Date.now(),
      ...meta,
    });
  }, []);

  const createPeerConnection = useCallback(
    (peerId: string, initiator: boolean) => {
      if (peerConnectionsRef.current.has(peerId)) {
        return peerConnectionsRef.current.get(peerId)!;
      }

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        sendSignal({
          kind: "ice",
          from: participantIdRef.current,
          to: peerId,
          candidate: event.candidate.toJSON(),
        });
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (!stream) return;
        remoteStreamRef.current = stream;
        setState((prev) => ({ ...prev, remoteStream: stream }));
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          closePeerConnection(peerId);
        }
      };

      const localStream = localStreamRef.current;
      if (localStream) {
        for (const track of localStream.getTracks()) {
          pc.addTrack(track, localStream);
        }
      }

      peerConnectionsRef.current.set(peerId, pc);

      if (initiator && localStream && !makingOfferRef.current.has(peerId)) {
        makingOfferRef.current.add(peerId);
        void (async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendSignal({
              kind: "offer",
              from: participantIdRef.current,
              to: peerId,
              sdp: offer,
            });
          } catch (error) {
            setState((prev) => ({
              ...prev,
              error: error instanceof Error ? error.message : "Could not start screen share.",
            }));
          }
        })();
      }

      return pc;
    },
    [closePeerConnection, sendSignal]
  );

  const handleSignal = useCallback(
    async (payload: SignalPayload) => {
      const selfId = participantIdRef.current;
      if (payload.from === selfId) return;

      if (payload.kind === "share-stop") {
        closePeerConnection(payload.from);
        stopRemoteStream();
        return;
      }

      if ("to" in payload && payload.to !== selfId) return;

      if (payload.kind === "offer") {
        const pc = createPeerConnection(payload.from, false);
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({
          kind: "answer",
          from: selfId,
          to: payload.from,
          sdp: answer,
        });
        return;
      }

      if (payload.kind === "answer") {
        const pc = peerConnectionsRef.current.get(payload.from);
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        return;
      }

      if (payload.kind === "ice") {
        const pc = peerConnectionsRef.current.get(payload.from);
        if (!pc || !payload.candidate) return;
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    },
    [createPeerConnection, sendSignal, closePeerConnection, stopRemoteStream]
  );

  const connectToSharer = useCallback(
    (sharerId: string) => {
      if (sharerId === participantIdRef.current) return;
      createPeerConnection(sharerId, false);
    },
    [createPeerConnection]
  );

  const connectViewers = useCallback(
    (participants: ScreenShareParticipant[]) => {
      if (!localStreamRef.current) return;

      for (const participant of participants) {
        if (participant.id === participantIdRef.current) continue;
        createPeerConnection(participant.id, true);
      }
    },
    [createPeerConnection]
  );

  const startSharing = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setState((prev) => ({
        ...prev,
        error: "Screen sharing is not supported in this browser.",
      }));
      return;
    }

    const activeSharer = getActiveSharer(state.participants);
    if (activeSharer && activeSharer !== participantIdRef.current) {
      setState((prev) => ({
        ...prev,
        error: "Someone else is already sharing their screen.",
      }));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const [track] = stream.getVideoTracks();
      track.addEventListener("ended", () => {
        void stopSharingRef.current();
      });

      localStreamRef.current = stream;
      setState((prev) => ({
        ...prev,
        isSharing: true,
        localPreviewStream: stream,
        error: null,
      }));

      await syncPresence({ isSharing: true });
      connectViewers(state.participants);
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setState((prev) => ({ ...prev, error: "Screen share was cancelled." }));
        return;
      }
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Could not share screen.",
      }));
    }
  }, [connectViewers, state.participants, syncPresence]);

  const stopSharing = useCallback(async () => {
    stopLocalStream();
    closeAllPeerConnections();
    sendSignal({ kind: "share-stop", from: participantIdRef.current });
    setState((prev) => ({ ...prev, isSharing: false, error: null }));
    await syncPresence({ isSharing: false });
  }, [closeAllPeerConnections, sendSignal, stopLocalStream, syncPresence]);

  stopSharingRef.current = stopSharing;

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      const config = await getScreenShareSessionAction();
      if (cancelled) return;

      if (!config.enabled || !config.channelName || !config.supabaseUrl || !config.supabaseAnonKey) {
        setState((prev) => ({
          ...prev,
          ready: true,
          enabled: false,
          error: config.reason ?? "Screen sharing is not configured.",
        }));
        return;
      }

      const participantId = getOrCreateParticipantId();
      const participantName = getOrCreateParticipantName(participantId);
      participantIdRef.current = participantId;

      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        realtime: { params: { eventsPerSecond: 10 } },
      });
      supabaseRef.current = supabase;

      const channel = supabase.channel(config.channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: participantIdRef.current },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const participants = parsePresenceState(
            channel.presenceState<PresenceMeta>(),
            participantIdRef.current
          );
          updateParticipants(participants);

          const sharerId = getActiveSharer(participants);
          const selfSharing = participants.find(
            (participant) => participant.id === participantIdRef.current
          )?.isSharing;

          if (selfSharing && localStreamRef.current) {
            connectViewers(participants);
          } else if (sharerId && sharerId !== participantIdRef.current && !localStreamRef.current) {
            connectToSharer(sharerId);
          }
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          const joined = newPresences[0]?.presence as PresenceMeta | undefined;
          if (!joined?.isSharing || key === participantIdRef.current) return;
          if (localStreamRef.current) {
            createPeerConnection(key, true);
          } else {
            connectToSharer(key);
          }
        })
        .on("broadcast", { event: "signal" }, ({ payload }) => {
          void handleSignal(payload as SignalPayload);
        });

      channel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        await channel.track({
          name: participantName,
          isSharing: false,
          joinedAt: Date.now(),
        });

        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            ready: true,
            enabled: true,
            error: null,
          }));
        }
      });

      channelRef.current = channel;
    }

    void connect();

    return () => {
      cancelled = true;
      stopLocalStream();
      stopRemoteStream();
      closeAllPeerConnections();
      if (channelRef.current) {
        void channelRef.current.untrack();
        void supabaseRef.current?.removeChannel(channelRef.current);
      }
      channelRef.current = null;
      supabaseRef.current = null;
    };
  }, [
    closeAllPeerConnections,
    connectToSharer,
    connectViewers,
    createPeerConnection,
    handleSignal,
    stopLocalStream,
    stopRemoteStream,
    updateParticipants,
  ]);

  return {
    ...state,
    startSharing,
    stopSharing,
  };
}
