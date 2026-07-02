"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/home/hero-visual";
import { useSiteContent } from "@/lib/content/site-content-context";
import { trackCtaClick } from "@/lib/analytics/track";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const { business, homepage } = useSiteContent();
  const { hero } = homepage;

  const fadeIn = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      };

  return (
    <section
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-accent/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeIn} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {hero.badge}
              </span>
            </div>

            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                {hero.headline}{" "}
                <span className="text-gradient-accent">
                  {hero.headlineAccent}
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                {business.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group">
                <Link
                  href="/book"
                  onClick={() => trackCtaClick("hero_book_cleaning")}
                >
                  {hero.primaryCta}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  href="/contact?subject=quote"
                  onClick={() => trackCtaClick("hero_free_quote")}
                >
                  <Info className="h-4 w-4" />
                  {hero.secondaryCta}
                </Link>
              </Button>
            </div>

            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6" role="list">
              {hero.trustIndicators.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
