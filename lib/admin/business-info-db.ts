import type { SiteContent } from "@/lib/content/types";
import { getSupabaseClient, isSupabaseStoreEnabled } from "./db";

export type BusinessInfoRow = {
  id: string;
  name: string;
  short_name: string;
  tagline: string;
  description: string;
  phone: string;
  phone_tel: string;
  email: string;
  address_display: string;
  address_city: string;
  address_state: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  hours_note: string;
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  social_yelp: string;
  social_google: string;
  satisfaction_guarantee: string;
  additional: {
    textEnabled?: boolean;
    stats?: SiteContent["business"]["stats"];
    claims?: SiteContent["business"]["claims"];
    booking?: SiteContent["business"]["booking"];
  };
  updated_at: string;
};

function rowToBusiness(row: BusinessInfoRow): SiteContent["business"] {
  const additional = row.additional ?? {};

  return {
    name: row.name,
    shortName: row.short_name,
    tagline: row.tagline,
    description: row.description,
    contact: {
      phone: row.phone,
      phoneTel: row.phone_tel,
      email: row.email,
      textEnabled: additional.textEnabled ?? false,
      address: {
        display: row.address_display,
        city: row.address_city,
        state: row.address_state,
      },
    },
    hours: {
      weekdays: row.hours_weekdays,
      saturday: row.hours_saturday,
      sunday: row.hours_sunday,
      note: row.hours_note,
    },
    social: {
      facebook: row.social_facebook,
      instagram: row.social_instagram,
      tiktok: row.social_tiktok,
      yelp: row.social_yelp,
      google: row.social_google,
    },
    stats: additional.stats ?? {
      enabled: false,
      items: [],
    },
    claims: {
      bacteriaRemoval: additional.claims?.bacteriaRemoval ?? "",
      ecoCertification: additional.claims?.ecoCertification ?? "",
      satisfactionGuarantee: row.satisfaction_guarantee,
    },
    booking: additional.booking ?? {
      minLeadDays: 1,
      maxLeadDays: 60,
      timeWindows: [],
      trashDays: [],
    },
  };
}

function businessToRow(business: SiteContent["business"]): Omit<BusinessInfoRow, "id" | "updated_at"> {
  return {
    name: business.name,
    short_name: business.shortName,
    tagline: business.tagline,
    description: business.description,
    phone: business.contact.phone,
    phone_tel: business.contact.phoneTel,
    email: business.contact.email,
    address_display: business.contact.address.display,
    address_city: business.contact.address.city,
    address_state: business.contact.address.state,
    hours_weekdays: business.hours.weekdays,
    hours_saturday: business.hours.saturday,
    hours_sunday: business.hours.sunday,
    hours_note: business.hours.note,
    social_facebook: business.social.facebook,
    social_instagram: business.social.instagram,
    social_tiktok: business.social.tiktok,
    social_yelp: business.social.yelp,
    social_google: business.social.google,
    satisfaction_guarantee: business.claims.satisfactionGuarantee,
    additional: {
      textEnabled: business.contact.textEnabled,
      stats: business.stats,
      claims: {
        bacteriaRemoval: business.claims.bacteriaRemoval,
        ecoCertification: business.claims.ecoCertification,
        satisfactionGuarantee: business.claims.satisfactionGuarantee,
      },
      booking: business.booking,
    },
  };
}

export async function readBusinessInfoFromSupabase(): Promise<SiteContent["business"] | null> {
  if (!isSupabaseStoreEnabled()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("site_business_info")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return rowToBusiness(data as BusinessInfoRow);
}

export async function writeBusinessInfoToSupabase(
  business: SiteContent["business"]
): Promise<void> {
  if (!isSupabaseStoreEnabled()) {
    return;
  }

  const supabase = getSupabaseClient();
  const row = businessToRow(business);
  const { error } = await supabase.from("site_business_info").upsert({
    id: "default",
    ...row,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
