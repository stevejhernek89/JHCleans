import { businessConfig } from "@/lib/config/business";
import { faqItems } from "@/lib/config/content";
import type { Metadata } from "next";

const siteUrl = businessConfig.domain;

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description = businessConfig.description,
  path = "",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = title === businessConfig.name
    ? `${businessConfig.name} | ${businessConfig.tagline}`
    : `${title} | ${businessConfig.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: businessConfig.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessConfig.name,
    description: businessConfig.description,
    url: siteUrl,
    // Do not include unverified address, phone, or ratings
    ...(businessConfig.contact.phoneTel
      ? { telephone: businessConfig.contact.phoneTel }
      : {}),
    ...(businessConfig.contact.email &&
    !businessConfig.contact.email.includes("[")
      ? { email: businessConfig.contact.email }
      : {}),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Residential Garbage Can Cleaning",
    provider: {
      "@type": "LocalBusiness",
      name: businessConfig.name,
      url: siteUrl,
    },
    description: businessConfig.description,
    serviceType: "Garbage can cleaning, sanitizing, and deodorizing",
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
