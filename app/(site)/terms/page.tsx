import { createPageMetadata } from "@/lib/seo/metadata";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "JHCleans.com terms of service for website use and service requests.",
  path: "/terms",
  noIndex: true,
});

const sections = [
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

export default function TermsPage() {
  return (
    <LegalTemplate
      title="Terms of Service"
      lastUpdated="[UPDATE DATE BEFORE LAUNCH]"
      sections={sections}
    />
  );
}
