import { createPageMetadata } from "@/lib/seo/metadata";
import { ServiceCards } from "@/components/home/service-cards";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore JHCleans garbage can cleaning services — one-time, monthly, biweekly, multi-can, and commercial options.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Professional curbside garbage can cleaning, sanitizing, and deodorizing
            for residential and small commercial customers.
          </p>
        </div>
        <ServiceCards />
      </div>
      <FinalCta />
    </div>
  );
}
