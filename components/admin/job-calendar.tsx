"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg, EventDropArg, DateSelectArg } from "@fullcalendar/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  rescheduleJobAction,
  updateJobStatusAction,
} from "@/app/actions/admin";
import type { Job, JobStatus } from "@/lib/admin/types";
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from "@/lib/admin/types";
import { JobFormDialog } from "./job-form-dialog";

interface JobCalendarProps {
  jobs: Job[];
  onRefresh: () => void;
}

export function JobCalendar({ jobs, onRefresh }: JobCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<Partial<Job> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  const filteredJobs =
    statusFilter === "all"
      ? jobs
      : jobs.filter((job) => job.status === statusFilter);

  const events = filteredJobs.map((job) => ({
    id: job.id,
    title: job.title,
    start: job.scheduledStart,
    end: job.scheduledEnd,
    backgroundColor: JOB_STATUS_COLORS[job.status],
    borderColor: JOB_STATUS_COLORS[job.status],
    extendedProps: { job },
  }));

  function handleDateSelect(selectInfo: DateSelectArg) {
    setCreateDefaults({
      scheduledStart: selectInfo.startStr,
      scheduledEnd: selectInfo.endStr,
      status: "scheduled",
    });
    setSelectedJob(null);
    setDialogOpen(true);
    selectInfo.view.calendar.unselect();
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const job = clickInfo.event.extendedProps.job as Job;
    setSelectedJob(job);
    setCreateDefaults(null);
    setDialogOpen(true);
  }

  function handleEventDrop(dropInfo: EventDropArg) {
    const job = dropInfo.event.extendedProps.job as Job;
    if (!dropInfo.event.start) return;

    const start = dropInfo.event.start.toISOString();
    const end =
      dropInfo.event.end?.toISOString() ??
      new Date(dropInfo.event.start.getTime() + 60 * 60 * 1000).toISOString();

    startTransition(async () => {
      await rescheduleJobAction(job.id, start, end);
      onRefresh();
    });
  }

  function handleStatusChange(status: JobStatus) {
    if (!selectedJob) return;
    startTransition(async () => {
      await updateJobStatusAction(selectedJob.id, status);
      onRefresh();
      setDialogOpen(false);
    });
  }

  useEffect(() => {
    const handleResize = () => {
      calendarRef.current?.getApi().updateSize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {JOB_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => {
            setSelectedJob(null);
            setCreateDefaults({ status: "scheduled" });
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Job
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: JOB_STATUS_COLORS[status] }}
            />
            {JOB_STATUS_LABELS[status]}
          </div>
        ))}
      </div>

      <div className="admin-calendar glass overflow-hidden rounded-2xl p-2 sm:p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          editable
          selectable
          selectMirror
          dayMaxEvents
          nowIndicator
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="auto"
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventDurationEditable
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: "08:00",
            endTime: "17:00",
          }}
        />
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground" role="status">
          Updating schedule…
        </p>
      )}

      <JobFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        job={selectedJob}
        defaults={createDefaults}
        onSaved={() => {
          onRefresh();
          setDialogOpen(false);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const variantMap: Record<JobStatus, "warning" | "accent" | "default" | "success" | "outline"> = {
    pending: "warning",
    scheduled: "accent",
    in_progress: "default",
    completed: "success",
    cancelled: "outline",
  };

  return <Badge variant={variantMap[status]}>{JOB_STATUS_LABELS[status]}</Badge>;
}
