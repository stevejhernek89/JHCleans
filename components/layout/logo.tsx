import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { jh: "text-lg", rest: "text-base" },
  md: { jh: "text-xl", rest: "text-lg" },
  lg: { jh: "text-2xl", rest: "text-xl" },
};

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link
      href="/"
      className={cn("inline-flex items-baseline gap-0.5 font-bold tracking-tight", className)}
      aria-label="JHCleans.com — Home"
    >
      {/* Replace this span group with an SVG logo when available */}
      <span className={cn("text-accent", sizes.jh)}>JH</span>
      <span className={cn("text-foreground", sizes.rest)}>Cleans.com</span>
    </Link>
  );
}
