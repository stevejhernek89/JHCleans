import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Cancellation Policy",
  description: "JHCleans.com cancellation and rescheduling policy for garbage can cleaning services.",
  path: "/cancellation",
  noIndex: true,
});

export default async function CancellationPage() {
  const content = await getSiteContent();
  const page = content.legal.cancellation;

  return (
    <LegalTemplate
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  );
}
