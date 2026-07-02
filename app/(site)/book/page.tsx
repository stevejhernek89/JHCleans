import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/content/get-content";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata = createPageMetadata({
  title: "Book a Cleaning",
  description:
    "Schedule your professional garbage can cleaning, sanitizing, and deodorizing service online.",
  path: "/book",
});

export default async function BookPage() {
  const content = await getSiteContent();

  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {content.pages.book.title}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {content.pages.book.subtitle}
          </p>
        </div>
        <Suspense fallback={<div className="glass rounded-2xl p-8 animate-pulse h-96" />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
