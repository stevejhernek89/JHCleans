import { createPageMetadata } from "@/lib/seo/metadata";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Service Agreement",
  description: "JHCleans.com service agreement outlining terms for garbage can cleaning services.",
  path: "/service-agreement",
  noIndex: true,
});

const sections = [
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

export default function ServiceAgreementPage() {
  return (
    <LegalTemplate
      title="Service Agreement"
      lastUpdated="[UPDATE DATE BEFORE LAUNCH]"
      sections={sections}
    />
  );
}
