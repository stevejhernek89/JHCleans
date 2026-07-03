"use client";

import Link from "next/link";

interface PrivacyConsentLabelProps {
  htmlFor: string;
  businessName: string;
  purpose: string;
}

export function PrivacyConsentLabel({
  htmlFor,
  businessName,
  purpose,
}: PrivacyConsentLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm leading-relaxed text-muted-foreground">
      I have read and agree to the{" "}
      <Link href="/privacy" className="text-accent hover:underline">
        Privacy Policy
      </Link>{" "}
      and consent to {businessName} contacting me {purpose} using the information I provided.
    </label>
  );
}
