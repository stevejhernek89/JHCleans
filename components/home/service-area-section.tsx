"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteContent } from "@/lib/content/site-content-context";
import { checkZipCode } from "@/lib/content/zip-check";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/analytics/track";

interface FaqSectionProps {
  compact?: boolean;
}

export function FaqSection({ compact = false }: FaqSectionProps) {
  const { faq, homepage } = useSiteContent();
  const items = compact ? faq.slice(0, 6) : faq;

  return (
    <div
      id="faq"
      className={cn("glass rounded-2xl p-6 sm:p-8 scroll-mt-24")}
    >
      <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
        {homepage.sections.faq.title}
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {compact && (
        <a href="/#faq" className="mt-4 inline-block text-sm text-accent hover:underline">
          View all FAQs →
        </a>
      )}
    </div>
  );
}

export function ServiceAreaSection() {
  const { serviceArea, homepage } = useSiteContent();
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkZipCode> | null>(null);
  const [error, setError] = useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{5}$/.test(zip.trim())) {
      setError("Please enter a valid 5-digit ZIP code");
      setResult(null);
      return;
    }

    const status = checkZipCode(zip, serviceArea);
    setResult(status);
    trackConversion("zip_check");
  };

  const message = result ? serviceArea.zipMessages[result] : null;

  return (
    <section className="py-16 sm:py-24" aria-labelledby="service-area-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h2
              id="service-area-heading"
              className="mb-2 text-2xl font-bold text-foreground sm:text-3xl"
            >
              {homepage.sections.serviceArea.title}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {homepage.sections.serviceArea.subtitle}
            </p>

            <form onSubmit={handleCheck} className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="zip-check" className="sr-only">
                  ZIP code
                </label>
                <Input
                  id="zip-check"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  placeholder="Enter ZIP code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  aria-describedby={error ? "zip-error" : undefined}
                  aria-invalid={!!error}
                />
              </div>
              <Button type="submit">Check</Button>
            </form>

            {error && (
              <p id="zip-error" className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {message && (
              <div
                className={cn(
                  "mt-4 rounded-xl p-4",
                  message.variant === "success" && "bg-primary/10 border border-primary/30",
                  message.variant === "warning" && "bg-amber-500/10 border border-amber-500/30",
                  message.variant === "neutral" && "bg-white/5 border border-border"
                )}
                role="status"
              >
                <p className="font-semibold text-foreground">{message.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{message.description}</p>
              </div>
            )}

            <div
              className="mt-8 relative aspect-[16/10] rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10 overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute inset-0 grid-pattern opacity-30" />
              {serviceArea.featuredCities.slice(0, 6).map((city, i) => (
                <div
                  key={city.name}
                  className="absolute"
                  style={{
                    top: `${20 + (i % 3) * 25}%`,
                    left: `${15 + (i % 2) * 40 + (i > 2 ? 10 : 0)}%`,
                  }}
                >
                  <MapPin className="h-5 w-5 text-accent drop-shadow-lg" />
                </div>
              ))}
              <p className="absolute bottom-3 left-3 text-xs text-muted-foreground">
                {serviceArea.mapNote}
              </p>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {serviceArea.featuredCities.map((city) => (
                <li
                  key={city.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <MapPin className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                  {city.name}, {city.state}
                </li>
              ))}
            </ul>
          </div>

          <FaqSection compact />
        </div>
      </div>
    </section>
  );
}
