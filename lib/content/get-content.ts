import { cache } from "react";
import { getDefaultSiteContent } from "./defaults";
import { deepMerge } from "./merge";
import type { SiteContent } from "./types";
import { getSiteContentOverrides } from "@/lib/admin/store";

export { checkZipCode } from "./zip-check";

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const defaults = getDefaultSiteContent();
  const overrides = await getSiteContentOverrides();
  const merged = deepMerge(defaults, overrides ?? undefined);
  merged.updatedAt = overrides?.updatedAt ?? defaults.updatedAt;
  return merged;
});
