import { createPageMetadata } from "@/lib/seo/metadata";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Cancellation Policy",
  description: "JHCleans.com cancellation and rescheduling policy for garbage can cleaning services.",
  path: "/cancellation",
  noIndex: true,
});

const sections = [
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

export default function CancellationPage() {
  return (
    <LegalTemplate
      title="Cancellation Policy"
      lastUpdated="[UPDATE DATE BEFORE LAUNCH]"
      sections={sections}
    />
  );
}
