import { hasAnalyticsConsent } from "@/lib/cookies/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  if (window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
}

export function trackConversion(
  type: "booking" | "quote" | "contact" | "phone" | "text" | "zip_check"
) {
  trackEvent(`${type}_conversion`, { event_category: "engagement" });
}

export function trackCtaClick(label: string) {
  trackEvent("cta_click", { event_category: "cta", event_label: label });
}
