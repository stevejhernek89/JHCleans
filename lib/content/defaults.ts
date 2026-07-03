import { businessConfig } from "@/lib/config/business";
import {
  aboutContent,
  faqItems,
  featureCards,
  howItWorksSteps,
  navigationLinks,
  testimonialsConfig,
} from "@/lib/config/content";
import { pricingConfig, servicesConfig } from "@/lib/config/pricing";
import { serviceAreaConfig, zipStatusMessages } from "@/lib/config/service-area";
import type { SiteContent } from "./types";

const privacySections = [
  {
    title: "Information We Collect",
    content:
      "We may collect personal information you provide through our website forms, including your name, email address, phone number, service address, and booking preferences. We may also collect technical information such as browser type and pages visited through analytics tools, when enabled.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information you provide to respond to inquiries, process booking requests, schedule services, and improve our website. We do not sell your personal information to third parties.",
  },
  {
    title: "Data Storage and Security",
    content:
      "We take reasonable measures to protect your information. Form submissions may be stored securely and processed through third-party services such as email delivery providers. [UPDATE: Describe your actual data storage practices before launch.]",
  },
  {
    title: "Cookies and Analytics",
    content:
      "Our website may use cookies and analytics tools (such as Google Analytics) to understand how visitors use our site. These tools are only enabled when configured through environment variables. You can control cookie preferences through your browser settings.",
  },
  {
    title: "Children's Privacy",
    content:
      "Our services are directed at homeowners and adults scheduling household services. We do not knowingly collect personal information from children under 13 without parental consent.",
  },
  {
    title: "Your Rights",
    content:
      "You may request access to, correction of, or deletion of your personal information by contacting us using the information on our Contact page. [UPDATE: Add jurisdiction-specific rights as applicable.]",
  },
  {
    title: "Contact",
    content:
      "For privacy-related questions, contact us through the information provided on our Contact page. [UPDATE: Add guardian-managed contact email before launch.]",
  },
];

const termsSections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using the JHCleans.com website, you agree to these Terms of Service. If you do not agree, please do not use our website.",
  },
  {
    title: "Service Description",
    content:
      "JHCleans provides residential garbage can cleaning, sanitizing, and deodorizing services. Service availability, pricing, and scheduling are subject to confirmation. Submitting a booking request does not guarantee a confirmed appointment until verified by our team.",
  },
  {
    title: "Website Use",
    content:
      "You agree to use this website only for lawful purposes. You may not attempt to interfere with the website's operation, submit false information, or use automated systems to access the site without permission.",
  },
  {
    title: "Pricing and Payment",
    content:
      "Pricing displayed on this website may be placeholder information until final rates are confirmed. Actual pricing will be communicated before service is rendered. [UPDATE: Add payment terms before launch.]",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by law, JHCleans shall not be liable for any indirect, incidental, or consequential damages arising from use of this website or our services. [UPDATE: Have a licensed attorney review before launch.]",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the updated terms.",
  },
];

const cancellationSections = [
  {
    title: "Rescheduling",
    content:
      "We understand plans change. Please contact us as soon as possible to reschedule your service. We will do our best to accommodate your preferred new date.",
  },
  {
    title: "Cancellations",
    content:
      "[UPDATE BEFORE LAUNCH: Add specific cancellation notice requirements, e.g., 'Cancellations must be made at least 24 hours before your scheduled service.']",
  },
  {
    title: "Recurring Plans",
    content:
      "Recurring plan customers may pause or cancel their subscription by contacting us. [UPDATE: Add notice period and any applicable fees before launch.]",
  },
  {
    title: "No-Show Policy",
    content:
      "If bins are not accessible or not empty at the time of service, we may need to reschedule. [UPDATE: Define any fees for missed appointments before launch.]",
  },
  {
    title: "Contact for Changes",
    content:
      "To reschedule or cancel, contact us through the information on our Contact page. [UPDATE: Add guardian-managed phone and email before launch.]",
  },
];

