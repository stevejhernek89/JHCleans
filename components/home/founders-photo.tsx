import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { aboutContent } from "@/lib/config/content";
import { cn } from "@/lib/utils";

interface FoundersPhotoProps {
  className?: string;
  showCaption?: boolean;
  showLink?: boolean;
}

function FounderFigure({
  image,
  imageAlt,
  side,
}: {
  image: string | null;
  imageAlt: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        side === "left" ? "mr-[-8%]" : "ml-[-8%]"
      )}
    >
      {/* Head */}
      <div className="relative z-10 mb-[-6px]">
        {image ? (
          <div className="relative h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] overflow-hidden rounded-full border-[3px] border-white/90 shadow-lg ring-2 ring-accent/40">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-top scale-110"
              sizes="88px"
            />
          </div>
        ) : (
          <div
            className="flex h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] items-center justify-center rounded-full border-[3px] border-dashed border-white/40 bg-white/10 shadow-lg"
            aria-label={imageAlt}
          >
            <span className="text-lg font-bold text-white/50 sm:text-xl">?</span>
          </div>
        )}
      </div>

      {/* Body / shirt silhouette */}
      <div
        className={cn(
          "relative flex flex-col items-center rounded-t-[40%] px-5 pt-3 pb-6 sm:px-6 sm:pt-4 sm:pb-8",
          "bg-gradient-to-b from-[#1e3a5f] to-[#0f2744]",
          "border border-white/10 shadow-xl",
          side === "left" ? "rounded-bl-2xl" : "rounded-br-2xl"
        )}
        aria-hidden={!image}
      >
        <div className="mb-1 text-[9px] font-bold tracking-wider text-accent sm:text-[10px]">
          JHCleans.com
        </div>
        <div className="h-8 w-14 rounded-full bg-white/5 sm:h-10 sm:w-16" />
      </div>
    </div>
  );
}

export function FoundersPhoto({
  className,
  showCaption = true,
  showLink = false,
}: FoundersPhotoProps) {
  const { founders, foundersNote, photoPlaceholder } = aboutContent;
  const [leftFounder, rightFounder] = founders;

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
        {/* Branded backdrop — truck/service scene */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#050a18]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 80%, rgba(0,210,255,0.25) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        {/* Service truck silhouette */}
        <div
          className="absolute bottom-0 left-1/2 h-[45%] w-[85%] -translate-x-1/2 rounded-t-3xl bg-gradient-to-t from-white/15 to-white/5 border border-white/10"
          aria-hidden="true"
        >
          <div className="absolute left-[8%] top-[18%] h-[55%] w-[28%] rounded-lg bg-white/10 border border-white/10" />
          <div className="absolute right-[10%] top-[22%] text-[10px] font-bold tracking-widest text-white/30 sm:text-xs">
            JHCLEANS
          </div>
        </div>

        {/* Two founders standing together */}
        <div className="absolute inset-x-0 bottom-[12%] flex items-end justify-center">
          <FounderFigure
            side="left"
            image={leftFounder.image}
            imageAlt={leftFounder.imageAlt}
          />
          <FounderFigure
            side="right"
            image={rightFounder.image}
            imageAlt={rightFounder.imageAlt}
          />
        </div>

        {/* Bottom overlay badge — matches mockup */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-10">
          {showCaption && (
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary sm:text-base">
              <Heart className="h-4 w-4 fill-primary" aria-hidden="true" />
              {foundersNote}
            </p>
          )}
          {photoPlaceholder && (
            <p className="mt-1 text-center text-[10px] text-white/50 sm:text-xs">
              {photoPlaceholder}
            </p>
          )}
        </div>
      </div>

      {showLink && (
        <Link
          href="/about"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Learn our story →
        </Link>
      )}
    </div>
  );
}
