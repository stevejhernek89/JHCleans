/**
 * Pricing configuration
 *
 * TODO: Replace placeholder prices with final pricing before launch.
 * All prices shown as "Starting at $XX" or "Request a quote" until confirmed.
 */

export type BillingType = "one-time" | "recurring";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  priceNote?: string;
  billingType: BillingType;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  included: string[];
  duration: string;
  priceLabel: string;
  href: string;
}

export const pricingConfig = {
  recurringSavingsLabel: "Save with recurring service",
  // Do not set savingsPercent until a real value is configured
  savingsPercent: null as number | null,

  plans: [
    {
      id: "one-time",
      name: "One-Time Clean",
      description:
        "Best for customers who want a single deep cleaning before a special event or season.",
      priceLabel: "Starting at $XX",
      priceNote: "Pricing coming soon — request a quote",
      billingType: "one-time" as BillingType,
      features: [
        "Deep interior and exterior cleaning",
        "Deodorizing treatment",
        "Curbside service — no lifting required",
        "One-time scheduled visit",
      ],
      ctaLabel: "Book Now",
      ctaHref: "/book?plan=one-time",
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      description:
        "Our most popular option for households that want consistently fresh, odor-free bins.",
      priceLabel: "Starting at $XX",
      priceNote: "Billed monthly — pricing coming soon",
      billingType: "recurring" as BillingType,
      popular: true,
      features: [
        "Monthly deep clean and deodorizing",
        "Priority scheduling",
        "Email reminders before each visit",
        "Flexible reschedule options",
      ],
      ctaLabel: "Choose Plan",
      ctaHref: "/book?plan=monthly",
    },
    {
      id: "multi-can",
      name: "Multi-Can Plan",
      description:
        "Ideal for homes with multiple garbage and recycling cans that need regular care.",
      priceLabel: "Starting at $XX",
      priceNote: "3+ bins — pricing coming soon",
      billingType: "recurring" as BillingType,
      features: [
        "Discounted per-bin pricing",
        "Covers garbage and recycling cans",
        "Recurring schedule options",
        "Priority customer support",
      ],
      ctaLabel: "Choose Plan",
      ctaHref: "/book?plan=multi-can",
    },
  ] satisfies PricingPlan[],
};

export const servicesConfig: ServiceOffering[] = [
  {
    id: "one-time",
    name: "One-Time Garbage Can Cleaning",
    description:
      "A thorough single visit to deep clean, deodorize, and refresh your bins inside and out.",
    included: [
      "High-pressure wash",
      "Interior scrubbing",
      "Deodorizing treatment",
      "Exterior rinse and dry",
    ],
    duration: "Approx. 15–20 min per bin",
    priceLabel: "Starting at $XX — request a quote",
    href: "/book?plan=one-time",
  },
  {
    id: "monthly",
    name: "Monthly Cleaning",
    description:
      "Scheduled monthly service so your bins stay fresh year-round without you lifting a finger.",
    included: [
      "Monthly deep clean",
      "Deodorizing on every visit",
      "Reminder notifications",
      "Easy online rescheduling",
    ],
    duration: "Approx. 15–20 min per bin",
    priceLabel: "Starting at $XX — request a quote",
    href: "/book?plan=monthly",
  },
  {
    id: "biweekly",
    name: "Biweekly Cleaning",
    description:
      "Twice-a-month service for households that want maximum freshness between trash pickup days.",
    included: [
      "Biweekly deep clean",
      "Deodorizing treatment",
      "Priority scheduling",
      "Recurring billing options",
    ],
    duration: "Approx. 15–20 min per bin",
    priceLabel: "Starting at $XX — request a quote",
    href: "/book?plan=biweekly",
  },
  {
    id: "multi-can",
    name: "Multi-Can Cleaning",
    description:
      "Bundle pricing for homes with three or more garbage and recycling cans.",
    included: [
      "Per-bin discounted rate",
      "All cans cleaned same visit",
      "Flexible recurring options",
      "Custom scheduling",
    ],
    duration: "Varies by number of bins",
    priceLabel: "Starting at $XX — request a quote",
    href: "/book?plan=multi-can",
  },
  {
    id: "move",
    name: "Move-In or Move-Out Cleaning",
    description:
      "Leave bins spotless for new tenants or start fresh in your new home.",
    included: [
      "Deep interior cleaning",
      "Full deodorizing",
      "Exterior restoration",
      "Same-day options when available",
    ],
    duration: "Approx. 20–30 min per bin",
    priceLabel: "Starting at $XX — request a quote",
    href: "/book?plan=one-time",
  },
  {
    id: "commercial",
    name: "Small Commercial Bin Cleaning",
    description:
      "Professional cleaning for small businesses, HOAs, and property managers with curbside bins.",
    included: [
      "Scheduled service visits",
      "Multiple bin support",
      "Deodorizing treatment",
      "Custom service agreements",
    ],
    duration: "Varies — contact for estimate",
    priceLabel: "Request a custom quote",
    href: "/contact?subject=commercial",
  },
];
