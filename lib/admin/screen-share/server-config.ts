import { createHash } from "crypto";
import { getSessionSecret } from "@/lib/admin/auth";

export const SCREEN_SHARE_CHANNEL_PREFIX = "jhcleans-admin-screen-share";

export function getScreenShareChannelName(): string {
  const key = createHash("sha256")
    .update(getSessionSecret())
    .update(":screen-share")
    .digest("hex")
    .slice(0, 24);

  return `${SCREEN_SHARE_CHANNEL_PREFIX}:${key}`;
}
