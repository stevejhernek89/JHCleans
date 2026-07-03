"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getStoredConsent,
  storeConsent,
  type CookieConsent,
} from "@/lib/cookies/consent";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  hasChosen: boolean;
  analyticsAllowed: boolean;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  openBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      setHasChosen(true);
      setBannerOpen(false);
    } else {
      setBannerOpen(true);
    }
  }, []);

  const persist = useCallback((analytics: boolean) => {
    const next = storeConsent(analytics);
    setConsent(next);
    setHasChosen(true);
    setBannerOpen(false);
  }, []);

  const acceptAll = useCallback(() => persist(true), [persist]);
  const acceptEssentialOnly = useCallback(() => persist(false), [persist]);
  const openBanner = useCallback(() => setBannerOpen(true), []);

  const value = useMemo(
    () => ({
      consent,
      hasChosen,
      analyticsAllowed: consent?.analytics === true,
      acceptAll,
      acceptEssentialOnly,
      openBanner,
    }),
    [consent, hasChosen, acceptAll, acceptEssentialOnly, openBanner]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {bannerOpen && (
        <CookieConsentBanner
          onAcceptAll={acceptAll}
          onEssentialOnly={acceptEssentialOnly}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
