"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Droplets,
  Sparkles,
  Smile,
  Shield,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/lib/content/site-content-context";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const iconMap: Record<string, LucideIcon> = {
  smile: Smile,
  sparkles: Sparkles,
  shield: Shield,
  leaf: Leaf,
};

export function StatsBar() {
  const { business } = useSiteContent();
  const { stats } = business;

  if (!stats.enabled) return null;

  const hasValues = stats.items.some((item) => item.value);
  if (!hasValues) return null;

  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="py-12" aria-label="Business statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.items.map((stat, i) => {
              if (!stat.value) return null;
              const Icon = iconMap[stat.icon] ?? Sparkles;
              return (
                <motion.div
                  key={stat.id}
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon
                    className="mx-auto mb-3 h-8 w-8 text-accent"
                    aria-hidden="true"
                  />
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export icons used elsewhere
export { Calendar, MapPin, Droplets, Sparkles };
