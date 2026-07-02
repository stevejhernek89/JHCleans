"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatsCards } from "@/components/admin/stats-cards";
import { JobStatusBadge } from "@/components/admin/job-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardDataAction } from "@/app/actions/admin";
import type { Job } from "@/lib/admin/types";
import { useAdminSidebar } from "@/components/admin/admin-shell";

export default function AdminDashboardPage() {
  const { openSidebar } = useAdminSidebar();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboardDataAction>> | null>(null);
  const [, startTransition] = useTransition();

  const loadData = useCallback(() => {
    startTransition(async () => {
      const result = await getDashboardDataAction();
      setData(result);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const upcomingJobs = (data?.jobs ?? [])
    .filter(
      (job) =>
        job.status !== "cancelled" &&
        job.status !== "completed" &&
        new Date(job.scheduledStart) >= new Date()
    )
    .slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of jobs, schedule, and finances."
        onMenuClick={openSidebar}
        action={
          <Button asChild size="sm">
            <Link href="/admin/calendar">
              <CalendarDays className="h-4 w-4" />
              Open Calendar
            </Link>
          </Button>
        }
      />

      <div className="space-y-6 p-4 sm:p-6">
        {data ? (
          <>
            <StatsCards stats={data.stats} />

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Jobs</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/calendar">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingJobs.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No upcoming jobs. Schedule one from the calendar.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {upcomingJobs.map((job: Job) => (
                        <li
                          key={job.id}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(job.scheduledStart).toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <JobStatusBadge status={job.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/finances">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {data.transactions.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No transactions yet.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {data.transactions.slice(0, 5).map((tx) => (
                        <li
                          key={tx.id}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p
                            className={`font-semibold ${
                              tx.type === "revenue" ? "text-primary" : "text-amber-400"
                            }`}
                          >
                            {tx.type === "revenue" ? "+" : "-"}$
                            {tx.amount.toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">Loading dashboard…</p>
        )}
      </div>
    </>
  );
}
