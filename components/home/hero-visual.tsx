"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Droplets, Shield, Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/content/site-content-context";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const highlights = [
  { Icon: Shield, label: "Sanitized" },
  { Icon: Droplets, label: "Deep cleaned" },
  { Icon: Sparkles, label: "Deodorized" },
] as const;

export function HeroVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const { serviceArea } = useSiteContent();

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto w-full max-w-md pb-6 lg:max-w-lg"
    >
      <div
        className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#071428] shadow-2xl shadow-black/50">
        <div className="relative aspect-[4/5] sm:aspect-[5/4]">
          <Image
            src="/images/bin-after.png"
            alt="Sparkling clean garbage can after professional cleaning"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-center"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#071428] via-[#071428]/20 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg">
            Sparkling Clean
          </span>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/10 bg-[#050d1f] px-4 py-3.5">
          {highlights.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <Link
        href="#service-area"
        className="absolute -bottom-4 right-2 flex max-w-[calc(100%-1rem)] items-center gap-2.5 rounded-xl border border-white/10 bg-[#0c1529]/95 px-4 py-3 shadow-xl backdrop-blur-md transition-colors hover:border-primary/30 sm:right-4"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            {serviceArea.regionLabel}
          </span>
          <span className="block text-xs text-muted-foreground">
            Check service availability
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
