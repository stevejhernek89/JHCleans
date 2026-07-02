import { z } from "zod";

export const jobStatusSchema = z.enum([
  "pending",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const serviceTypeSchema = z.enum([
  "one-time",
  "monthly",
  "biweekly",
  "multi-can",
]);

export const timeWindowSchema = z.enum(["morning", "afternoon", "flexible"]);

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  customerName: z.string().min(1, "Customer name is required").max(100),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "Valid phone required"),
  address: z.string().min(1, "Address is required").max(100),
  city: z.string().min(1, "City is required").max(50),
  state: z.string().length(2, "Use 2-letter state code"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP required"),
  serviceType: serviceTypeSchema,
  garbageCanCount: z.number().int().min(0).max(20),
  recyclingCanCount: z.number().int().min(0).max(20),
  status: jobStatusSchema,
  scheduledStart: z.string().min(1, "Start time is required"),
  scheduledEnd: z.string().min(1, "End time is required"),
  timeWindow: timeWindowSchema,
  revenue: z.number().min(0, "Revenue must be 0 or more"),
  notes: z.string().max(500).optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;

export const expenseCategorySchema = z.enum([
  "supplies",
  "equipment",
  "fuel",
  "marketing",
  "insurance",
  "other",
]);

export const transactionSchema = z.object({
  type: z.enum(["revenue", "expense"]),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.union([expenseCategorySchema, z.literal("service")]),
  description: z.string().min(1, "Description is required").max(200),
  date: z.string().min(1, "Date is required"),
  jobId: z.string().nullable().optional(),
  vendor: z.string().max(100).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
