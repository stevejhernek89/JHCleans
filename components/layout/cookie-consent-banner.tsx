"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
}

export function CookieConsentBanner({
  onAcceptAll,
  onEssentialOnly,
}: CookieConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/95 p-4 shadow-2xl backdrop-blur-sm sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-2">
          <h2 id="cookie-consent-title" className="text-base font-semibold text-foreground">
            Cookie preferences
          </h2>
          <p id="cookie-consent-description" className="text-sm leading-relaxed text-muted-foreground">
            We use essential cookies to remember your choices and keep the site working.
            With your consent, we may also use analytics and marketing cookies (such as Google
            Analytics or Meta Pixel) to understand site usage and improve our services. You can
            change your preferences at any time. See our{" "}
            <Link href="/privacy#cookies-and-similar-technologies" className="text-accent hover:underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" onClick={onEssentialOnly}>
            Essential only
          </Button>
          <Button type="button" onClick={onAcceptAll}>
            Accept all cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
