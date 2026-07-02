"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/content/site-content-context";
import { trackCtaClick } from "@/lib/analytics/track";

export function MobileStickyBar() {
  const pathname = usePathname();
  const { layout } = useSiteContent();

  if (pathname === "/book") return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 glass p-3 sm:hidden"
      role="complementary"
      aria-label="Quick booking"
    >
      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1" size="sm">
          <Link
            href="/contact?subject=quote"
            onClick={() => trackCtaClick("mobile_sticky_quote")}
          >
            {layout.mobileQuoteCta}
          </Link>
        </Button>
        <Button asChild className="flex-1" size="sm">
          <Link href="/book" onClick={() => trackCtaClick("mobile_sticky_book")}>
            {layout.mobileBookCta}
          </Link>
        </Button>
      </div>
    </div>
  );
}
