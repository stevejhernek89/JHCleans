import type { BillingType, PricingPlan, ServiceOffering } from "@/lib/config/pricing";
import type { ZipStatus } from "@/lib/config/service-area";

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number | null;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface Founder {
  id: string;
  name: string | null;
  role: string;
  image: string | null;
  imageAlt: string;
}

export interface ServiceCity {
  name: string;
  state: string;
}

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalPageContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface PricingPreviewPlan {
  name: string;
  description: string;
  price: string;
  note: string;
  popular: boolean;
}

export interface PageHeading {
  title: string;
  subtitle: string;
}

export interface SiteContent {
  business: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    contact: {
      phone: string;
      phoneTel: string;
      email: string;
      textEnabled: boolean;
      address: {
        city: string;
        state: string;
        display: string;
      };
    };
    hours: {
      weekdays: string;
      saturday: string;
      sunday: string;
      note: string;
    };
    social: {
      facebook: string;
      instagram: string;
      tiktok: string;
      yelp: string;
      google: string;
    };
    stats: {
      enabled: boolean;
      items: Array<{
        id: string;
        label: string;
        value: string;
        icon: string;
      }>;
    };
    claims: {
      bacteriaRemoval: string;
      ecoCertification: string;
      satisfactionGuarantee: string;
    };
    booking: {
      minLeadDays: number;
      maxLeadDays: number;
      timeWindows: Array<{ value: string; label: string }>;
      trashDays: string[];
    };
  };
  navigation: NavLink[];
  layout: {
    headerCta: string;
    mobileQuoteCta: string;
    mobileBookCta: string;
    footerBookLabel: string;
  };
  homepage: {
    hero: {
      badge: string;
      headline: string;
      headlineAccent: string;
      primaryCta: string;
      secondaryCta: string;
      trustIndicators: string[];
    };
    sections: {
      howItWorks: PageHeading;
      beforeAfter: {
        title: string;
        subtitle: string;
        beforeLabel: string;
        afterLabel: string;
        caption: string;
      };
      pricing: PageHeading;
      testimonials: { title: string };
      serviceArea: PageHeading;
      faq: { title: string };
    };
    finalCta: {
      title: string;
      body: string;
      primaryCta: string;
      secondaryCta: string;
    };
    pricingPreview: PricingPreviewPlan[];
  };
  pages: {
    services: PageHeading & { ctaLabel: string };
    pricing: PageHeading & { quoteTitle: string; quoteSubtitle: string };
    contact: PageHeading & { sidebarTitle: string; hoursTitle: string };
    book: PageHeading;
  };
  features: FeatureCard[];
  howItWorksSteps: HowItWorksStep[];
  faq: FaqItem[];
  testimonials: {
    enabled: boolean;
    isPlaceholder: boolean;
    items: TestimonialItem[];
  };
  about: {
    headline: string;
    story: string[];
    values: AboutValue[];
    foundersNote: string;
    photoPlaceholder: string;
    founders: Founder[];
  };
  pricing: {
    recurringSavingsLabel: string;
    savingsPercent: number | null;
    plans: PricingPlan[];
  };
  services: ServiceOffering[];
  serviceArea: {
    servicedZipCodes: string[];
    maybeZipCodes: string[];
    featuredCities: ServiceCity[];
    regionLabel: string;
    mapNote: string;
    zipMessages: Record<
      ZipStatus,
      { title: string; description: string; variant: "success" | "warning" | "neutral" }
    >;
  };
  legal: {
    privacy: LegalPageContent;
    terms: LegalPageContent;
    cancellation: LegalPageContent;
    serviceAgreement: LegalPageContent;
  };
  updatedAt: string;
}

export type SiteContentSection = keyof SiteContent;

export type { BillingType, PricingPlan, ServiceOffering };
