"use server";

import { contactSchema, quoteSchema } from "@/lib/validations/schemas";
import { submitContact, submitQuote } from "@/lib/email/send";

export async function submitContactAction(formData: unknown) {
  try {
    const parsed = contactSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Please check the form for errors.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await submitContact(parsed.data);
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Contact submission error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function submitQuoteAction(formData: unknown) {
  try {
    const parsed = quoteSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Please check the form for errors.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await submitQuote(parsed.data);
    return {
      success: true,
      message: result.message,
      referenceId: result.referenceId,
    };
  } catch (error) {
    console.error("Quote submission error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
