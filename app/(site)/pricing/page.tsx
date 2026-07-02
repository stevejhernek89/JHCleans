import { createPageMetadata } from "@/lib/seo/metadata";
import { PricingSection } from "@/components/home/pricing-section";
import { QuoteForm } from "@/components/booking/quote-form";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "View JHCleans pricing plans for one-time, monthly, and multi-can garbage can cleaning services.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <PricingSection />
      <div className="mx-auto max-w-xl px-4 sm:px-6 pb-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Need a Custom Quote?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tell us about your bins and we&apos;ll send pricing details.
          </p>
        </div>
        <QuoteForm />
      </div>
      <FinalCta />
    </div>
  );
}
