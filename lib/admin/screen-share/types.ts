export type ScreenShareParticipant = {
  id: string;
  name: string;
  isSharing: boolean;
  joinedAt: number;
};

export type ScreenShareSessionConfig = {
  enabled: boolean;
  reason?: string;
  channelName?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  participantId?: string;
  participantName?: string;
};

export type SignalPayload =
  | {
      kind: "offer";
      from: string;
      to: string;
      sdp: RTCSessionDescriptionInit;
    }
  | {
      kind: "answer";
      from: string;
      to: string;
      sdp: RTCSessionDescriptionInit;
    }
  | {
      kind: "ice";
      from: string;
      to: string;
      candidate: RTCIceCandidateInit;
    }
  | {
      kind: "share-stop";
      from: string;
    };

export type PresenceMeta = {
  name: string;
  isSharing: boolean;
  joinedAt: number;
};

export type ScreenShareRoomState = {
  ready: boolean;
  enabled: boolean;
  error: string | null;
  participants: ScreenShareParticipant[];
  isSharing: boolean;
  activeSharerId: string | null;
  remoteStream: MediaStream | null;
  localPreviewStream: MediaStream | null;
};
