import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";
import { CookieConsentProvider } from "@/components/layout/cookie-consent-provider";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { getSiteContent } from "@/lib/content/get-content";
import { SiteContentProvider } from "@/lib/content/site-content-context";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
      <CookieConsentProvider>
        <AnalyticsScripts />
        <Header />
        <main id="main-content" className="flex-1 pb-20 sm:pb-0">
          {children}
        </main>
        <Footer />
        <Suspense fallback={null}>
          <MobileStickyBar />
        </Suspense>
      </CookieConsentProvider>
    </SiteContentProvider>
  );
}
