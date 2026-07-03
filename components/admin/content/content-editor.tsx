"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminSidebar } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSiteContentAction,
  resetSiteContentSectionAction,
  saveSiteContentSectionAction,
} from "@/app/actions/content";
import type { SiteContent, SiteContentSection } from "@/lib/content/types";
import { FieldHelpText } from "@/components/admin/field-help-text";
import { GuideLink } from "@/components/admin/admin-guide";
import { CONTENT_SECTION_GUIDE_IDS } from "@/lib/admin/guide-content";
import { getFieldHelp } from "@/lib/admin/field-help";
import { cn } from "@/lib/utils";

const sections: { id: SiteContentSection; label: string }[] = [
  { id: "business", label: "Business Info" },
  { id: "navigation", label: "Navigation" },
  { id: "layout", label: "Buttons & CTAs" },
  { id: "homepage", label: "Homepage" },
  { id: "pages", label: "Page Headings" },
  { id: "features", label: "Features" },
  { id: "howItWorksSteps", label: "How It Works" },
  { id: "pricing", label: "Pricing Plans" },
  { id: "services", label: "Services" },
  { id: "faq", label: "FAQ" },
  { id: "testimonials", label: "Testimonials" },
  { id: "about", label: "About" },
  { id: "serviceArea", label: "Service Area" },
  { id: "legal", label: "Legal Pages" },
];

function Field({
  label,
  helpKey,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  helpKey: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const help = getFieldHelp(helpKey);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {help && <FieldHelpText help={help} />}
    </div>
  );
}

function SectionActions({
  onSave,
  onReset,
  isPending,
  message,
}: {
  onSave: () => void;
  onReset: () => void;
  isPending: boolean;
  message: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
      <Button onClick={onSave} disabled={isPending}>
        {isPending ? "Saving…" : "Save Section"}
      </Button>
      <Button variant="outline" onClick={onReset} disabled={isPending}>
        Reset to Defaults
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

function BusinessEditor({
  content,
  onChange,
}: {
  content: SiteContent["business"];
  onChange: (content: SiteContent["business"]) => void;
}) {
  const update = (path: string[], value: string | boolean) => {
    const next = structuredClone(content);
    let cursor: Record<string, unknown> = next as unknown as Record<string, unknown>;
    for (let i = 0; i < path.length - 1; i++) {
      cursor = cursor[path[i]] as Record<string, unknown>;
    }
    cursor[path[path.length - 1]] = value;
    onChange(next);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field helpKey="business.name" label="Business Name" value={content.name} onChange={(v) => update(["name"], v)} />
      <Field helpKey="business.shortName" label="Short Name" value={content.shortName} onChange={(v) => update(["shortName"], v)} />
      <Field helpKey="business.tagline" label="Tagline" value={content.tagline} onChange={(v) => update(["tagline"], v)} />
      <Field
        helpKey="business.description"
        label="Description"
        value={content.description}
        onChange={(v) => update(["description"], v)}
        multiline
      />
      <Field helpKey="business.contact.phone" label="Phone" value={content.contact.phone} onChange={(v) => update(["contact", "phone"], v)} />
      <Field helpKey="business.contact.phoneTel" label="Phone (tel link)" value={content.contact.phoneTel} onChange={(v) => update(["contact", "phoneTel"], v)} />
      <Field helpKey="business.contact.email" label="Email" value={content.contact.email} onChange={(v) => update(["contact", "email"], v)} />
      <Field helpKey="business.contact.address.display" label="Address Display" value={content.contact.address.display} onChange={(v) => update(["contact", "address", "display"], v)} />
      <Field helpKey="business.contact.address.city" label="City" value={content.contact.address.city} onChange={(v) => update(["contact", "address", "city"], v)} />
      <Field helpKey="business.contact.address.state" label="State" value={content.contact.address.state} onChange={(v) => update(["contact", "address", "state"], v)} />
      <Field helpKey="business.hours.weekdays" label="Weekday Hours" value={content.hours.weekdays} onChange={(v) => update(["hours", "weekdays"], v)} />
      <Field helpKey="business.hours.saturday" label="Saturday Hours" value={content.hours.saturday} onChange={(v) => update(["hours", "saturday"], v)} />
      <Field helpKey="business.hours.sunday" label="Sunday Hours" value={content.hours.sunday} onChange={(v) => update(["hours", "sunday"], v)} />
      <Field helpKey="business.hours.note" label="Hours Note" value={content.hours.note} onChange={(v) => update(["hours", "note"], v)} />
      <Field helpKey="business.social.facebook" label="Facebook URL" value={content.social.facebook} onChange={(v) => update(["social", "facebook"], v)} />
      <Field helpKey="business.social.instagram" label="Instagram URL" value={content.social.instagram} onChange={(v) => update(["social", "instagram"], v)} />
      <Field helpKey="business.social.tiktok" label="TikTok URL" value={content.social.tiktok} onChange={(v) => update(["social", "tiktok"], v)} />
      <Field helpKey="business.social.yelp" label="Yelp URL" value={content.social.yelp} onChange={(v) => update(["social", "yelp"], v)} />
      <Field helpKey="business.social.google" label="Google URL" value={content.social.google} onChange={(v) => update(["social", "google"], v)} />
      <Field
        helpKey="business.claims.satisfactionGuarantee"
        label="Satisfaction Guarantee"
        value={content.claims.satisfactionGuarantee}
        onChange={(v) => update(["claims", "satisfactionGuarantee"], v)}
        multiline
      />
    </div>
  );
}

function ListEditor<T>({
  items,
  renderItem,
  onChange,
  createItem,
}: {
  items: T[];
  renderItem: (item: T, index: number, update: (next: T) => void) => React.ReactNode;
  onChange: (items: T[]) => void;
  createItem: () => T;
}) {
  if (!Array.isArray(items)) {
    return (
      <p className="text-sm text-destructive">
        This section has invalid data. Use Reset to Defaults or reload the page.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="space-y-3 p-4">
            {renderItem(item, index, (next) => {
              const copy = [...items];
              copy[index] = next;
              onChange(copy);
            })}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, createItem()])}>
        Add Item
      </Button>
    </div>
  );
}

