export type JobStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ServiceType = "one-time" | "monthly" | "biweekly" | "multi-can";

export type TimeWindow = "morning" | "afternoon" | "flexible";

export interface Job {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceType: ServiceType;
  garbageCanCount: number;
  recyclingCanCount: number;
  status: JobStatus;
  scheduledStart: string;
  scheduledEnd: string;
  timeWindow: TimeWindow;
  revenue: number;
  notes: string;
  bookingReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "revenue" | "expense";

export type ExpenseCategory =
  | "supplies"
  | "equipment"
  | "fuel"
  | "marketing"
  | "insurance"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory | "service";
  description: string;
  date: string;
  jobId: string | null;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStore {
  jobs: Job[];
  transactions: Transaction[];
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  pending: "#f59e0b",
  scheduled: "#00d2ff",
  in_progress: "#a78bfa",
  completed: "#4ade80",
  cancelled: "#64748b",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  supplies: "Cleaning Supplies",
  equipment: "Equipment",
  fuel: "Fuel & Transport",
  marketing: "Marketing",
  insurance: "Insurance",
  other: "Other",
};
