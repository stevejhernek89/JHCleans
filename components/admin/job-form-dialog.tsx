"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteJobAction, saveJobAction } from "@/app/actions/admin";
import type { Job, JobStatus } from "@/lib/admin/types";
import { getFieldHelp } from "@/lib/admin/field-help";
import { FieldHelpText } from "@/components/admin/field-help-text";
import { JOB_STATUS_LABELS } from "@/lib/admin/types";
import { jobSchema, type JobFormData } from "@/lib/validations/admin-schemas";
import { businessConfig } from "@/lib/config/business";
import { JobStatusBadge } from "./job-calendar";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  defaults?: Partial<Job> | null;
  onSaved: () => void;
  onStatusChange?: (status: JobStatus) => void;
}

function toLocalDatetime(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function JobFieldHelp({ helpKey }: { helpKey: string }) {
  const help = getFieldHelp(helpKey);
  if (!help) return null;
  return <FieldHelpText help={help} />;
}

export function JobFormDialog({
  open,
  onOpenChange,
  job,
  defaults,
  onSaved,
  onStatusChange,
}: JobFormDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      serviceType: "one-time",
      garbageCanCount: 1,
      recyclingCanCount: 0,
      status: "scheduled",
      scheduledStart: "",
      scheduledEnd: "",
      timeWindow: "morning",
      revenue: 0,
      notes: "",
    },
  });

  const status = watch("status");
  const serviceType = watch("serviceType");
  const timeWindow = watch("timeWindow");

  useEffect(() => {
    if (!open) return;

    if (job) {
      reset({
        title: job.title,
        customerName: job.customerName,
        customerEmail: job.customerEmail,
        customerPhone: job.customerPhone,
        address: job.address,
        city: job.city,
        state: job.state,
        zipCode: job.zipCode,
        serviceType: job.serviceType,
        garbageCanCount: job.garbageCanCount,
        recyclingCanCount: job.recyclingCanCount,
        status: job.status,
        scheduledStart: toLocalDatetime(job.scheduledStart),
        scheduledEnd: toLocalDatetime(job.scheduledEnd),
        timeWindow: job.timeWindow,
        revenue: job.revenue,
        notes: job.notes,
      });
    } else {
      const start = defaults?.scheduledStart
        ? toLocalDatetime(defaults.scheduledStart)
        : "";
      const end = defaults?.scheduledEnd
        ? toLocalDatetime(defaults.scheduledEnd)
        : "";

      reset({
        title: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        serviceType: "one-time",
        garbageCanCount: 1,
        recyclingCanCount: 0,
        status: defaults?.status ?? "scheduled",
        scheduledStart: start,
        scheduledEnd: end,
        timeWindow: "morning",
        revenue: 0,
        notes: "",
      });
    }
  }, [open, job, defaults, reset]);

  function onSubmit(data: JobFormData) {
    startTransition(async () => {
      const payload = {
        ...data,
        scheduledStart: new Date(data.scheduledStart).toISOString(),
        scheduledEnd: new Date(data.scheduledEnd).toISOString(),
      };

      const result = await saveJobAction(payload, job?.id);
      if (result.success) {
        onSaved();
      }
    });
  }

  function handleDelete() {
    if (!job) return;
    if (!confirm("Delete this job? This cannot be undone.")) return;

    startTransition(async () => {
      await deleteJobAction(job.id);
      onSaved();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {job ? "Edit Job" : "Schedule New Job"}
            {job && <JobStatusBadge status={job.status} />}
          </DialogTitle>
          <DialogDescription>
            {job
              ? "Update job details, reschedule, or change status."
              : "Add a new cleaning job to the calendar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="Smith Residence — Monthly" {...register("title")} />
              <JobFieldHelp helpKey="job.title" />
              {errors.title && (
                <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" {...register("customerName")} />
              <JobFieldHelp helpKey="job.customerName" />
              {errors.customerName && (
                <p className="text-xs text-destructive" role="alert">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input id="customerPhone" type="tel" {...register("customerPhone")} />
              <JobFieldHelp helpKey="job.customerPhone" />
              {errors.customerPhone && (
                <p className="text-xs text-destructive" role="alert">{errors.customerPhone.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" type="email" {...register("customerEmail")} />
              <JobFieldHelp helpKey="job.customerEmail" />
              {errors.customerEmail && (
                <p className="text-xs text-destructive" role="alert">{errors.customerEmail.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" {...register("address")} />
              <JobFieldHelp helpKey="job.address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              <JobFieldHelp helpKey="job.city" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" maxLength={2} {...register("state")} />
              <JobFieldHelp helpKey="job.state" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" {...register("zipCode")} />
              <JobFieldHelp helpKey="job.zipCode" />
            </div>

            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={serviceType}
                onValueChange={(v) =>
                  setValue("serviceType", v as JobFormData["serviceType"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-Time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="multi-can">Multi-Can</SelectItem>
                </SelectContent>
              </Select>
              <JobFieldHelp helpKey="job.serviceType" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="garbageCanCount">Garbage Cans</Label>
              <Input
                id="garbageCanCount"
                type="number"
                min={0}
                {...register("garbageCanCount", { valueAsNumber: true })}
              />
              <JobFieldHelp helpKey="job.garbageCanCount" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recyclingCanCount">Recycling Cans</Label>
              <Input
                id="recyclingCanCount"
                type="number"
                min={0}
                {...register("recyclingCanCount", { valueAsNumber: true })}
              />
              <JobFieldHelp helpKey="job.recyclingCanCount" />
            </div>

            <div className="space-y-2">
              <Label>Time Window</Label>
              <Select
                value={timeWindow}
                onValueChange={(v) =>
                  setValue("timeWindow", v as JobFormData["timeWindow"])
                }
              >
                <SelectTrigger>
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
              <JobFieldHelp helpKey="job.timeWindow" />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setValue("status", v as JobStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {JOB_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <JobFieldHelp helpKey="job.status" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledStart">Start</Label>
              <Input
                id="scheduledStart"
                type="datetime-local"
                {...register("scheduledStart")}
              />
              <JobFieldHelp helpKey="job.scheduledStart" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledEnd">End</Label>
              <Input
                id="scheduledEnd"
                type="datetime-local"
                {...register("scheduledEnd")}
              />
              <JobFieldHelp helpKey="job.scheduledEnd" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                min={0}
                step="0.01"
                {...register("revenue", { valueAsNumber: true })}
              />
              <JobFieldHelp helpKey="job.revenue" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
              <JobFieldHelp helpKey="job.notes" />
            </div>
          </div>

          {job?.bookingReference && (
            <p className="text-xs text-muted-foreground">
              Booking ref: {job.bookingReference}
            </p>
          )}

          {job && onStatusChange && (
            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <p className="w-full text-xs font-medium text-muted-foreground">
                Quick status
              </p>
              {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={job.status === s ? "default" : "outline"}
                  disabled={isPending}
                  onClick={() => onStatusChange(s)}
                >
                  {JOB_STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            {job ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : job ? "Save Changes" : "Schedule Job"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
