"use client";

import Link from "next/link";
import { Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/content/site-content-context";

export function ServiceCards() {
  const { services, pages } = useSiteContent();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <article
          key={service.id}
          className="flex flex-col glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5"
        >
          <h2 className="text-xl font-bold text-foreground">{service.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {service.duration}
          </div>

          <ul className="mt-4 flex-1 space-y-2" role="list">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p className="text-sm font-semibold text-accent">{service.priceLabel}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {service.priceNote || "Contact for pricing details"}
            </p>
          </div>

          <Button asChild className="mt-4 w-full">
            <Link href={service.href}>{pages.services.ctaLabel}</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
