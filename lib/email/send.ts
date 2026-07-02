import { Resend } from "resend";
import { businessConfig } from "@/lib/config/business";
import type { BookingSchema } from "@/lib/validations/schemas";
import type { ContactSchema } from "@/lib/validations/schemas";
import type { QuoteSchema } from "@/lib/validations/schemas";

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `JHC-${timestamp}-${random}`;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getNotificationEmail(): string {
  return (
    process.env.BOOKING_NOTIFICATION_EMAIL ??
    process.env.GUARDIAN_EMAIL ??
    businessConfig.owner.guardianEmail
  );
}

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "bookings@jhcleans.com";
}

async function sendEmail(
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();
  const to = getNotificationEmail();

  if (!resend || !to) {
    console.log("[Email disabled] Would send:", subject);
    console.log(html);
    return { sent: false, error: "Email not configured" };
  }

  try {
    const { error } = await resend.emails.send({
      from: `${businessConfig.shortName} <${getFromEmail()}>`,
      to: [to],
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Future: store booking in Supabase
 * Uncomment and implement when SUPABASE_URL and SUPABASE_SERVICE_KEY are set
 */
async function storeBookingSubmission(
  _data: BookingSchema,
  _referenceId: string
): Promise<void> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return;
  }
  // TODO: Implement Supabase insert
  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  // await supabase.from('bookings').insert({ ... });
}

export async function submitBooking(data: BookingSchema) {
  const referenceId = generateReferenceId();

  const html = `
    <h2>New Booking Request — ${referenceId}</h2>
    <p><strong>Customer:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.streetAddress}, ${data.city}, ${data.state} ${data.zipCode}</p>
    <p><strong>Service:</strong> ${data.serviceType}</p>
    <p><strong>Garbage cans:</strong> ${data.garbageCanCount}</p>
    <p><strong>Recycling cans:</strong> ${data.recyclingCanCount}</p>
    <p><strong>Preferred date:</strong> ${data.preferredDate}</p>
    <p><strong>Time window:</strong> ${data.preferredTimeWindow}</p>
    <p><strong>Trash day:</strong> ${data.trashCollectionDay}</p>
    ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
  `;

  await storeBookingSubmission(data, referenceId);
  const emailResult = await sendEmail(
    `New Booking Request — ${referenceId}`,
    html,
    data.email
  );

  return {
    success: true,
    referenceId,
    emailSent: emailResult.sent,
    message: emailResult.sent
      ? "Your booking request has been submitted. We'll confirm your appointment shortly."
      : "Your booking request has been received. We'll be in touch shortly to confirm.",
  };
}

export async function submitContact(data: ContactSchema) {
  const referenceId = generateReferenceId();

  const html = `
    <h2>Contact Form Submission — ${referenceId}</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  `;

  const emailResult = await sendEmail(
    `Contact: ${data.subject}`,
    html,
    data.email
  );

  return {
    success: true,
    referenceId,
    emailSent: emailResult.sent,
    message: emailResult.sent
      ? "Thank you for reaching out. We'll respond as soon as possible."
      : "Your message has been received. We'll respond as soon as possible.",
  };
}

export async function submitQuote(data: QuoteSchema) {
  const referenceId = generateReferenceId();

  const html = `
    <h2>Quote Request — ${referenceId}</h2>
    <p><strong>Customer:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>ZIP:</strong> ${data.zipCode}</p>
    <p><strong>Service:</strong> ${data.serviceType}</p>
    <p><strong>Bin count:</strong> ${data.binCount}</p>
    ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
  `;

  const emailResult = await sendEmail(
    `Quote Request — ${referenceId}`,
    html,
    data.email
  );

  return {
    success: true,
    referenceId,
    emailSent: emailResult.sent,
    message: emailResult.sent
      ? "Your quote request has been submitted. We'll send pricing details soon."
      : "Your quote request has been received. We'll be in touch with pricing details.",
  };
}
