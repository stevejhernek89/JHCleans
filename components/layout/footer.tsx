"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { businessConfig } from "@/lib/config/business";
import { navigationLinks } from "@/lib/config/content";
import { formatPhoneForTel } from "@/lib/utils";

const socialLinks = [
  { key: "facebook" as const, label: "Facebook" },
  { key: "instagram" as const, label: "Instagram" },
  { key: "tiktok" as const, label: "TikTok" },
  { key: "yelp" as const, label: "Yelp" },
  { key: "google" as const, label: "Google" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, social } = businessConfig;
  const configuredSocial = socialLinks.filter(
    (s) => social[s.key] && social[s.key].length > 0
  );

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {businessConfig.description}
            </p>
            <p className="text-sm font-medium text-accent">
              {businessConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                {contact.phoneTel ? (
                  <a
                    href={`tel:${formatPhoneForTel(contact.phoneTel)}`}
                    className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {contact.phone}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {contact.phone}
                  </span>
                )}
              </li>
              <li>
                {contact.email && !contact.email.includes("[") ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {contact.email}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {contact.email}
                  </span>
                )}
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                {contact.address.display}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            {configuredSocial.length > 0 && (
              <>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                  Follow Us
                </h3>
                <ul className="space-y-2 text-sm">
                  {configuredSocial.map((s) => (
                    <li key={s.key}>
                      <a
                        href={social[s.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {businessConfig.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-4 text-xs" aria-label="Legal">
            <Link href="/privacy" className="text-muted-foreground hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-accent">
              Terms of Service
            </Link>
            <Link href="/service-agreement" className="text-muted-foreground hover:text-accent">
              Service Agreement
            </Link>
            <Link href="/cancellation" className="text-muted-foreground hover:text-accent">
              Cancellation Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
