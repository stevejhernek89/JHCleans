"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { GuideLink } from "@/components/admin/admin-guide";
import { AdminHeader } from "@/components/admin/admin-header";
import { JobCalendar } from "@/components/admin/job-calendar";
import { getJobsAction } from "@/app/actions/admin";
import type { Job } from "@/lib/admin/types";
import { useAdminSidebar } from "@/components/admin/admin-shell";

export default function AdminCalendarPage() {
  const { openSidebar } = useAdminSidebar();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [, startTransition] = useTransition();

  const loadJobs = useCallback(() => {
    startTransition(async () => {
      const result = await getJobsAction();
      setJobs(result);
    });
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <>
      <AdminHeader
        title="Job Calendar"
        description="Schedule, reschedule, and manage cleaning jobs. Drag events to move them."
        onMenuClick={openSidebar}
        action={<GuideLink sectionId="calendar" />}
      />
      <div className="p-4 sm:p-6">
        <JobCalendar jobs={jobs} onRefresh={loadJobs} />
      </div>
    </>
  );
}
