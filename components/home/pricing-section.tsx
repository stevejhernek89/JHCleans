"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/content/site-content-context";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function PricingSection() {
  const [billingType, setBillingType] = useState<"one-time" | "recurring">("recurring");
  const reducedMotion = usePrefersReducedMotion();
  const { pricing, homepage } = useSiteContent();

  const displayPlans = pricing.plans;

  return (
    <section className="py-16 sm:py-24" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2
            id="pricing-heading"
            className="text-3xl font-bold text-foreground sm:text-4xl"
          >
            {homepage.sections.pricing.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {homepage.sections.pricing.subtitle}
          </p>

          <div className="mt-8 inline-flex rounded-xl glass p-1" role="group" aria-label="Billing type">
            <button
              type="button"
              onClick={() => setBillingType("one-time")}
              className={cn(
                "rounded-lg px-6 py-2.5 text-sm font-medium transition-all",
                billingType === "one-time"
                  ? "bg-accent text-accent-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={billingType === "one-time"}
            >
              One-Time
            </button>
            <button
              type="button"
              onClick={() => setBillingType("recurring")}
              className={cn(
                "rounded-lg px-6 py-2.5 text-sm font-medium transition-all",
                billingType === "recurring"
                  ? "bg-accent text-accent-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={billingType === "recurring"}
            >
              Recurring
            </button>
          </div>

          {billingType === "recurring" && pricing.recurringSavingsLabel && (
            <p className="mt-3 text-sm text-primary font-medium">
              {pricing.recurringSavingsLabel}
              {pricing.savingsPercent !== null &&
                ` — save ${pricing.savingsPercent}%`}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayPlans.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5",
                plan.popular && "border-primary/40 ring-1 ring-primary/20 scale-[1.02]"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase text-primary-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="my-6">
                <p className="text-3xl font-bold text-foreground">{plan.priceLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.priceNote || "Contact for pricing details"}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "default" : "accent"}
                className="w-full"
              >
                <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
