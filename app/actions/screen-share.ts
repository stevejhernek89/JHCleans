"use server";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getSupabaseAnonKey,
  getSupabasePublicUrl,
  isScreenShareEnabled,
} from "@/lib/admin/screen-share/config";
import { getScreenShareChannelName } from "@/lib/admin/screen-share/server-config";
import type { ScreenShareSessionConfig } from "@/lib/admin/screen-share/types";

export async function getScreenShareSessionAction(): Promise<ScreenShareSessionConfig> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return { enabled: false, reason: "Sign in to the admin portal to use screen sharing." };
  }

  if (!isScreenShareEnabled()) {
    return {
      enabled: false,
      reason:
        "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment to enable live screen sharing between admins.",
    };
  }

  return {
    enabled: true,
    channelName: getScreenShareChannelName(),
    supabaseUrl: getSupabasePublicUrl(),
    supabaseAnonKey: getSupabaseAnonKey(),
  };
}
