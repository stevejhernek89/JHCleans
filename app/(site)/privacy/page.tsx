import { createPageMetadata } from "@/lib/seo/metadata";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "JHCleans.com privacy policy — how we collect, use, and protect your information.",
  path: "/privacy",
  noIndex: true,
});

const sections = [
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

export default function PrivacyPage() {
  return (
    <LegalTemplate
      title="Privacy Policy"
      lastUpdated="[UPDATE DATE BEFORE LAUNCH]"
      sections={sections}
    />
  );
}
