export type BookingServiceType =
  | "one-time"
  | "monthly"
  | "biweekly"
  | "multi-can";

export type TimeWindow = "morning" | "afternoon" | "flexible";

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  serviceType: BookingServiceType;
  garbageCanCount: number;
  recyclingCanCount: number;
  preferredDate: string;
  preferredTimeWindow: TimeWindow;
  trashCollectionDay: string;
  notes: string;
  consent: boolean;
  honeypot: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  honeypot: string;
}

export interface BookingSubmissionResult {
  success: boolean;
  message: string;
  referenceId?: string;
}

export interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  serviceType: BookingServiceType | "commercial" | "unsure";
  binCount: number;
  message: string;
  consent: boolean;
  honeypot: string;
}
