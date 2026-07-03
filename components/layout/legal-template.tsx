interface LegalSection {
  title: string;
  content: string;
}

interface LegalTemplateProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

function slugifySectionTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalTemplate({
  title,
  lastUpdated,
  sections,
}: LegalTemplateProps) {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} id={slugifySectionTitle(section.title)}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.content.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