const serviceAgreementSections = [
  {
    title: "Scope of Service",
    content:
      "JHCleans provides curbside garbage and recycling can cleaning, sanitizing, and deodorizing. Service includes exterior and interior cleaning using professional equipment at the customer's designated location.",
  },
  {
    title: "Customer Responsibilities",
    content:
      "Customers must ensure bins are empty and accessible at the agreed location on the scheduled service day. Customers should provide accurate contact information, address details, and any gate or access instructions.",
  },
  {
    title: "Scheduling and Access",
    content:
      "Service dates and times are subject to confirmation. Customers do not need to be home during service as long as bins are accessible. We will make reasonable efforts to notify customers of any schedule changes.",
  },
  {
    title: "Weather Policy",
    content:
      "Service may be rescheduled due to severe weather conditions at no additional charge. Light rain typically does not affect service.",
  },
  {
    title: "Payment Terms",
    content:
      "[UPDATE BEFORE LAUNCH: Add accepted payment methods, billing cycles for recurring plans, and late payment policies.]",
  },
  {
    title: "Satisfaction",
    content:
      "We are committed to quality service. If you have concerns about your cleaning, contact us promptly so we can address the issue.",
  },
];

export function getDefaultSiteContent(): SiteContent {
  return {
    business: {
      name: businessConfig.name,
      shortName: businessConfig.shortName,
      tagline: businessConfig.tagline,
      description: businessConfig.description,
      contact: {
        phone: businessConfig.contact.phone,
        phoneTel: businessConfig.contact.phoneTel,
        email: businessConfig.contact.email,
        textEnabled: businessConfig.contact.textEnabled,
        address: {
          city: businessConfig.contact.address.city,
          state: businessConfig.contact.address.state,
          display: businessConfig.contact.address.display,
        },
      },
      hours: { ...businessConfig.hours },
      social: { ...businessConfig.social },
      stats: {
        enabled: businessConfig.stats.enabled,
        items: businessConfig.stats.items.map((item) => ({ ...item })),
      },
      claims: { ...businessConfig.claims },
      booking: {
        minLeadDays: businessConfig.booking.minLeadDays,
        maxLeadDays: businessConfig.booking.maxLeadDays,
        timeWindows: businessConfig.booking.timeWindows.map((item) => ({ ...item })),
        trashDays: [...businessConfig.booking.trashDays],
      },
    },
    navigation: navigationLinks.map((link) => ({ ...link })),
    layout: {
      headerCta: "Book Now",
      mobileQuoteCta: "Get Quote",
      mobileBookCta: "Book Now",
      footerBookLabel: "Book Now",
    },
    homepage: {
      hero: {
        badge: "Professional Curbside Service",
        headline: "Professional Garbage Can Cleaning,",
        headlineAccent: "Sanitizing & Deodorizing",
        primaryCta: "Book a Cleaning",
        secondaryCta: "Get a Free Quote",
        trustIndicators: [
          "Convenient curbside service",
          "Family-focused local business",
          "Satisfaction-focused service",
        ],
      },
      sections: {
        howItWorks: {
          title: "How It Works",
          subtitle: "Four simple steps to cleaner, fresher bins",
        },
        beforeAfter: {
          title: "See the Difference",
          subtitle: "Drag the slider to compare before and after cleaning.",
          beforeLabel: "Before",
          afterLabel: "After",
          caption: "Professional deep cleaning makes a visible difference.",
        },
        pricing: {
          title: "Simple, Transparent Pricing",
          subtitle: "Choose the plan that fits your home. Final pricing coming soon.",
        },
        testimonials: {
          title: "What Our Customers Say",
        },
        serviceArea: {
          title: "Service Area",
          subtitle: "Check if we service your ZIP code.",
        },
        faq: {
          title: "Frequently Asked Questions",
        },
      },
      finalCta: {
        title: "Ready for Cleaner, Fresher Cans?",
        body: "Book your first cleaning today and take one unpleasant household job off your list.",
        primaryCta: "Book a Cleaning",
        secondaryCta: "Request a Quote",
      },
      pricingPreview: [
        {
          name: "One-Time Clean",
          description: "Perfect for a fresh start.",
          price: "$35",
          note: "per bin · one-time visit",
          popular: false,
        },
        {
          name: "Monthly Plan",
          description: "Keep your bins fresh all month.",
          price: "$25",
          note: "per bin · billed monthly",
          popular: true,
        },
        {
          name: "Multi-Bin Plan",
          description: "Great for families with extra bins.",
          price: "$22",
          note: "per bin · 3+ bins",
          popular: false,
        },
      ],
    },
    pages: {
      services: {
        title: "Our Services",
        subtitle:
          "Professional curbside garbage can cleaning, sanitizing, and deodorizing for residential and small commercial customers.",
        ctaLabel: "Book This Service",
      },
      pricing: {
        title: "Pricing",
        subtitle: "Choose the plan that fits your home.",
        quoteTitle: "Need a Custom Quote?",
        quoteSubtitle: "Tell us about your bins and we'll send pricing details.",
      },
      contact: {
        title: "Contact Us",
        subtitle: "Have a question or need a quote? We're here to help.",
        sidebarTitle: "Get in Touch",
        hoursTitle: "Business Hours",
      },
      book: {
        title: "Book a Cleaning",
        subtitle: "Complete the form below to request your curbside bin cleaning service.",
      },
    },
    features: featureCards.map((item) => ({ ...item })),
    howItWorksSteps: howItWorksSteps.map((item) => ({ ...item })),
    faq: faqItems.map((item) => ({ ...item })),
    testimonials: {
      enabled: testimonialsConfig.enabled,
      isPlaceholder: testimonialsConfig.isPlaceholder,
      items: testimonialsConfig.items.map((item) => ({ ...item })),
    },
    about: {
      headline: aboutContent.headline,
      story: [...aboutContent.story],
      values: aboutContent.values.map((item) => ({ ...item })),
      foundersNote: aboutContent.foundersNote,
      photoPlaceholder: aboutContent.photoPlaceholder,
      founders: aboutContent.founders.map((item) => ({ ...item })),
    },
    pricing: {
      recurringSavingsLabel: pricingConfig.recurringSavingsLabel,
      savingsPercent: pricingConfig.savingsPercent,
      plans: pricingConfig.plans.map((plan) => ({
        ...plan,
        features: [...plan.features],
      })),
    },
    services: servicesConfig.map((service) => ({
      ...service,
      included: [...service.included],
    })),
    serviceArea: {
      servicedZipCodes: [...serviceAreaConfig.servicedZipCodes],
      maybeZipCodes: [...serviceAreaConfig.maybeZipCodes],
      featuredCities: serviceAreaConfig.featuredCities.map((city) => ({ ...city })),
      regionLabel: serviceAreaConfig.regionLabel,
      mapNote: serviceAreaConfig.mapNote,
      zipMessages: {
        serviced: { ...zipStatusMessages.serviced },
        maybe: { ...zipStatusMessages.maybe },
        "not-serviced": { ...zipStatusMessages["not-serviced"] },
      },
    },
    legal: {
      privacy: {
        title: "Privacy Policy",
        lastUpdated: "[UPDATE DATE BEFORE LAUNCH]",
        sections: privacySections.map((section) => ({ ...section })),
      },
      terms: {
        title: "Terms of Service",
        lastUpdated: "[UPDATE DATE BEFORE LAUNCH]",
        sections: termsSections.map((section) => ({ ...section })),
      },
      cancellation: {
        title: "Cancellation Policy",
        lastUpdated: "[UPDATE DATE BEFORE LAUNCH]",
        sections: cancellationSections.map((section) => ({ ...section })),
      },
      serviceAgreement: {
        title: "Service Agreement",
        lastUpdated: "[UPDATE DATE BEFORE LAUNCH]",
        sections: serviceAgreementSections.map((section) => ({ ...section })),
      },
    },
    updatedAt: new Date(0).toISOString(),
  };
}
