import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { FoundersPhoto } from "@/components/home/founders-photo";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about JHCleans — a local garbage can cleaning service built by young entrepreneurs focused on quality and community.",
  path: "/about",
});

export default async function AboutPage() {
  const content = await getSiteContent();
  const { about } = content;

  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {about.headline}
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            {about.story.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <FoundersPhoto />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((value) => (
            <div key={value.title} className="glass rounded-2xl p-6 text-center">
              <h2 className="text-lg font-bold text-foreground">{value.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      <FinalCta />
    </div>
  );
}
