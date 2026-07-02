interface LegalSection {
  title: string;
  content: string;
}

interface LegalTemplateProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalTemplate({ title, lastUpdated, sections }: LegalTemplateProps) {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200">
            <strong>Template Notice:</strong> This is a starter template and does not
            constitute legal advice. Have a licensed attorney review all legal pages
            before launch.
          </p>
        </div>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
