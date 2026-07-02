import { promises as fs } from "fs";
import path from "path";
import {
  isSupabaseStoreEnabled,
  readStoreFromSupabase,
  writeStoreToSupabase,
} from "./db";
import type { AdminStore, Job, Transaction } from "./types";

function getDataDir(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "jhcleans-admin");
  }
  return path.join(process.cwd(), "data");
}

const DATA_DIR = getDataDir();
const STORE_FILE = path.join(DATA_DIR, "admin-store.json");

const defaultStore: AdminStore = {
  jobs: [],
  transactions: [],
};

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStoreFromFile(): Promise<AdminStore> {
  await ensureStore();
  const raw = await fs.readFile(STORE_FILE, "utf-8");
  return JSON.parse(raw) as AdminStore;
}

async function writeStoreToFile(store: AdminStore): Promise<void> {
  await ensureStore();
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

async function readStore(): Promise<AdminStore> {
  if (isSupabaseStoreEnabled()) {
    return readStoreFromSupabase();
  }
  return readStoreFromFile();
}

async function writeStore(store: AdminStore): Promise<void> {
  if (isSupabaseStoreEnabled()) {
    await writeStoreToSupabase(store);
    return;
  }
  await writeStoreToFile(store);
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getJobs(): Promise<Job[]> {
  const store = await readStore();
  return store.jobs.sort(
    (a, b) =>
      new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime()
  );
}

export async function getJob(id: string): Promise<Job | null> {
  const store = await readStore();
  return store.jobs.find((job) => job.id === id) ?? null;
}

export async function createJob(job: Job): Promise<Job> {
  const store = await readStore();
  store.jobs.push(job);
  await writeStore(store);
  return job;
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  const store = await readStore();
  const index = store.jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  store.jobs[index] = {
    ...store.jobs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.jobs[index];
}

export async function deleteJob(id: string): Promise<boolean> {
  const store = await readStore();
  const initialLength = store.jobs.length;
  store.jobs = store.jobs.filter((job) => job.id !== id);
  store.transactions = store.transactions.map((tx) =>
    tx.jobId === id ? { ...tx, jobId: null } : tx
  );
  await writeStore(store);
  return store.jobs.length < initialLength;
}

export async function getTransactions(): Promise<Transaction[]> {
  const store = await readStore();
  return store.transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function createTransaction(transaction: Transaction): Promise<Transaction> {
  const store = await readStore();
  store.transactions.push(transaction);
  await writeStore(store);
  return transaction;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction | null> {
  const store = await readStore();
  const index = store.transactions.findIndex((tx) => tx.id === id);
  if (index === -1) return null;

  store.transactions[index] = {
    ...store.transactions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.transactions[index];
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const store = await readStore();
  const initialLength = store.transactions.length;
  store.transactions = store.transactions.filter((tx) => tx.id !== id);
  await writeStore(store);
  return store.transactions.length < initialLength;
}

export async function getAdminStore(): Promise<AdminStore> {
  return readStore();
}

export async function seedDemoData(): Promise<void> {
  const store = await readStore();
  if (store.jobs.length > 0) return;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(13, 0, 0, 0);

  const demoJobs: Job[] = [
    {
      id: generateId("job"),
      title: "Smith Residence — Monthly Clean",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      customerPhone: "(555) 123-4567",
      address: "123 Oak Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      serviceType: "monthly",
      garbageCanCount: 2,
      recyclingCanCount: 1,
      status: "scheduled",
      scheduledStart: tomorrow.toISOString(),
      scheduledEnd: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
      timeWindow: "morning",
      revenue: 45,
      notes: "Gate code: 1234. Cans at side of garage.",
      bookingReference: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId("job"),
      title: "Johnson Home — One-Time",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@example.com",
      customerPhone: "(555) 987-6543",
      address: "456 Maple Ave",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      serviceType: "one-time",
      garbageCanCount: 1,
      recyclingCanCount: 0,
      status: "pending",
      scheduledStart: dayAfter.toISOString(),
      scheduledEnd: new Date(dayAfter.getTime() + 45 * 60 * 1000).toISOString(),
      timeWindow: "afternoon",
      revenue: 35,
      notes: "",
      bookingReference: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  const demoTransactions: Transaction[] = [
    {
      id: generateId("tx"),
      type: "expense",
      amount: 89.99,
      category: "supplies",
      description: "Eco-friendly cleaning solution (5 gal)",
      date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      jobId: null,
      vendor: "GreenClean Supply Co.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId("tx"),
      type: "expense",
      amount: 45.0,
      category: "fuel",
      description: "Weekly route fuel",
      date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
      jobId: null,
      vendor: "Shell Gas",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId("tx"),
      type: "revenue",
      amount: 120,
      category: "service",
      description: "Completed jobs — week 1",
      date: new Date(now.getFullYear(), now.getMonth(), 7).toISOString(),
      jobId: null,
      vendor: "",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  await writeStore({
    jobs: demoJobs,
    transactions: demoTransactions,
  });
}
