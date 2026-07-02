import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "JHCleans.com terms of service for website use and service requests.",
  path: "/terms",
  noIndex: true,
});

export default async function TermsPage() {
  const content = await getSiteContent();
  const page = content.legal.terms;

  return (
    <LegalTemplate
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  );
}
