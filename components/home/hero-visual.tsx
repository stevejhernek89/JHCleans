"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Droplets, Shield, Sparkles } from "lucide-react";
import { useRef } from "react";
import { serviceAreaConfig } from "@/lib/config/service-area";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const floatingIcons = [
  { Icon: Droplets, position: "top-8 right-12", delay: 0 },
  { Icon: Shield, position: "top-1/3 left-4", delay: 0.5 },
  { Icon: Sparkles, position: "bottom-1/3 right-6", delay: 1 },
];

export function HeroVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={reducedMotion ? {} : { rotateX, rotateY, transformPerspective: 1000 }}
        className="relative aspect-square max-h-[500px] w-full"
      >
        {/* Glow behind can */}
        <div
          className="absolute inset-8 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        >
          {!reducedMotion && (
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full rounded-full bg-accent/30"
            />
          )}
        </div>

        {/* Garbage can illustration */}
        <div className="relative flex h-full items-center justify-center">
          <div className="relative w-48 sm:w-56 lg:w-64">
            {/* Can body */}
            <div className="relative mx-auto">
              <div className="h-56 w-full rounded-b-2xl rounded-t-lg bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl border border-zinc-600/50">
                {/* Lid */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-[110%] rounded-t-xl bg-gradient-to-b from-zinc-600 to-zinc-700 border border-zinc-500/50" />
                {/* Handle */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-16 rounded-full border-2 border-zinc-500" />
                {/* Ridges */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-2 right-2 h-px bg-zinc-600/50"
                    style={{ top: `${30 + i * 15}%` }}
                  />
                ))}
                {/* Water spray effect */}
                <div className="absolute -right-8 top-1/4 h-32 w-24 overflow-hidden" aria-hidden="true">
                  {!reducedMotion ? (
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6], x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-full w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/40 to-accent/20 blur-sm transform -skew-x-12" />
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-1 w-1 rounded-full bg-accent/80"
                          style={{ top: `${i * 12}%`, left: `${i * 8}%` }}
                          animate={{ x: [0, 20, 40], opacity: [1, 0.5, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-transparent to-accent/30 blur-sm" />
                  )}
                </div>
                {/* Sparkle highlights */}
                {!reducedMotion &&
                  [...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full bg-white"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${15 + (i % 3) * 25}%`,
                      }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      aria-hidden="true"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {!reducedMotion &&
          [...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-accent/60"
              style={{
                top: `${10 + (i * 7) % 80}%`,
                left: `${5 + (i * 11) % 90}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
              aria-hidden="true"
            />
          ))}

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, position, delay }) => (
          <motion.div
            key={position}
            className={`absolute ${position} flex h-10 w-10 items-center justify-center rounded-full glass glow-blue`}
            animate={reducedMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay }}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5 text-accent" />
          </motion.div>
        ))}

        {/* Technical circle */}
        <div
          className="absolute inset-4 rounded-full border border-accent/10"
          aria-hidden="true"
        >
          <div className="absolute inset-4 rounded-full border border-dashed border-accent/5" />
        </div>

        {/* Service area card */}
        <div className="absolute bottom-4 right-0 sm:bottom-8 sm:right-4">
          <div className="glass rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {serviceAreaConfig.regionLabel}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Check your ZIP below
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
