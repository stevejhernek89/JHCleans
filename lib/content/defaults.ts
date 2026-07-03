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
    title: "Introduction",
    content: `This Privacy Policy describes how ${businessConfig.name} ("${businessConfig.shortName}," "we," "us," or "our") collects, uses, discloses, and protects personal information when you visit our website at ${businessConfig.domain}, submit forms, book services, or otherwise interact with us.

We operate a local residential garbage-can cleaning business and are committed to handling personal information responsibly and in compliance with applicable laws, including New York State privacy and data-security requirements.

This policy applies to information collected through our website and related communications. It does not apply to third-party websites or services that may be linked from our site.`,
  },
  {
    title: "Information We Collect",
    content: `We may collect the following categories of personal information:

Information you provide directly. When you submit a booking request, contact form, or quote request, we may collect your name, email address, phone number, service address (including street address, city, state, and ZIP code), service preferences, bin counts, preferred dates or times, trash-day information, and any message or notes you choose to provide.

Automatically collected information. When you visit our website, we and our service providers may automatically collect technical information such as your IP address, browser type, device type, operating system, referring URLs, pages viewed, and approximate location derived from IP address. This information is collected through cookies, pixels, and similar technologies when you consent to analytics or marketing cookies, or when necessary for essential site operation.

Communications. If you contact us by phone, email, or text, we may keep a record of that correspondence.

We do not intentionally collect sensitive categories of personal information such as Social Security numbers, financial account numbers, or precise geolocation beyond what is needed to schedule service.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use personal information for the following purposes:

To respond to inquiries, provide quotes, and process booking or service requests.

To schedule, perform, and follow up on cleaning services.

To send service-related communications, such as confirmations, reminders, rescheduling notices, or responses to your questions.

To operate, maintain, secure, and improve our website and customer experience.

To analyze website traffic and measure marketing performance when you have consented to analytics or marketing cookies.

To comply with legal obligations, enforce our terms, and protect our rights, customers, and business.

We do not sell your personal information. We do not use personal information for targeted advertising to individuals we know are under 18 years of age.`,
  },
  {
    title: "How We Share Information",
    content: `We may share personal information with trusted service providers that help us operate our business, including:

Email delivery providers (such as Resend) to send notifications about form submissions and service requests.

Database or hosting providers (such as Supabase or our website host) to securely store submissions and site content when configured.

Analytics and advertising technology providers (such as Google Analytics, Google Tag Manager, or Meta Pixel) only when you have accepted non-essential cookies.

Professional advisors, insurers, or authorities when required by law, court order, or to protect rights, safety, and security.

All service providers are authorized to use personal information only as needed to perform services for us and are expected to maintain appropriate safeguards.

We may also share information if our business is reorganized, sold, or merged, subject to this Privacy Policy or a successor notice.`,
  },
  {
    title: "Cookies and Similar Technologies",
    content: `Our website uses cookies and similar technologies to remember preferences, keep the site functioning, and—only with your consent—help us understand how visitors use the site.

Essential cookies. These are necessary for basic site functionality, such as remembering your cookie preferences. Essential cookies do not require consent under applicable law.

Analytics and marketing cookies. If enabled, we may use tools such as Google Analytics, Google Tag Manager, and Meta Pixel. These technologies may set cookies or use pixels to collect usage data, device identifiers, and interaction information. Analytics and marketing cookies are loaded only after you click "Accept all cookies" in our cookie banner.

Local storage. We store your cookie preference choice in your browser's local storage so we do not ask for your choice on every visit.

Managing cookies. You can change your preferences at any time using the "Cookie Settings" link in our website footer. You may also control cookies through your browser settings, including blocking or deleting cookies. Disabling essential cookies may affect site functionality. Disabling analytics cookies will not prevent you from using our forms or requesting service.

Do Not Track and Global Privacy Control. Some browsers send "Do Not Track" signals. Where required by law, we honor legally recognized opt-out preference signals, including Global Privacy Control (GPC), for applicable processing such as sale or sharing of personal information for targeted advertising. At this time, we do not sell personal information or use it for cross-context behavioral advertising.`,
  },
  {
    title: "Data Retention",
    content: `We retain personal information only for as long as reasonably necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.

Form submissions and service records are generally retained while we are actively managing your request or providing service, and for a reasonable period afterward for customer support, dispute resolution, and business recordkeeping.

Analytics data retained by third-party providers is governed by those providers' retention settings.

When personal information is no longer needed, we take reasonable steps to delete, anonymize, or securely dispose of it.`,
  },
  {
    title: "Data Security",
    content: `We maintain reasonable administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, disclosure, alteration, or destruction, consistent with the requirements of the New York Stop Hacks and Improve Electronic Data Security Act (SHIELD Act) and other applicable laws.

Safeguards may include access controls, secure hosting environments, encrypted connections (HTTPS), limited access on a need-to-know basis, and use of reputable service providers with their own security programs.

No method of transmission or storage is completely secure. While we work to protect your information, we cannot guarantee absolute security.`,
  },
  {
    title: "Data Breach Notification",
    content: `If we determine that personal information has been accessed or acquired without valid authorization, we will notify affected individuals and regulators as required by applicable law, including New York's breach-notification requirements under General Business Law § 899-aa and related SHIELD Act provisions.

Notifications may be provided by email, postal mail, or other permitted methods and will describe the incident, the types of information involved, and steps you can take to protect yourself, to the extent known at the time of notice.`,
  },
  {
    title: "Your Privacy Rights",
    content: `Depending on where you live, you may have rights regarding your personal information. We will honor valid requests to the extent required by applicable law.

You may request access to the personal information we maintain about you.

You may request correction of inaccurate personal information.

You may request deletion of personal information, subject to legal or business recordkeeping exceptions.

You may opt out of marketing emails by following unsubscribe instructions in our messages or by contacting us directly.

If you previously consented to analytics or marketing cookies, you may withdraw consent at any time using Cookie Settings in our website footer.

New York residents. New York law requires businesses that own or license private information of New York residents to maintain reasonable safeguards and provide breach notification when required. We do not sell personal information. If you are a New York resident and have privacy questions or wish to exercise available rights, contact us using the information below.

California residents. If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA/CPRA), including the right to know, delete, and correct personal information, and to opt out of sale or sharing. We do not sell or share personal information for cross-context behavioral advertising.

Other state residents. Residents of Colorado, Connecticut, Virginia, and other states with comprehensive privacy laws may have similar rights where applicable.

To submit a privacy request, contact us using the details in the Contact section below. We may need to verify your identity before responding. We will not discriminate against you for exercising privacy rights protected by law.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are directed to adults and households scheduling residential cleaning services. We do not knowingly collect personal information online from children under 13 without verifiable parental consent, consistent with the Children's Online Privacy Protection Act (COPPA).

We also do not knowingly collect, process, or use personal information of minors under 18 for targeted advertising, consistent with New York's protections for children and teens, including the NY SAFE for Kids Act and New York Child Data Protection Act, where applicable.

If you believe we have collected personal information from a child without appropriate consent, please contact us promptly and we will take appropriate steps to delete it.`,
  },
  {
    title: "Communications and Consent",
    content: `When you submit a form on our website, you consent to us contacting you about your request using the contact information you provide. If you provide a phone number, you agree that we may call or text you regarding your inquiry or service, including service updates. Message and data rates may apply. You may opt out of promotional messages at any time; service-related messages may still be sent as needed to fulfill a request or active service.

Marketing emails, if sent, will include an unsubscribe option.`,
  },
  {
    title: "Third-Party Links",
    content: `Our website may contain links to third-party websites or services, such as social media platforms. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing personal information to them.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. When we make material changes, we will update the "Last updated" date at the top of this page. Your continued use of the website after an update constitutes acceptance of the revised policy, except where further consent is required by law.`,
  },
  {
    title: "Contact Us",
    content: `For privacy questions, cookie preferences, or to exercise your privacy rights, contact us through the information on our Contact page or by email using the business contact address listed on our website.

If no public email is listed yet, privacy requests may be sent to the guardian-managed business contact configured for ${businessConfig.shortName}. We will respond to verified requests within the timeframes required by applicable law.`,
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
        lastUpdated: "July 2, 2026",
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
