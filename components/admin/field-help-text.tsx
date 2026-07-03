import type { GuideField } from "@/lib/admin/guide-content";

export function FieldHelpText({ help }: { help: GuideField }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 space-y-2 text-xs leading-relaxed">
      <p>
        <span className="font-semibold text-primary">Shows on the website: </span>
        <span className="text-muted-foreground">{help.where}</span>
      </p>
      <p>
        <span className="font-semibold text-accent">What this is: </span>
        <span className="text-muted-foreground">{help.what}</span>
      </p>
      <p>
        <span className="font-semibold text-foreground/90">How to fill it out: </span>
        <span className="text-muted-foreground">{help.how}</span>
      </p>
      {help.example && (
        <p>
          <span className="font-semibold text-muted-foreground">Example: </span>
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-foreground/90 whitespace-pre-wrap">
            {help.example}
          </code>
        </p>
      )}
      {help.tip && (
        <p className="rounded-md bg-amber-400/10 px-2.5 py-1.5 text-amber-200/90">
          <span className="font-semibold">Tip: </span>
          {help.tip}
        </p>
      )}
    </div>
  );
}
