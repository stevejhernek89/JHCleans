import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { LegalTemplate } from "@/components/layout/legal-template";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "JHCleans.com privacy policy — how we collect, use, and protect your information.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const content = await getSiteContent();
  const page = content.legal.privacy;

  return (
    <LegalTemplate
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
      showNotice={false}
    />
  );
}
