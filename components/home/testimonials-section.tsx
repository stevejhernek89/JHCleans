"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useSiteContent } from "@/lib/content/site-content-context";
import { FoundersPhoto } from "@/components/home/founders-photo";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const { testimonials, homepage } = useSiteContent();
  const { items, isPlaceholder } = testimonials;

  const next = () => setCurrent((c) => (c + 1) % items.length);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  return (
    <section className="py-16 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2
              id="testimonials-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              {homepage.sections.testimonials.title}
            </h2>
            {isPlaceholder && (
              <p className="mt-2 text-sm text-amber-400/80">
                Placeholder reviews — replace with real testimonials before launch
              </p>
            )}

            <div className="relative mt-8">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current}
                  initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? {} : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-light rounded-2xl p-8 shadow-xl"
                >
                  <Quote className="mb-4 h-8 w-8 text-accent" aria-hidden="true" />
                  <p className="text-lg leading-relaxed text-zinc-700 italic">
                    &ldquo;{items[current].quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-500">
                      ?
                    </div>
                    <div>
                      <cite className="not-italic font-semibold text-zinc-900">
                        {items[current].author}
                      </cite>
                      <p className="text-sm text-zinc-500">{items[current].location}</p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="ml-2 flex gap-1.5" role="tablist" aria-label="Testimonial slides">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Testimonial ${i + 1}`}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? "w-6 bg-accent" : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <FoundersPhoto showLink />
        </div>
      </div>
    </section>
  );
}
