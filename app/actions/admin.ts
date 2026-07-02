"use server";

import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/admin/auth";
import {
  createJob,
  createTransaction,
  deleteJob,
  deleteTransaction,
  generateId,
  getAdminStore,
  getJobs,
  getTransactions,
  seedDemoData,
  updateJob,
  updateTransaction,
} from "@/lib/admin/store";
import type { Job, JobStatus, Transaction } from "@/lib/admin/types";
import {
  jobSchema,
  loginSchema,
  transactionSchema,
} from "@/lib/validations/admin-schemas";
import type { BookingSchema, ContactSchema, QuoteSchema } from "@/lib/validations/schemas";

async function requireAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}

function timeWindowToHours(window: string): { start: number; end: number } {
  switch (window) {
    case "morning":
      return { start: 8, end: 12 };
    case "afternoon":
      return { start: 12, end: 16 };
    default:
      return { start: 9, end: 17 };
  }
}

function mapQuoteServiceType(type: QuoteSchema["serviceType"]): Job["serviceType"] {
  switch (type) {
    case "commercial":
    case "multi-can":
      return "multi-can";
    case "monthly":
      return "monthly";
    case "biweekly":
      return "biweekly";
    default:
      return "one-time";
  }
}

function buildBookingNotes(booking: BookingSchema): string {
  const parts = [`Trash day: ${booking.trashCollectionDay}`];
  if (booking.notes?.trim()) {
    parts.push(booking.notes.trim());
  }
  return parts.join("\n\n");
}

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "Password is required." };
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return { success: false, message: "Invalid password." };
  }

  await createAdminSession();
  return { success: true, message: "Welcome back!" };
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function getDashboardDataAction() {
  await requireAuth();
  await seedDemoData();

  const [jobs, transactions] = await Promise.all([getJobs(), getTransactions()]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const monthRevenue = transactions
    .filter(
      (tx) =>
        tx.type === "revenue" &&
        new Date(tx.date) >= startOfMonth &&
        new Date(tx.date) <= endOfMonth
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthExpenses = transactions
    .filter(
      (tx) =>
        tx.type === "expense" &&
        new Date(tx.date) >= startOfMonth &&
        new Date(tx.date) <= endOfMonth
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const upcomingJobs = jobs.filter(
    (job) =>
      job.status !== "cancelled" &&
      job.status !== "completed" &&
      new Date(job.scheduledStart) >= now
  );

  const todayJobs = jobs.filter((job) => {
    const jobDate = new Date(job.scheduledStart);
    return (
      jobDate.getFullYear() === now.getFullYear() &&
      jobDate.getMonth() === now.getMonth() &&
      jobDate.getDate() === now.getDate() &&
      job.status !== "cancelled"
    );
  });

  const pendingRequests = jobs
    .filter((job) => job.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return {
    jobs,
    transactions,
    pendingRequests,
    stats: {
      monthRevenue,
      monthExpenses,
      monthProfit: monthRevenue - monthExpenses,
      upcomingCount: upcomingJobs.length,
      todayCount: todayJobs.length,
      pendingRequestsCount: pendingRequests.length,
      totalJobs: jobs.length,
      completedJobs: jobs.filter((j) => j.status === "completed").length,
    },
  };
}

export async function getJobsAction() {
  await requireAuth();
  await seedDemoData();
  return getJobs();
}

export async function saveJobAction(formData: unknown, jobId?: string) {
  await requireAuth();

  const parsed = jobSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form for errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  if (jobId) {
    const updated = await updateJob(jobId, {
      ...data,
      state: data.state.toUpperCase(),
      notes: data.notes ?? "",
    });
    if (!updated) {
      return { success: false, message: "Job not found." };
    }
    return { success: true, message: "Job updated.", job: updated };
  }

  const job: Job = {
    id: generateId("job"),
    ...data,
    state: data.state.toUpperCase(),
    notes: data.notes ?? "",
    bookingReference: null,
    createdAt: now,
    updatedAt: now,
  };

  await createJob(job);
  return { success: true, message: "Job scheduled.", job };
}

export async function rescheduleJobAction(
  jobId: string,
  scheduledStart: string,
  scheduledEnd: string
) {
  await requireAuth();

  const updated = await updateJob(jobId, {
    scheduledStart,
    scheduledEnd,
    status: "scheduled" as JobStatus,
  });

  if (!updated) {
    return { success: false, message: "Job not found." };
  }

  return { success: true, message: "Job rescheduled.", job: updated };
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  await requireAuth();

  const updated = await updateJob(jobId, { status });
  if (!updated) {
    return { success: false, message: "Job not found." };
  }

  if (status === "completed" && updated.revenue > 0) {
    const transactions = await getTransactions();
    const existing = transactions.find(
      (tx) => tx.jobId === jobId && tx.type === "revenue"
    );

    if (!existing) {
      const now = new Date().toISOString();
      await createTransaction({
        id: generateId("tx"),
        type: "revenue",
        amount: updated.revenue,
        category: "service",
        description: `Service completed — ${updated.customerName}`,
        date: now,
        jobId: updated.id,
        vendor: "",
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return { success: true, message: "Status updated.", job: updated };
}

export async function deleteJobAction(jobId: string) {
  await requireAuth();
  const deleted = await deleteJob(jobId);
  if (!deleted) {
    return { success: false, message: "Job not found." };
  }
  return { success: true, message: "Job deleted." };
}

export async function getTransactionsAction() {
  await requireAuth();
  await seedDemoData();
  return getTransactions();
}

export async function saveTransactionAction(
  formData: unknown,
  transactionId?: string
) {
  await requireAuth();

  const parsed = transactionSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form for errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  if (transactionId) {
    const updated = await updateTransaction(transactionId, {
      ...data,
      jobId: data.jobId ?? null,
      vendor: data.vendor ?? "",
    });
    if (!updated) {
      return { success: false, message: "Transaction not found." };
    }
    return { success: true, message: "Transaction updated.", transaction: updated };
  }

  const transaction: Transaction = {
    id: generateId("tx"),
    ...data,
    jobId: data.jobId ?? null,
    vendor: data.vendor ?? "",
    createdAt: now,
    updatedAt: now,
  };

  await createTransaction(transaction);
  return { success: true, message: "Transaction recorded.", transaction };
}

export async function deleteTransactionAction(transactionId: string) {
  await requireAuth();
  const deleted = await deleteTransaction(transactionId);
  if (!deleted) {
    return { success: false, message: "Transaction not found." };
  }
  return { success: true, message: "Transaction deleted." };
}

export async function createJobFromBooking(
  booking: BookingSchema,
  referenceId: string
): Promise<Job> {
  const { start, end } = timeWindowToHours(booking.preferredTimeWindow);
  const preferredDate = new Date(booking.preferredDate);
  preferredDate.setHours(start, 0, 0, 0);
  const endDate = new Date(booking.preferredDate);
  endDate.setHours(end, 0, 0, 0);

  const now = new Date().toISOString();
  const job: Job = {
    id: generateId("job"),
    title: `${booking.lastName} — ${booking.serviceType.replace("-", " ")}`,
    customerName: `${booking.firstName} ${booking.lastName}`,
    customerEmail: booking.email,
    customerPhone: booking.phone,
    address: booking.streetAddress,
    city: booking.city,
    state: booking.state,
    zipCode: booking.zipCode,
    serviceType: booking.serviceType,
    garbageCanCount: booking.garbageCanCount,
    recyclingCanCount: booking.recyclingCanCount,
    status: "pending",
    scheduledStart: preferredDate.toISOString(),
    scheduledEnd: endDate.toISOString(),
    timeWindow: booking.preferredTimeWindow,
    revenue: 0,
    notes: buildBookingNotes(booking),
    bookingReference: referenceId,
    createdAt: now,
    updatedAt: now,
  };

  await createJob(job);
  return job;
}

export async function createJobFromQuote(
  quote: QuoteSchema,
  referenceId: string
): Promise<Job> {
  const scheduledStart = new Date();
  scheduledStart.setDate(scheduledStart.getDate() + 7);
  scheduledStart.setHours(9, 0, 0, 0);
  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setHours(10, 0, 0, 0);

  const notes = [
    "Quote request — schedule to be confirmed.",
    quote.message?.trim() ? quote.message.trim() : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const now = new Date().toISOString();
  const job: Job = {
    id: generateId("job"),
    title: `${quote.lastName} — Quote Request`,
    customerName: `${quote.firstName} ${quote.lastName}`,
    customerEmail: quote.email,
    customerPhone: quote.phone,
    address: "Address pending",
    city: "TBD",
    state: "TBD",
    zipCode: quote.zipCode,
    serviceType: mapQuoteServiceType(quote.serviceType),
    garbageCanCount: quote.binCount,
    recyclingCanCount: 0,
    status: "pending",
    scheduledStart: scheduledStart.toISOString(),
    scheduledEnd: scheduledEnd.toISOString(),
    timeWindow: "flexible",
    revenue: 0,
    notes,
    bookingReference: referenceId,
    createdAt: now,
    updatedAt: now,
  };

  await createJob(job);
  return job;
}

export async function createJobFromContact(
  contact: ContactSchema,
  referenceId: string
): Promise<Job> {
  const scheduledStart = new Date();
  scheduledStart.setDate(scheduledStart.getDate() + 7);
  scheduledStart.setHours(9, 0, 0, 0);
  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setHours(10, 0, 0, 0);

  const notes = [
    `Subject: ${contact.subject}`,
    contact.message.trim(),
    contact.phone ? `Phone: ${contact.phone}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const now = new Date().toISOString();
  const job: Job = {
    id: generateId("job"),
    title: `${contact.name} — Contact Request`,
    customerName: contact.name,
    customerEmail: contact.email,
    customerPhone: contact.phone ?? "",
    address: "Address pending",
    city: "TBD",
    state: "TBD",
    zipCode: "00000",
    serviceType: "one-time",
    garbageCanCount: 1,
    recyclingCanCount: 0,
    status: "pending",
    scheduledStart: scheduledStart.toISOString(),
    scheduledEnd: scheduledEnd.toISOString(),
    timeWindow: "flexible",
    revenue: 0,
    notes,
    bookingReference: referenceId,
    createdAt: now,
    updatedAt: now,
  };

  await createJob(job);
  return job;
}

export async function getFinanceSummaryAction() {
  await requireAuth();
  const store = await getAdminStore();

  const now = new Date();
  const months: { month: string; revenue: number; expenses: number; profit: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const monthLabel = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const revenue = store.transactions
      .filter(
        (tx) =>
          tx.type === "revenue" &&
          new Date(tx.date) >= monthStart &&
          new Date(tx.date) <= monthEnd
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = store.transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          new Date(tx.date) >= monthStart &&
          new Date(tx.date) <= monthEnd
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    months.push({
      month: monthLabel,
      revenue,
      expenses,
      profit: revenue - expenses,
    });
  }

  const expensesByCategory = store.transactions
    .filter((tx) => tx.type === "expense")
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
      return acc;
    }, {});

  return {
    months,
    expensesByCategory,
    transactions: store.transactions,
    jobs: store.jobs,
  };
}
