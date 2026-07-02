/**
 * Central business configuration for JHCleans.com
 *
 * UPDATE THIS FILE before launch with real contact info, pricing,
 * service areas, social links, and verified claims.
 *
 * NOTE: Public contact information should be parent- or guardian-managed
 * since the founders may be minors. Do not publish personal phone numbers
 * or home addresses here.
 */

export const businessConfig = {
  name: "JHCleans.com",
  shortName: "JHCleans",
  domain: "https://jhcleans.com",
  tagline: "Cleaner Cans. Fresher Homes.",
  description:
    "Professional garbage-can cleaning, sanitizing, and deodorizing delivered right to your curb.",

  // TODO: Replace with guardian-managed business contact before launch
  contact: {
    phone: "[Phone number coming soon]",
    phoneTel: "", // e.g. "+15551234567" — leave empty until configured
    email: "[Email coming soon]",
    textEnabled: false,
    address: {
      city: "[City coming soon]",
      state: "[State coming soon]",
      display: "[Service area coming soon]",
    },
  },

  hours: {
    weekdays: "Monday – Friday: [Hours coming soon]",
    saturday: "Saturday: [Hours coming soon]",
    sunday: "Sunday: Closed",
    note: "Online booking available 24/7",
  },

  social: {
    // Only icons with configured URLs will render in the footer
    facebook: "",
    instagram: "",
    tiktok: "",
    yelp: "",
    google: "",
  },

  booking: {
    minLeadDays: 1,
    maxLeadDays: 60,
    timeWindows: [
      { value: "morning", label: "Morning (8 AM – 12 PM)" },
      { value: "afternoon", label: "Afternoon (12 PM – 4 PM)" },
      { value: "flexible", label: "Flexible — any time works" },
    ],
    trashDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Varies / Not sure",
    ],
  },

  // Statistics — only displayed when enabled and values are configured
  stats: {
    enabled: false,
    items: [
      { id: "customers", label: "Happy Customers", value: "", icon: "smile" },
      { id: "bins", label: "Bins Cleaned", value: "", icon: "sparkles" },
      { id: "sanitizing", label: "Sanitizing Focus", value: "", icon: "shield" },
      { id: "eco", label: "Eco-Conscious Products", value: "", icon: "leaf" },
    ],
  },

  // Environmental / sanitation claims — keep empty until verified
  claims: {
    bacteriaRemoval: "",
    ecoCertification: "",
    satisfactionGuarantee:
      "We stand behind our work and want every customer to feel confident in their service.",
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    googleSearchConsole: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  },

  owner: {
    // Internal / guardian contact — not displayed publicly
    guardianEmail: process.env.GUARDIAN_EMAIL ?? "",
    guardianName: process.env.GUARDIAN_NAME ?? "",
  },
} as const;

export type BusinessConfig = typeof businessConfig;
