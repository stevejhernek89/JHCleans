import { HeroSection } from "@/components/home/hero-section";
import { FeatureCards } from "@/components/home/feature-cards";
import { StatsBar } from "@/components/home/stats-bar";
import { HowItWorks } from "@/components/home/how-it-works";
import { BeforeAfterSlider } from "@/components/home/before-after-slider";
import { PricingSection } from "@/components/home/pricing-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ServiceAreaSection } from "@/components/home/service-area-section";
import { FaqSection } from "@/components/home/service-area-section";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <StatsBar />
      <HowItWorks />
      <BeforeAfterSlider />
      <PricingSection />
      <TestimonialsSection />
      <ServiceAreaSection />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FaqSection />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
