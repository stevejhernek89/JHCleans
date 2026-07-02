"use server";

import { createJobFromBooking } from "@/app/actions/admin";
import { bookingSchema } from "@/lib/validations/schemas";
import { submitBooking } from "@/lib/email/send";

export async function submitBookingAction(formData: unknown) {
  try {
    const parsed = bookingSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Please check the form for errors.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await submitBooking(parsed.data);

    try {
      await createJobFromBooking(parsed.data, result.referenceId);
    } catch (storeError) {
      console.error("Failed to create admin job from booking:", storeError);
    }

    return {
      success: true,
      message: result.message,
      referenceId: result.referenceId,
    };
  } catch (error) {
    console.error("Booking submission error:", error);
    return {
      success: false,
      message:
        "Something went wrong. Please try again or contact us directly.",
    };
  }
}
