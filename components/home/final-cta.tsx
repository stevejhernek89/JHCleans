"use client";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics/track";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function FinalCta() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="final-cta-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-primary/10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="final-cta-heading"
            className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Ready for Cleaner, Fresher Cans?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Book your first cleaning today and take one unpleasant household job
            off your list.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group min-w-[200px]">
              <Link
                href="/book"
                onClick={() => trackCtaClick("final_cta_book")}
              >
                Book a Cleaning
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link
                href="/contact?subject=quote"
                onClick={() => trackCtaClick("final_cta_quote")}
              >
                <Info className="h-4 w-4" />
                Request a Quote
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
