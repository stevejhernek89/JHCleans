"use client";

import { useCookieConsent } from "@/components/layout/cookie-consent-provider";

export function CookieSettingsLink() {
  const { openBanner } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openBanner}
      className="text-muted-foreground hover:text-accent"
    >
      Cookie Settings
    </button>
  );
}
