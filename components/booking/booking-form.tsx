"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingSchema, type BookingSchema } from "@/lib/validations/schemas";
import { submitBookingAction } from "@/app/actions/booking";
import { businessConfig } from "@/lib/config/business";
import { trackConversion } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Your Info" },
  { id: 2, title: "Address" },
  { id: 3, title: "Service" },
  { id: 4, title: "Schedule" },
  { id: 5, title: "Review" },
];

const serviceOptions = [
  { value: "one-time", label: "One-Time Cleaning" },
  { value: "monthly", label: "Monthly Cleaning" },
  { value: "biweekly", label: "Biweekly Cleaning" },
  { value: "multi-can", label: "Multi-Can Plan" },
];

export function BookingForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    referenceId?: string;
  } | null>(null);

  const defaultService =
    planParam &&
    ["one-time", "monthly", "biweekly", "multi-can"].includes(planParam)
      ? (planParam as BookingSchema["serviceType"])
      : "one-time";

  const form = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      serviceType: defaultService,
      garbageCanCount: 1,
      recyclingCanCount: 0,
      preferredDate: "",
      preferredTimeWindow: "flexible",
      trashCollectionDay: "",
      notes: "",
      consent: false,
      honeypot: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = form;

  const values = watch();

  const stepFields: Record<number, (keyof BookingSchema)[]> = {
    1: ["firstName", "lastName", "email", "phone"],
    2: ["streetAddress", "city", "state", "zipCode"],
    3: ["serviceType", "garbageCanCount", "recyclingCanCount"],
    4: ["preferredDate", "preferredTimeWindow", "trashCollectionDay"],
    5: ["consent"],
  };

  const nextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: BookingSchema) => {
    startTransition(async () => {
      const result = await submitBookingAction(data);
      setSubmitResult(result);
      if (result.success) {
        trackConversion("booking");
      }
    });
  };

  if (submitResult?.success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Booking Submitted!</h2>
        {submitResult.referenceId && (
          <p className="mt-2 text-sm text-muted-foreground">
            Reference: {submitResult.referenceId}
          </p>
        )}
        <p className="mt-4 text-muted-foreground">{submitResult.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        {...register("honeypot")}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Progress */}
      <nav aria-label="Booking progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {STEPS.map((s) => (
            <li
              key={s.id}
              className={cn(
                "flex flex-col items-center gap-1 text-xs sm:text-sm",
                step >= s.id ? "text-accent" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  step >= s.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border"
                )}
              >
                {step > s.id ? "✓" : s.id}
              </span>
              <span className="hidden sm:block">{s.title}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="glass rounded-2xl p-6 sm:p-8">
        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-bold text-foreground">
              Customer Information
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} autoComplete="given-name" />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} autoComplete="family-name" />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} autoComplete="email" />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register("phone")} autoComplete="tel" />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-bold text-foreground">
              Service Address
            </legend>
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                {...register("streetAddress")}
                autoComplete="street-address"
              />
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} autoComplete="address-level2" />
                {errors.city && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register("state")}
                  maxLength={2}
                  autoComplete="address-level1"
                  placeholder="TX"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  autoComplete="postal-code"
                  maxLength={10}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-bold text-foreground">
              Service Selection
            </legend>
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Controller
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="garbageCanCount">Garbage Cans</Label>
                <Input
                  id="garbageCanCount"
                  type="number"
                  min={0}
                  max={20}
                  {...register("garbageCanCount", { valueAsNumber: true })}
                />
                {errors.garbageCanCount && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.garbageCanCount.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="recyclingCanCount">Recycling Cans</Label>
                <Input
                  id="recyclingCanCount"
                  type="number"
                  min={0}
                  max={20}
                  {...register("recyclingCanCount", { valueAsNumber: true })}
                />
                {errors.recyclingCanCount && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.recyclingCanCount.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-bold text-foreground">
              Scheduling
            </legend>
            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                type="date"
                {...register("preferredDate")}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="preferredTimeWindow">Preferred Time Window</Label>
              <Controller
                name="preferredTimeWindow"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="preferredTimeWindow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessConfig.booking.timeWindows.map((tw) => (
                        <SelectItem key={tw.value} value={tw.value}>
                          {tw.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="trashCollectionDay">Trash Collection Day</Label>
              <Controller
                name="trashCollectionDay"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="trashCollectionDay">
                      <SelectValue placeholder="Select your trash day" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessConfig.booking.trashDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.trashCollectionDay && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.trashCollectionDay.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="notes">Notes or Gate Instructions (optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Gate code, bin location, special instructions..."
              />
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Review Your Booking</h2>
            <dl className="space-y-3 text-sm">
              <SummaryRow label="Name" value={`${values.firstName} ${values.lastName}`} />
              <SummaryRow label="Email" value={values.email} />
              <SummaryRow label="Phone" value={values.phone} />
              <SummaryRow
                label="Address"
                value={`${values.streetAddress}, ${values.city}, ${values.state} ${values.zipCode}`}
              />
              <SummaryRow label="Service" value={values.serviceType} />
              <SummaryRow
                label="Bins"
                value={`${values.garbageCanCount} garbage, ${values.recyclingCanCount} recycling`}
              />
              <SummaryRow label="Date" value={values.preferredDate} />
              <SummaryRow label="Time" value={values.preferredTimeWindow} />
              <SummaryRow label="Trash Day" value={values.trashCollectionDay} />
              {values.notes && <SummaryRow label="Notes" value={values.notes} />}
            </dl>

            <div className="flex items-start gap-3">
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="consent"
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                I agree to be contacted by {businessConfig.name} regarding my booking
                request. I understand this is a service request, not a confirmed
                appointment until verified.
              </Label>
            </div>
            {errors.consent && (
              <p className="text-sm text-destructive" role="alert">
                {errors.consent.message}
              </p>
            )}

            {submitResult && !submitResult.success && (
              <p className="text-sm text-destructive" role="alert">
                {submitResult.message}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking"
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/30 pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground text-right capitalize">{value}</dd>
    </div>
  );
}
