import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata = createPageMetadata({
  title: "Book a Cleaning",
  description:
    "Schedule your professional garbage can cleaning, sanitizing, and deodorizing service online.",
  path: "/book",
});

export default function BookPage() {
  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Book a Cleaning
          </h1>
          <p className="mt-3 text-muted-foreground">
            Complete the form below to request your curbside bin cleaning service.
          </p>
        </div>
        <Suspense fallback={<div className="glass rounded-2xl p-8 animate-pulse h-96" />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
