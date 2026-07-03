export function getSupabasePublicUrl(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function isScreenShareEnabled(): boolean {
  return Boolean(getSupabasePublicUrl() && getSupabaseAnonKey());
}

export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function getOrCreateParticipantId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "jhcleans_admin_screen_share_id";
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `admin-${Math.random().toString(36).slice(2, 10)}`;

  window.sessionStorage.setItem(storageKey, id);
  return id;
}

export function getOrCreateParticipantName(participantId: string): string {
  if (typeof window === "undefined") {
    return "Admin";
  }

  const storageKey = "jhcleans_admin_screen_share_name";
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const suffix = participantId.replace(/-/g, "").slice(0, 4).toUpperCase();
  const name = `Admin ${suffix}`;
  window.sessionStorage.setItem(storageKey, name);
  return name;
}
