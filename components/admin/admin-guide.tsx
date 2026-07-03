"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminSidebar } from "@/components/admin/admin-shell";
import { ADMIN_GUIDE_SECTIONS, type GuideField, type GuideSection } from "@/lib/admin/guide-content";
import { cn } from "@/lib/utils";

function GuideFieldCard({ field }: { field: GuideField }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
      <p className="font-medium text-foreground">{field.name}</p>
      <dl className="space-y-1.5 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-primary">Where on the website</dt>
          <dd className="text-muted-foreground">{field.where}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-accent">What it is</dt>
          <dd className="text-muted-foreground">{field.what}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-primary">How to fill it out</dt>
          <dd className="text-muted-foreground">{field.how}</dd>
        </div>
        {field.example && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Example</dt>
            <dd className="font-mono text-xs text-foreground/90 whitespace-pre-wrap">{field.example}</dd>
          </div>
        )}
        {field.tip && (
          <div className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200/90">
            <span className="font-medium">Tip: </span>
            {field.tip}
          </div>
        )}
      </dl>
    </div>
  );
}

function GuideTable({ table }: { table: NonNullable<GuideSection["table"]> }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-left">
            {table.headers.map((header) => (
              <th key={header} className="px-4 py-2.5 font-medium text-primary">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-muted-foreground align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuideSectionBody({ section }: { section: GuideSection }) {
  return (
    <div className="space-y-4">
      {section.description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
      )}
      {section.table && <GuideTable table={section.table} />}
      {section.bullets && (
        <ul className="space-y-2">
          {section.bullets.map((bullet) => (
            <li key={bullet.title} className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{bullet.title}</span>
              <span className="text-muted-foreground"> — {bullet.description}</span>
            </li>
          ))}
        </ul>
      )}
      {section.fields && (
        <div className="grid gap-3 lg:grid-cols-2">
          {section.fields.map((field) => (
            <GuideFieldCard key={field.name} field={field} />
          ))}
        </div>
      )}
      {section.subsections?.map((sub) => (
        <div key={sub.id} id={sub.id} className="scroll-mt-24 space-y-3 border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold text-accent">{sub.title}</h4>
          <GuideSectionBody section={sub} />
        </div>
      ))}
    </div>
  );
}

export function AdminGuide() {
  const { openSidebar } = useAdminSidebar();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <>
      <AdminHeader
        title="Field Guide"
        description="Step-by-step instructions for every admin input — what it does, where it shows on the website, and how to fill it out."
        onMenuClick={openSidebar}
        action={
          <Button asChild variant="outline" size="sm">
            <a href="/docs/JHCleans-Admin-Guide.pdf" download>
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        }
      />

      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Card className="lg:w-64 shrink-0 lg:sticky lg:top-6 lg:self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Jump to section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 max-h-[70vh] overflow-y-auto">
            {ADMIN_GUIDE_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {section.title}
              </a>
            ))}
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4 min-w-0">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Work top to bottom. In{" "}
              <Link href="/admin/content" className="text-primary hover:underline">
                Site Content
              </Link>
              , the category order matches this guide. Always click{" "}
              <Badge variant="success" className="mx-1 align-middle text-xs">
                Save Section
              </Badge>{" "}
              before switching categories.
            </CardContent>
          </Card>

          <Accordion
            type="multiple"
            defaultValue={ADMIN_GUIDE_SECTIONS.map((s) => s.id)}
            className="space-y-3"
          >
            {ADMIN_GUIDE_SECTIONS.map((section) => (
              <Card key={section.id} id={section.id} className="scroll-mt-24 overflow-hidden">
                <AccordionItem value={section.id} className="border-0">
                  <AccordionTrigger className="px-4 hover:no-underline sm:px-6">
                    <span className="text-left font-semibold">{section.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 sm:px-6">
                    <GuideSectionBody section={section} />
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>

          <p className="text-center text-xs text-muted-foreground pb-4">
            Also available as{" "}
            <a
              href="/docs/JHCleans-Admin-Guide.pdf"
              className="inline-flex items-center gap-1 text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              JHCleans-Admin-Guide.pdf
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export function GuideLink({
  sectionId,
  className,
  label = "Field guide",
}: {
  sectionId?: string;
  className?: string;
  label?: string;
}) {
  const href = sectionId ? `/admin/guide#${sectionId}` : "/admin/guide";
  const ariaLabel = label || "Open field guide for this section";

  return (
    <Button asChild variant="ghost" size="sm" className={cn("text-muted-foreground", className)}>
      <Link href={href} aria-label={ariaLabel} title={ariaLabel}>
        <BookOpen className="h-4 w-4" />
        {label ? <span>{label}</span> : null}
      </Link>
    </Button>
  );
}
