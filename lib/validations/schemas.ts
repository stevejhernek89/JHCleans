import { z } from "zod";

const phoneRegex = /^[\d\s().+-]{10,}$/;

export const bookingSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(phoneRegex, "Please enter a valid phone number"),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(100, "Address is too long"),
  city: z.string().min(1, "City is required").max(50, "City is too long"),
  state: z
    .string()
    .min(2, "State is required")
    .max(2, "Use 2-letter state code")
    .transform((v) => v.toUpperCase()),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  serviceType: z.enum(["one-time", "monthly", "biweekly", "multi-can"]),
  garbageCanCount: z
    .number({ error: "Must be a number" })
    .int()
    .min(0, "Must be 0 or more")
    .max(20, "Maximum 20 bins"),
  recyclingCanCount: z
    .number({ error: "Must be a number" })
    .int()
    .min(0, "Must be 0 or more")
    .max(20, "Maximum 20 bins"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTimeWindow: z.enum(["morning", "afternoon", "flexible"]),
  trashCollectionDay: z.string().min(1, "Please select your trash day"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy to continue",
  }),
  honeypot: z.string().max(0, "Invalid submission"),
}).refine(
  (data) => data.garbageCanCount + data.recyclingCanCount >= 1,
  {
    message: "Please specify at least one bin to clean",
    path: ["garbageCanCount"],
  }
);

export type BookingSchema = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z
    .string()
    .min(10, "Please provide more detail")
    .max(1000, "Message is too long"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy to continue",
  }),
  honeypot: z.string().max(0, "Invalid submission"),
});

export type ContactSchema = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP"),
  serviceType: z.enum([
    "one-time",
    "monthly",
    "biweekly",
    "multi-can",
    "commercial",
    "unsure",
  ]),
  binCount: z.number().int().min(1).max(20),
  message: z.string().max(500).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy to continue",
  }),
  honeypot: z.string().max(0, "Invalid submission"),
});

export type QuoteSchema = z.infer<typeof quoteSchema>;
