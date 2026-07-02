import { Suspense } from "react";
import { Phone, Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import { createPageMetadata } from "@/lib/seo/metadata";
import { businessConfig } from "@/lib/config/business";
import { ContactForm } from "@/components/booking/contact-form";
import { QuoteForm } from "@/components/booking/quote-form";
import { formatPhoneForTel } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact JHCleans for garbage can cleaning service inquiries, quotes, and booking assistance.",
  path: "/contact",
});

function ContactContent({
  searchParams,
}: {
  searchParams: { subject?: string };
}) {
  const isQuote = searchParams.subject === "quote" || searchParams.subject === "commercial";

  return (
    <div className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-muted-foreground">
            Have a question or need a quote? We&apos;re here to help.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Get in Touch</h2>

              {businessConfig.contact.phoneTel ? (
                <a
                  href={`tel:${formatPhoneForTel(businessConfig.contact.phoneTel)}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{businessConfig.contact.phone}</span>
                </a>
              ) : (
                <p className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {businessConfig.contact.phone}
                </p>
              )}

              {businessConfig.contact.textEnabled && businessConfig.contact.phoneTel && (
                <a
                  href={`sms:${formatPhoneForTel(businessConfig.contact.phoneTel)}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Text us
                </a>
              )}

              {businessConfig.contact.email && !businessConfig.contact.email.includes("[") ? (
                <a
                  href={`mailto:${businessConfig.contact.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {businessConfig.contact.email}
                </a>
              ) : (
                <p className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {businessConfig.contact.email}
                </p>
              )}

              <p className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                {businessConfig.contact.address.display}
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" aria-hidden="true" />
                Business Hours
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{businessConfig.hours.weekdays}</li>
                <li>{businessConfig.hours.saturday}</li>
                <li>{businessConfig.hours.sunday}</li>
                <li className="text-accent font-medium">{businessConfig.hours.note}</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            {isQuote ? (
              <>
                <h2 className="mb-4 text-xl font-bold text-foreground">Request a Quote</h2>
                <QuoteForm />
              </>
            ) : (
              <>
                <h2 className="mb-4 text-xl font-bold text-foreground">Send a Message</h2>
                <ContactForm defaultSubject={searchParams.subject ?? "general"} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className="pt-32 animate-pulse h-96" />}>
      <ContactContent searchParams={params} />
    </Suspense>
  );
}
