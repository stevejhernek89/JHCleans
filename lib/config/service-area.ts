/**
 * Service area configuration
 *
 * TODO: Replace placeholder ZIP codes and cities with actual service area
 * before launch. Do not assume a region until confirmed.
 */

export type ZipStatus = "serviced" | "maybe" | "not-serviced";

export interface ServiceCity {
  name: string;
  state: string;
}

export const serviceAreaConfig = {
  // Primary serviced ZIP codes — customers see "Great news" message
  servicedZipCodes: [] as string[],

  // Border / expanding area — customers see "contact us" message
  maybeZipCodes: [] as string[],

  // Placeholder cities for map display — replace with real cities
  featuredCities: [
    { name: "[City 1]", state: "[ST]" },
    { name: "[City 2]", state: "[ST]" },
    { name: "[City 3]", state: "[ST]" },
    { name: "[City 4]", state: "[ST]" },
    { name: "[City 5]", state: "[ST]" },
    { name: "[City 6]", state: "[ST]" },
  ] as ServiceCity[],

  regionLabel: "[Service region coming soon]",
  mapNote: "Service area map — add real coverage details before launch",
} as const;

export function checkZipCode(zip: string): ZipStatus {
  const normalized = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(normalized)) return "not-serviced";

  if (serviceAreaConfig.servicedZipCodes.includes(normalized)) {
    return "serviced";
  }
  if (serviceAreaConfig.maybeZipCodes.includes(normalized)) {
    return "maybe";
  }
  return "not-serviced";
}

export const zipStatusMessages: Record<
  ZipStatus,
  { title: string; description: string; variant: "success" | "warning" | "neutral" }
> = {
  serviced: {
    title: "Great news—we service your area!",
    description:
      "You're within our service zone. Book online or request a quote to get started.",
    variant: "success",
  },
  maybe: {
    title: "We may service your area—contact us",
    description:
      "Your ZIP code is near our coverage area. Reach out and we'll confirm availability.",
    variant: "warning",
  },
  "not-serviced": {
    title: "We're not in your area yet",
    description:
      "We aren't currently serving this ZIP code, but we're expanding. Contact us to express interest.",
    variant: "neutral",
  },
};