function JsonSectionEditor({
  section,
  value,
  onChange,
}: {
  section: SiteContentSection;
  value: SiteContent[SiteContentSection];
  onChange: (value: SiteContent[SiteContentSection]) => void;
}) {
  if (section === "business") {
    return <BusinessEditor content={value as SiteContent["business"]} onChange={onChange as (v: SiteContent["business"]) => void} />;
  }

  if (section === "navigation") {
    const items = value as SiteContent["navigation"];
    return (
      <ListEditor
        items={items}
        onChange={onChange as (items: SiteContent["navigation"]) => void}
        createItem={() => ({ label: "New Link", href: "/" })}
        renderItem={(item, _index, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <Field helpKey="navigation.label" label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
            <Field helpKey="navigation.href" label="URL" value={item.href} onChange={(v) => update({ ...item, href: v })} />
          </div>
        )}
      />
    );
  }

  if (section === "layout") {
    const layout = value as SiteContent["layout"];
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field helpKey="layout.headerCta" label="Header CTA" value={layout.headerCta} onChange={(v) => onChange({ ...layout, headerCta: v })} />
        <Field helpKey="layout.mobileQuoteCta" label="Mobile Quote CTA" value={layout.mobileQuoteCta} onChange={(v) => onChange({ ...layout, mobileQuoteCta: v })} />
        <Field helpKey="layout.mobileBookCta" label="Mobile Book CTA" value={layout.mobileBookCta} onChange={(v) => onChange({ ...layout, mobileBookCta: v })} />
        <Field helpKey="layout.footerBookLabel" label="Footer Book Label" value={layout.footerBookLabel} onChange={(v) => onChange({ ...layout, footerBookLabel: v })} />
      </div>
    );
  }

  if (section === "homepage") {
    const homepage = value as SiteContent["homepage"];
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field helpKey="homepage.hero.badge" label="Badge" value={homepage.hero.badge} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, badge: v } })} />
            <Field helpKey="homepage.hero.headline" label="Headline" value={homepage.hero.headline} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, headline: v } })} />
            <Field helpKey="homepage.hero.headlineAccent" label="Headline Accent" value={homepage.hero.headlineAccent} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, headlineAccent: v } })} />
            <Field helpKey="homepage.hero.primaryCta" label="Primary CTA" value={homepage.hero.primaryCta} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, primaryCta: v } })} />
            <Field helpKey="homepage.hero.secondaryCta" label="Secondary CTA" value={homepage.hero.secondaryCta} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, secondaryCta: v } })} />
            <Field helpKey="homepage.hero.trustIndicators" label="Trust Indicators (one per line)" value={homepage.hero.trustIndicators.join("\n")} onChange={(v) => onChange({ ...homepage, hero: { ...homepage.hero, trustIndicators: v.split("\n").filter(Boolean) } })} multiline />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Section Headings</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field helpKey="homepage.sections.howItWorks.title" label="How It Works Title" value={homepage.sections.howItWorks.title} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, howItWorks: { ...homepage.sections.howItWorks, title: v } } })} />
            <Field helpKey="homepage.sections.howItWorks.subtitle" label="How It Works Subtitle" value={homepage.sections.howItWorks.subtitle} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, howItWorks: { ...homepage.sections.howItWorks, subtitle: v } } })} />
            <Field helpKey="homepage.sections.pricing.title" label="Pricing Title" value={homepage.sections.pricing.title} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, pricing: { ...homepage.sections.pricing, title: v } } })} />
            <Field helpKey="homepage.sections.pricing.subtitle" label="Pricing Subtitle" value={homepage.sections.pricing.subtitle} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, pricing: { ...homepage.sections.pricing, subtitle: v } } })} />
            <Field helpKey="homepage.sections.testimonials.title" label="Testimonials Title" value={homepage.sections.testimonials.title} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, testimonials: { title: v } } })} />
            <Field helpKey="homepage.sections.faq.title" label="FAQ Title" value={homepage.sections.faq.title} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, faq: { title: v } } })} />
            <Field helpKey="homepage.sections.serviceArea.title" label="Service Area Title" value={homepage.sections.serviceArea.title} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, serviceArea: { ...homepage.sections.serviceArea, title: v } } })} />
            <Field helpKey="homepage.sections.serviceArea.subtitle" label="Service Area Subtitle" value={homepage.sections.serviceArea.subtitle} onChange={(v) => onChange({ ...homepage, sections: { ...homepage.sections, serviceArea: { ...homepage.sections.serviceArea, subtitle: v } } })} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Final CTA</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field helpKey="homepage.finalCta.title" label="Title" value={homepage.finalCta.title} onChange={(v) => onChange({ ...homepage, finalCta: { ...homepage.finalCta, title: v } })} />
            <Field helpKey="homepage.finalCta.body" label="Body" value={homepage.finalCta.body} onChange={(v) => onChange({ ...homepage, finalCta: { ...homepage.finalCta, body: v } })} multiline />
            <Field helpKey="homepage.finalCta.primaryCta" label="Primary CTA" value={homepage.finalCta.primaryCta} onChange={(v) => onChange({ ...homepage, finalCta: { ...homepage.finalCta, primaryCta: v } })} />
            <Field helpKey="homepage.finalCta.secondaryCta" label="Secondary CTA" value={homepage.finalCta.secondaryCta} onChange={(v) => onChange({ ...homepage, finalCta: { ...homepage.finalCta, secondaryCta: v } })} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Homepage Pricing Preview</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The pricing cards beside the before/after slider use the same plans as the{" "}
              <strong>Pricing Plans</strong> content section. Edit plans there to update both
              the homepage preview and the full pricing section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "pages") {
    const pages = value as SiteContent["pages"];
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field helpKey="pages.services.title" label="Services Title" value={pages.services.title} onChange={(v) => onChange({ ...pages, services: { ...pages.services, title: v } })} />
        <Field helpKey="pages.services.subtitle" label="Services Subtitle" value={pages.services.subtitle} onChange={(v) => onChange({ ...pages, services: { ...pages.services, subtitle: v } })} multiline />
        <Field helpKey="pages.services.ctaLabel" label="Services CTA Label" value={pages.services.ctaLabel} onChange={(v) => onChange({ ...pages, services: { ...pages.services, ctaLabel: v } })} />
        <Field helpKey="pages.contact.title" label="Contact Title" value={pages.contact.title} onChange={(v) => onChange({ ...pages, contact: { ...pages.contact, title: v } })} />
        <Field helpKey="pages.contact.subtitle" label="Contact Subtitle" value={pages.contact.subtitle} onChange={(v) => onChange({ ...pages, contact: { ...pages.contact, subtitle: v } })} />
        <Field helpKey="pages.book.title" label="Book Title" value={pages.book.title} onChange={(v) => onChange({ ...pages, book: { ...pages.book, title: v } })} />
        <Field helpKey="pages.book.subtitle" label="Book Subtitle" value={pages.book.subtitle} onChange={(v) => onChange({ ...pages, book: { ...pages.book, subtitle: v } })} multiline />
        <Field helpKey="pages.pricing.quoteTitle" label="Pricing Quote Title" value={pages.pricing.quoteTitle} onChange={(v) => onChange({ ...pages, pricing: { ...pages.pricing, quoteTitle: v } })} />
        <Field helpKey="pages.pricing.quoteSubtitle" label="Pricing Quote Subtitle" value={pages.pricing.quoteSubtitle} onChange={(v) => onChange({ ...pages, pricing: { ...pages.pricing, quoteSubtitle: v } })} />
      </div>
    );
  }

  if (section === "features") {
    const items = value as SiteContent["features"];
    return (
      <ListEditor
        items={items}
        onChange={onChange as (items: SiteContent["features"]) => void}
        createItem={() => ({ id: `feature-${Date.now()}`, title: "", description: "", icon: "sparkles" })}
        renderItem={(item, _index, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <Field helpKey="features.title" label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <Field helpKey="features.icon" label="Icon" value={item.icon} onChange={(v) => update({ ...item, icon: v })} />
            <Field helpKey="features.description" label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
          </div>
        )}
      />
    );
  }

  if (section === "howItWorksSteps") {
    const items = value as SiteContent["howItWorksSteps"];
    return (
      <ListEditor
        items={items}
        onChange={onChange as (items: SiteContent["howItWorksSteps"]) => void}
        createItem={() => ({ step: items.length + 1, title: "", description: "", icon: "calendar" })}
        renderItem={(item, _index, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <Field helpKey="howItWorksSteps.title" label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <Field helpKey="howItWorksSteps.step" label="Step Number" value={String(item.step)} onChange={(v) => update({ ...item, step: Number(v) || 1 })} />
            <Field helpKey="howItWorksSteps.description" label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
          </div>
        )}
      />
    );
  }

  if (section === "pricing") {
    const pricing = value as SiteContent["pricing"];
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field helpKey="pricing.recurringSavingsLabel" label="Recurring Savings Label" value={pricing.recurringSavingsLabel} onChange={(v) => onChange({ ...pricing, recurringSavingsLabel: v })} />
          <Field helpKey="pricing.savingsPercent" label="Savings Percent" value={pricing.savingsPercent?.toString() ?? ""} onChange={(v) => onChange({ ...pricing, savingsPercent: v ? Number(v) : null })} />
        </div>
        <ListEditor
          items={pricing.plans}
          onChange={(plans) => onChange({ ...pricing, plans })}
          createItem={() => ({
            id: `plan-${Date.now()}`,
            name: "New Plan",
            description: "",
            priceLabel: "$0",
            priceNote: "per bin",
            billingType: "one-time" as const,
            features: ["Feature 1"],
            ctaLabel: "Book Now",
            ctaHref: "/book",
          })}
          renderItem={(item, _index, update) => (
            <div className="grid gap-3 md:grid-cols-2">
              <Field helpKey="pricing.plans.name" label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
              <Field helpKey="pricing.plans.priceLabel" label="Price Label" value={item.priceLabel} onChange={(v) => update({ ...item, priceLabel: v })} />
              <Field helpKey="pricing.plans.description" label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
              <Field helpKey="pricing.plans.priceNote" label="Price Note" value={item.priceNote ?? ""} onChange={(v) => update({ ...item, priceNote: v })} />
              <Field helpKey="pricing.plans.ctaLabel" label="CTA Label" value={item.ctaLabel} onChange={(v) => update({ ...item, ctaLabel: v })} />
              <Field helpKey="pricing.plans.ctaHref" label="CTA Link" value={item.ctaHref} onChange={(v) => update({ ...item, ctaHref: v })} />
              <Field helpKey="pricing.plans.features" label="Features (one per line)" value={item.features.join("\n")} onChange={(v) => update({ ...item, features: v.split("\n").filter(Boolean) })} multiline />
            </div>
          )}
        />
      </div>
    );
  }

  if (section === "services") {
    const items = value as SiteContent["services"];
    return (
      <ListEditor
        items={items}
        onChange={onChange as (items: SiteContent["services"]) => void}
        createItem={() => ({
          id: `service-${Date.now()}`,
          name: "New Service",
          description: "",
          included: ["Included item"],
          duration: "",
          priceLabel: "",
          priceNote: "per bin",
          href: "/book",
        })}
        renderItem={(item, _index, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <Field helpKey="services.name" label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
            <Field helpKey="services.priceLabel" label="Price Label" value={item.priceLabel} onChange={(v) => update({ ...item, priceLabel: v })} />
            <Field helpKey="services.priceNote" label="Price Note" value={item.priceNote ?? ""} onChange={(v) => update({ ...item, priceNote: v })} />
            <Field helpKey="services.description" label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
            <Field helpKey="services.duration" label="Duration" value={item.duration} onChange={(v) => update({ ...item, duration: v })} />
            <Field helpKey="services.href" label="Booking Link" value={item.href} onChange={(v) => update({ ...item, href: v })} />
            <Field helpKey="services.included" label="Included (one per line)" value={item.included.join("\n")} onChange={(v) => update({ ...item, included: v.split("\n").filter(Boolean) })} multiline />
          </div>
        )}
      />
    );
  }

  if (section === "faq") {
    const items = value as SiteContent["faq"];
    return (
      <ListEditor
        items={items}
        onChange={onChange as (items: SiteContent["faq"]) => void}
        createItem={() => ({ id: `faq-${Date.now()}`, question: "", answer: "" })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <Field helpKey="faq.question" label="Question" value={item.question} onChange={(v) => update({ ...item, question: v })} />
            <Field helpKey="faq.answer" label="Answer" value={item.answer} onChange={(v) => update({ ...item, answer: v })} multiline />
          </div>
        )}
      />
    );
  }

  if (section === "testimonials") {
    const testimonials = value as SiteContent["testimonials"];
    return (
      <div className="space-y-4">
        <ListEditor
          items={testimonials.items}
          onChange={(items) => onChange({ ...testimonials, items })}
          createItem={() => ({ id: `testimonial-${Date.now()}`, quote: "", author: "", location: "", rating: null })}
          renderItem={(item, _index, update) => (
            <div className="space-y-3">
              <Field helpKey="testimonials.quote" label="Quote" value={item.quote} onChange={(v) => update({ ...item, quote: v })} multiline />
              <Field helpKey="testimonials.author" label="Author" value={item.author} onChange={(v) => update({ ...item, author: v })} />
              <Field helpKey="testimonials.location" label="Location" value={item.location} onChange={(v) => update({ ...item, location: v })} />
            </div>
          )}
        />
      </div>
    );
  }

  if (section === "about") {
    const about = value as SiteContent["about"];
    return (
      <div className="space-y-4">
        <Field helpKey="about.headline" label="Headline" value={about.headline} onChange={(v) => onChange({ ...about, headline: v })} />
        <Field helpKey="about.story" label="Story (one paragraph per line)" value={about.story.join("\n\n")} onChange={(v) => onChange({ ...about, story: v.split("\n\n").filter(Boolean) })} multiline />
        <Field helpKey="about.foundersNote" label="Founders Note" value={about.foundersNote} onChange={(v) => onChange({ ...about, foundersNote: v })} />
        <ListEditor
          items={about.values}
          onChange={(values) => onChange({ ...about, values })}
          createItem={() => ({ title: "", description: "" })}
          renderItem={(item, _index, update) => (
            <div className="grid gap-3 md:grid-cols-2">
              <Field helpKey="about.values.title" label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
              <Field helpKey="about.values.description" label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
            </div>
          )}
        />
      </div>
    );
  }

  if (section === "serviceArea") {
    const area = value as SiteContent["serviceArea"];
    return (
      <div className="space-y-4">
        <Field helpKey="serviceArea.regionLabel" label="Region Label" value={area.regionLabel} onChange={(v) => onChange({ ...area, regionLabel: v })} />
        <Field helpKey="serviceArea.mapNote" label="Map Note" value={area.mapNote} onChange={(v) => onChange({ ...area, mapNote: v })} multiline />
        <Field helpKey="serviceArea.servicedZipCodes" label="Serviced ZIP Codes (comma separated)" value={area.servicedZipCodes.join(", ")} onChange={(v) => onChange({ ...area, servicedZipCodes: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <Field helpKey="serviceArea.maybeZipCodes" label="Maybe ZIP Codes (comma separated)" value={area.maybeZipCodes.join(", ")} onChange={(v) => onChange({ ...area, maybeZipCodes: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <ListEditor
          items={area.featuredCities}
          onChange={(featuredCities) => onChange({ ...area, featuredCities })}
          createItem={() => ({ name: "", state: "" })}
          renderItem={(item, _index, update) => (
            <div className="grid gap-3 md:grid-cols-2">
              <Field helpKey="serviceArea.featuredCity.name" label="City" value={item.name} onChange={(v) => update({ ...item, name: v })} />
              <Field helpKey="serviceArea.featuredCity.state" label="State" value={item.state} onChange={(v) => update({ ...item, state: v })} />
            </div>
          )}
        />
      </div>
    );
  }

  if (section === "legal") {
    const legal = value as SiteContent["legal"];
    const pageKeys = ["privacy", "terms", "cancellation", "serviceAgreement"] as const;
    return (
      <div className="space-y-6">
        {pageKeys.map((key) => (
          <Card key={key}>
            <CardHeader><CardTitle>{legal[key].title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field helpKey="legal.lastUpdated" label="Last Updated" value={legal[key].lastUpdated} onChange={(v) => onChange({ ...legal, [key]: { ...legal[key], lastUpdated: v } })} />
              <ListEditor
                items={legal[key].sections}
                onChange={(sections) => onChange({ ...legal, [key]: { ...legal[key], sections } })}
                createItem={() => ({ title: "New Section", content: "" })}
                renderItem={(item, _index, update) => (
                  <div className="space-y-3">
                    <Field helpKey="legal.sectionTitle" label="Section Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                    <Field helpKey="legal.sectionContent" label="Section Content" value={item.content} onChange={(v) => update({ ...item, content: v })} multiline />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Textarea
      className="min-h-[320px] font-mono text-xs"
      value={JSON.stringify(value, null, 2)}
      onChange={(e) => {
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          // ignore invalid JSON while typing
        }
      }}
    />
  );
}

export function ContentEditor() {
  const { openSidebar } = useAdminSidebar();
  const [activeSection, setActiveSection] = useState<SiteContentSection>("business");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent[SiteContentSection] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeSectionRef = useRef<SiteContentSection>(activeSection);
  activeSectionRef.current = activeSection;

  const loadContent = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getSiteContentAction();
        setContent(result);
        setDraft(result[activeSectionRef.current]);
      } catch {
        setMessage("Failed to load content. Please refresh and try again.");
      }
    });
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const selectSection = (section: SiteContentSection) => {
    if (content) {
      setDraft(content[section]);
    }
    setActiveSection(section);
    setMessage(null);
  };

  const handleSave = () => {
    if (!draft) return;
    startTransition(async () => {
      const result = await saveSiteContentSectionAction(activeSection, draft);
      setMessage(result.message);
      if (result.success && result.content) {
        setContent(result.content);
        setDraft(result.content[activeSection]);
      }
    });
  };

  const handleReset = () => {
    startTransition(async () => {
      const result = await resetSiteContentSectionAction(activeSection);
      setMessage(result.message);
      if (result.success && result.content) {
        setContent(result.content);
        setDraft(result.content[activeSection]);
      }
    });
  };

  return (
    <>
      <AdminHeader
        title="Site Content"
        description="Update pricing, text, FAQs, legal pages, and business info across the website."
        onMenuClick={openSidebar}
        action={
          <GuideLink sectionId={CONTENT_SECTION_GUIDE_IDS[activeSection] ?? "site-content"} />
        }
      />

      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Card className="lg:w-64 shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectSection(section.id)}
                  className={cn(
                    "min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    activeSection === section.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {section.label}
                </button>
                <GuideLink
                  sectionId={CONTENT_SECTION_GUIDE_IDS[section.id]}
                  label=""
                  className="h-8 w-8 shrink-0 px-0 text-muted-foreground/60 hover:text-primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{sections.find((s) => s.id === activeSection)?.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!draft ? (
              <p className="text-muted-foreground">Loading content…</p>
            ) : (
              <>
                <JsonSectionEditor
                  section={activeSection}
                  value={draft}
                  onChange={setDraft}
                />
                <SectionActions
                  onSave={handleSave}
                  onReset={handleReset}
                  isPending={isPending}
                  message={message}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
