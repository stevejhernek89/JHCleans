"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Wind,
  Shield,
  Truck,
  Calendar,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { featureCards } from "@/lib/config/content";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  wind: Wind,
  shield: Shield,
  truck: Truck,
  calendar: Calendar,
  "refresh-cw": RefreshCw,
};

export function FeatureCards() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="py-16 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="sr-only">
          Our Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {featureCards.map((feature, i) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <motion.article
                key={feature.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group glass rounded-2xl p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
