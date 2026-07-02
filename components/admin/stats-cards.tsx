import {
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    monthRevenue: number;
    monthExpenses: number;
    monthProfit: number;
    upcomingCount: number;
    todayCount: number;
    pendingRequestsCount: number;
    completedJobs: number;
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Revenue (This Month)",
      value: formatCurrency(stats.monthRevenue),
      icon: DollarSign,
      accent: "text-primary",
    },
    {
      label: "Expenses (This Month)",
      value: formatCurrency(stats.monthExpenses),
      icon: TrendingUp,
      accent: "text-amber-400",
    },
    {
      label: "Net Profit",
      value: formatCurrency(stats.monthProfit),
      icon: TrendingUp,
      accent: stats.monthProfit >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequestsCount.toString(),
      icon: Inbox,
      accent: "text-amber-400",
    },
    {
      label: "Jobs Today",
      value: stats.todayCount.toString(),
      icon: CalendarCheck,
      accent: "text-accent",
    },
    {
      label: "Upcoming Jobs",
      value: stats.upcomingCount.toString(),
      icon: CalendarClock,
      accent: "text-accent",
    },
    {
      label: "Completed Jobs",
      value: stats.completedJobs.toString(),
      icon: CalendarCheck,
      accent: "text-primary",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl bg-white/5 p-3 ${accent}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
