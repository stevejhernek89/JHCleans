"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getSiteContentOverrides, saveSiteContentOverrides } from "@/lib/admin/store";
import { getDefaultSiteContent } from "@/lib/content/defaults";
import { getSiteContent } from "@/lib/content/get-content";
import { deepMerge } from "@/lib/content/merge";
import type { SiteContent, SiteContentSection } from "@/lib/content/types";

async function requireAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}

function revalidateSiteContent() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/pricing");
  revalidatePath("/contact");
  revalidatePath("/book");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/cancellation");
  revalidatePath("/service-agreement");
}

export async function getSiteContentAction(): Promise<SiteContent> {
  await requireAuth();
  return getSiteContent();
}

export async function getSiteContentDefaultsAction(): Promise<SiteContent> {
  await requireAuth();
  return getDefaultSiteContent();
}

export async function saveSiteContentSectionAction<K extends SiteContentSection>(
  section: K,
  data: SiteContent[K]
) {
  await requireAuth();

  try {
    const currentOverrides = (await getSiteContentOverrides()) ?? {};
    const nextOverrides = {
      ...currentOverrides,
      [section]: data,
      updatedAt: new Date().toISOString(),
    };

    await saveSiteContentOverrides(nextOverrides);
    revalidateSiteContent();

    return {
      success: true,
      message: "Content saved.",
      content: await getSiteContent(),
    };
  } catch (error) {
    console.error("Failed to save site content:", error);
    const message =
      error instanceof Error &&
      error.message.includes("Supabase is not configured for production")
        ? "Database not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY to your environment."
        : error instanceof Error && error.message.includes("Supabase admin store is not configured")
          ? "Add SUPABASE_SERVICE_KEY to .env.local (Supabase Dashboard → API → service_role key)."
          : "Failed to save content. Please try again.";
    return {
      success: false,
      message,
    };
  }
}

export async function resetSiteContentSectionAction(section: SiteContentSection) {
  await requireAuth();

  try {
    const currentOverrides = (await getSiteContentOverrides()) ?? {};
    const { [section]: _removed, ...rest } = currentOverrides as Record<string, unknown>;
    const nextOverrides = {
      ...rest,
      updatedAt: new Date().toISOString(),
    };

    await saveSiteContentOverrides(nextOverrides);
    revalidateSiteContent();

    return {
      success: true,
      message: "Section reset to defaults.",
      content: await getSiteContent(),
    };
  } catch (error) {
    console.error("Failed to reset site content section:", error);
    return {
      success: false,
      message: "Failed to reset section. Please try again.",
    };
  }
}

export async function saveFullSiteContentAction(content: SiteContent) {
  await requireAuth();

  try {
    const defaults = getDefaultSiteContent();
    const overrides = deepMerge(defaults, content);
    overrides.updatedAt = new Date().toISOString();

    await saveSiteContentOverrides(overrides);
    revalidateSiteContent();

    return {
      success: true,
      message: "All content saved.",
      content: await getSiteContent(),
    };
  } catch (error) {
    console.error("Failed to save full site content:", error);
    return {
      success: false,
      message: "Failed to save content. Please try again.",
    };
  }
}
