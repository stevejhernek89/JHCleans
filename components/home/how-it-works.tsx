"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Droplets, Sparkles, type LucideIcon } from "lucide-react";
import { howItWorksSteps } from "@/lib/config/content";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const iconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  "map-pin": MapPin,
  droplets: Droplets,
  sparkles: Sparkles,
};

export function HowItWorks() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 scroll-mt-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-light rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="mb-12 text-center">
            <h2
              id="how-it-works-heading"
              className="text-3xl font-bold text-zinc-900 sm:text-4xl"
            >
              How It Works
            </h2>
            <p className="mt-3 text-zinc-600">
              Four simple steps to cleaner, fresher bins
            </p>
          </div>

          {/* Desktop timeline */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon] ?? Calendar;
              return (
                <motion.div
                  key={step.step}
                  initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  {i < howItWorksSteps.length - 1 && (
                    <div
                      className="absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] border-t-2 border-dashed border-zinc-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      {step.step}
                    </span>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden space-y-8">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon] ?? Calendar;
              return (
                <motion.div
                  key={step.step}
                  initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-4"
                >
                  {i < howItWorksSteps.length - 1 && (
                    <div
                      className="absolute left-8 top-16 h-[calc(100%+1rem)] w-0.5 border-l-2 border-dashed border-zinc-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold">
                      {step.step}
                    </span>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div className="pt-2">
                    <h3 className="mb-1 text-lg font-semibold text-zinc-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
