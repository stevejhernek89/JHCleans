"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { GuideLink } from "@/components/admin/admin-guide";
import { AdminHeader } from "@/components/admin/admin-header";
import { FinanceDashboard } from "@/components/admin/finance-dashboard";
import { getFinanceSummaryAction } from "@/app/actions/admin";
import { useAdminSidebar } from "@/components/admin/admin-shell";

export default function AdminFinancesPage() {
  const { openSidebar } = useAdminSidebar();
  const [data, setData] = useState<Awaited<ReturnType<typeof getFinanceSummaryAction>> | null>(
    null
  );
  const [, startTransition] = useTransition();

  const loadData = useCallback(() => {
    startTransition(async () => {
      const result = await getFinanceSummaryAction();
      setData(result);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <AdminHeader
        title="Finances"
        description="Track revenue, supply costs, and profitability."
        onMenuClick={openSidebar}
        action={<GuideLink sectionId="finances" />}
      />
      <div className="p-4 sm:p-6">
        {data ? (
          <FinanceDashboard
            months={data.months}
            expensesByCategory={data.expensesByCategory}
            transactions={data.transactions}
            onRefresh={loadData}
          />
        ) : (
          <p className="text-center text-muted-foreground">Loading finances…</p>
        )}
      </div>
    </>
  );
}
