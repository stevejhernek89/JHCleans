import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <MobileStickyBar />
      </Suspense>
    </>
  );
}
