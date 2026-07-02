-- Business info table: one column per admin form field
CREATE TABLE IF NOT EXISTS public.site_business_info (
  id text PRIMARY KEY DEFAULT 'default',
  name text NOT NULL DEFAULT '',
  short_name text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  phone_tel text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address_display text NOT NULL DEFAULT '',
  address_city text NOT NULL DEFAULT '',
  address_state text NOT NULL DEFAULT '',
  hours_weekdays text NOT NULL DEFAULT '',
  hours_saturday text NOT NULL DEFAULT '',
  hours_sunday text NOT NULL DEFAULT '',
  hours_note text NOT NULL DEFAULT '',
  social_facebook text NOT NULL DEFAULT '',
  social_instagram text NOT NULL DEFAULT '',
  social_tiktok text NOT NULL DEFAULT '',
  social_yelp text NOT NULL DEFAULT '',
  social_google text NOT NULL DEFAULT '',
  satisfaction_guarantee text NOT NULL DEFAULT '',
  additional jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_business_info ENABLE ROW LEVEL SECURITY;
