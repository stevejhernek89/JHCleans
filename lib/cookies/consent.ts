export const CONSENT_STORAGE_KEY = "jhcleans_cookie_consent";

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  updatedAt: string;
}

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsent;
    if (typeof parsed.analytics !== "boolean" || !parsed.updatedAt) {
      return null;
    }

    return { essential: true, analytics: parsed.analytics, updatedAt: parsed.updatedAt };
  } catch {
    return null;
  }
}

export function storeConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    essential: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  return consent;
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true;
}
