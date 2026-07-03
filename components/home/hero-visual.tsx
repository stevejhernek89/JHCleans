"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import { MapPin, Droplets, Shield, Sparkles, Check } from "lucide-react";
import { useSiteContent } from "@/lib/content/site-content-context";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const highlights = [
  { Icon: Shield, label: "Sanitized" },
  { Icon: Droplets, label: "Deep cleaned" },
  { Icon: Sparkles, label: "Deodorized" },
] as const;

const SPARKLE_POINTS = [
  { top: "18%", left: "62%", delay: 0 },
  { top: "32%", left: "28%", delay: 0.4 },
  { top: "45%", left: "72%", delay: 0.8 },
  { top: "55%", left: "38%", delay: 0.2 },
  { top: "28%", left: "48%", delay: 0.6 },
  { top: "40%", left: "58%", delay: 1.0 },
] as const;

function SparkleField({
  wipeProgress,
  reducedMotion,
}: {
  wipeProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const opacity = useTransform(wipeProgress, [0, 55, 80, 100], [0, 0, 1, 1]);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity }}
      aria-hidden="true"
    >
      {SPARKLE_POINTS.map((point, i) => (
        <motion.span
          key={i}
          className="absolute text-primary"
          style={{ top: point.top, left: point.left }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.2,
            delay: point.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-3.5 w-3.5 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        </motion.span>
      ))}
    </motion.div>
  );
}

export function HeroVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const { serviceArea } = useSiteContent();

  const wipeProgress = useMotionValue(reducedMotion ? 100 : 0);
  const beforeClip = useTransform(
    wipeProgress,
    (v) => `inset(0 ${v}% 0 0)`
  );
  const sweepLeft = useTransform(wipeProgress, (v) => `${v}%`);
  const sweepOpacity = useTransform(wipeProgress, [0, 50, 100], [0.9, 1, 0]);
  const cleanBadgeOpacity = useTransform(wipeProgress, [0, 65, 85], [0, 0.6, 1]);
  const dirtyBadgeOpacity = useTransform(wipeProgress, [0, 35, 55], [1, 0.5, 0]);

  useEffect(() => {
    if (reducedMotion) return;

    const controls = animate(wipeProgress, [0, 100, 100, 0], {
      duration: 9,
      times: [0, 0.38, 0.62, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1],
    });

    return () => controls.stop();
  }, [reducedMotion, wipeProgress]);

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto w-full max-w-md pb-8 lg:max-w-lg"
    >
      <div
        className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="glass glow-green relative overflow-hidden rounded-3xl shadow-2xl shadow-black/30">
        <div className="relative aspect-[4/5] sm:aspect-[5/4]">
          {/* Clean (after) — base layer */}
          <Image
            src="/images/bin-after.png"
            alt="Sparkling clean garbage can after professional cleaning"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-center"
            priority
          />

          {/* Dirty (before) — animated wipe overlay */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ clipPath: beforeClip }}
          >
            <Image
              src="/images/bin-before.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover object-center"
              priority
              aria-hidden="true"
            />
          </motion.div>

          {/* Sweep line */}
          {!reducedMotion && (
            <motion.div
              className="pointer-events-none absolute top-0 bottom-0 z-[15] w-px"
              style={{ left: sweepLeft, opacity: sweepOpacity }}
              aria-hidden="true"
            >
              <div className="absolute inset-y-0 -left-6 w-12 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
              <div className="absolute inset-y-0 w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
            </motion.div>
          )}

          <SparkleField
            wipeProgress={wipeProgress}
            reducedMotion={reducedMotion}
          />

          {/* Soft bottom gradient for overlays */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
            aria-hidden="true"
          />

          {/* Status badges */}
          <motion.div
            className="absolute top-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md"
            style={{ opacity: cleanBadgeOpacity }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-2.5 w-2.5 text-primary" aria-hidden="true" />
            </span>
            Sparkling clean
          </motion.div>

          {!reducedMotion && (
            <motion.div
              className="absolute top-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
              style={{ opacity: dirtyBadgeOpacity }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
              Before cleaning
            </motion.div>
          )}

          {/* Feature pills */}
          <div className="absolute right-0 bottom-0 left-0 z-30 flex flex-wrap gap-2 p-4">
            {highlights.map(({ Icon, label }, i) => (
              <motion.span
                key={label}
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.45 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link
          href="#service-area"
          className="group absolute -bottom-2 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl border border-white/10 bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/25 hover:shadow-primary/10 sm:right-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {serviceArea.regionLabel}
            </span>
            <span className="block text-xs text-muted-foreground transition-colors group-hover:text-foreground/70">
              Check service availability
            </span>
          </span>
          {!reducedMotion && (
            <motion.span
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          )}
        </Link>
      </motion.div>
    </motion.div>
  );
}
