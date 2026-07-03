"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSiteContent } from "@/lib/content/site-content-context";

export function BeforeAfterSlider() {
  const { homepage } = useSiteContent();
  const pricingPreviewPlans = homepage.pricingPreview;
  const { beforeAfter } = homepage.sections;
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 5));
    }
  };

  return (
    <section className="py-16 sm:py-24" aria-labelledby="before-after-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071428] shadow-2xl shadow-black/40">
              <div className="border-b border-white/10 bg-[#050d1f] px-6 py-4 text-center">
                <h2
                  id="before-after-heading"
                  className="text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-base"
                >
                  {beforeAfter.title}
                </h2>
              </div>

              <noscript>
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <Image
                      src="/images/bin-before.png"
                      alt="Dirty garbage can before cleaning"
                      width={819}
                      height={1024}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-md bg-zinc-800/90 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      {beforeAfter.beforeLabel}
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/bin-after.png"
                      alt="Clean garbage can after cleaning"
                      width={819}
                      height={1024}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 right-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                      {beforeAfter.afterLabel}
                    </span>
                  </div>
                </div>
              </noscript>

              <div
                ref={containerRef}
                className="relative aspect-[4/3] w-full select-none sm:aspect-[16/10]"
                role="group"
                aria-label="Before and after comparison slider"
              >
                {/* After (clean) - full background */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/bin-after.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                    draggable={false}
                  />
                  <span className="absolute top-3 right-3 z-20 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg">
                    {beforeAfter.afterLabel}
                  </span>
                </div>

                {/* Before (dirty) - clipped overlay */}
                <div
                  className="absolute inset-0 z-10"
                  style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                  <Image
                    src="/images/bin-before.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                    draggable={false}
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-zinc-800/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                    {beforeAfter.beforeLabel}
                  </span>
                </div>

                {/* Slider divider + handle */}
                <div
                  className="absolute top-0 bottom-0 z-30 w-0.5 bg-white/90 shadow-lg"
                  style={{ left: `${position}%`, transform: "translateX(-50%)" }}
                >
                  <button
                    type="button"
                    className={cn(
                      "absolute bottom-4 left-1/2 -translate-x-1/2",
                      "flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl",
                      "cursor-ew-resize transition-transform",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#071428]",
                      isDragging && "scale-110"
                    )}
                    aria-label="Drag to compare before and after"
                    aria-valuenow={Math.round(position)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="slider"
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    onKeyDown={handleKeyDown}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-zinc-700 -mr-1" aria-hidden="true" />
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700 -ml-1" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground sm:text-left">
              {beforeAfter.caption}
            </p>
          </div>

          <PricingPreview />
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  const { homepage } = useSiteContent();
  const pricingPreviewPlans = homepage.pricingPreview;

  return (
    <div aria-labelledby="pricing-preview-heading">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071428] shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 bg-[#050d1f] px-6 py-4 text-center">
          <h2
            id="pricing-preview-heading"
            className="text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-base"
          >
            Pricing Plans
          </h2>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
          {pricingPreviewPlans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl bg-white p-4 text-center shadow-lg",
                plan.popular && "ring-2 ring-primary sm:-mt-2 sm:mb-2 sm:scale-[1.03]"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="mt-1 text-sm font-bold text-[#0a1628]">{plan.name}</h3>
              <p className="mt-1 min-h-[2.5rem] text-[11px] leading-snug text-zinc-500">
                {plan.description}
              </p>

              <div className="my-4">
                <p className="text-2xl font-bold text-[#0a1628]">{plan.price}</p>
                <p className="mt-1 text-[10px] text-zinc-400">
                  {plan.note || "Contact for pricing details"}
                </p>
              </div>

              <ul className="mb-4 space-y-1.5 text-left" role="list">
                {["Deep clean & sanitize", "Deodorizing treatment", "Curbside service"].map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-1.5 text-[10px] text-zinc-600"
                    >
                      <Check className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  )
                )}
              </ul>

              <Link
                href="/book"
                className={cn(
                  "mt-auto rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-[#0a1628] text-white hover:bg-[#0a1628]/90"
                )}
              >
                {plan.popular ? "Choose Plan" : "Book Now"}
              </Link>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground lg:text-left">
        Visit our{" "}
        <Link href="/pricing" className="text-accent hover:underline">
          pricing page
        </Link>{" "}
        for full plan details.
      </p>
    </div>
  );
}
