import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AdminStore } from "./types";

const defaultStore: AdminStore = {
  jobs: [],
  transactions: [],
  siteContentOverrides: null,
};

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseServiceKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_KEY;
}

export function isSupabaseStoreEnabled(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    throw new Error("Supabase admin store is not configured.");
  }

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export async function readStoreFromSupabase(): Promise<AdminStore> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("admin_store")
    .select("data")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.data) {
    return { ...defaultStore };
  }

  return data.data as AdminStore;
}

export async function writeStoreToSupabase(store: AdminStore): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("admin_store").upsert({
    id: "default",
    data: store,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
