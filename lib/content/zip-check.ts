import type { SiteContent } from "./types";

export function checkZipCode(
  zip: string,
  serviceArea: SiteContent["serviceArea"]
): "serviced" | "maybe" | "not-serviced" {
  const normalized = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(normalized)) return "not-serviced";

  if (serviceArea.servicedZipCodes.includes(normalized)) {
    return "serviced";
  }
  if (serviceArea.maybeZipCodes.includes(normalized)) {
    return "maybe";
  }
  return "not-serviced";
}
