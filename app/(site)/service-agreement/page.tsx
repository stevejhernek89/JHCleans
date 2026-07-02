import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Service Agreement",
  description: "JHCleans.com service agreement outlining terms for garbage can cleaning services.",
  path: "/service-agreement",
  noIndex: true,
});

export default async function ServiceAgreementPage() {
  const content = await getSiteContent();
  const page = content.legal.serviceAgreement;

  return (
    <LegalTemplate
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  );
}
