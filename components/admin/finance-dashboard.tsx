"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteTransactionAction,
  saveTransactionAction,
} from "@/app/actions/admin";
import { getFieldHelp } from "@/lib/admin/field-help";
import { FieldHelpText } from "@/components/admin/field-help-text";
import type { Transaction } from "@/lib/admin/types";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/admin/types";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/lib/validations/admin-schemas";

interface FinanceDashboardProps {
  months: { month: string; revenue: number; expenses: number; profit: number }[];
  expensesByCategory: Record<string, number>;
  transactions: Transaction[];
  onRefresh: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function toLocalDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function FinanceDashboard({
  months,
  expensesByCategory,
  transactions,
  onRefresh,
}: FinanceDashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalRevenue = transactions
    .filter((tx) => tx.type === "revenue")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category:
      category in EXPENSE_CATEGORY_LABELS
        ? EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS]
        : category,
    amount,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p
              className={`text-2xl font-bold ${
                totalRevenue - totalExpenses >= 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {formatCurrency(totalRevenue - totalExpenses)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses (6 months)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "#0c1529",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#00d2ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="category" stroke="#94a3b8" fontSize={11} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: "#0c1529",
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="amount" fill="#00d2ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No expenses recorded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setEditingTx(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Description</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No transactions yet. Add your first supply cost or revenue entry.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">
                        <p>{tx.description}</p>
                        {tx.vendor && (
                          <p className="text-xs text-muted-foreground">{tx.vendor}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4 capitalize">
                        {tx.category === "service"
                          ? "Service Revenue"
                          : EXPENSE_CATEGORY_LABELS[
                              tx.category as keyof typeof EXPENSE_CATEGORY_LABELS
                            ] ?? tx.category}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={tx.type === "revenue" ? "success" : "warning"}>
                          {tx.type}
                        </Badge>
                      </td>
                      <td
                        className={`py-3 pr-4 text-right font-medium ${
                          tx.type === "revenue" ? "text-primary" : "text-amber-400"
                        }`}
                      >
                        {tx.type === "revenue" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingTx(tx);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={isPending}
                            onClick={() => {
                              if (!confirm("Delete this transaction?")) return;
                              startTransition(async () => {
                                await deleteTransactionAction(tx.id);
                                onRefresh();
                              });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTx}
        onSaved={() => {
          onRefresh();
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

function TxFieldHelp({ helpKey }: { helpKey: string }) {
  const help = getFieldHelp(helpKey);
  if (!help) return null;
  return <FieldHelpText help={help} />;
}

function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      category: "supplies",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      vendor: "",
    },
  });

  const type = watch("type");
  const category = watch("category");

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: toLocalDate(transaction.date),
        vendor: transaction.vendor,
      });
    } else {
      reset({
        type: "expense",
        amount: 0,
        category: "supplies",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        vendor: "",
      });
    }
  }, [open, transaction, reset]);

  function onSubmit(data: TransactionFormData) {
    startTransition(async () => {
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        category: data.type === "revenue" ? ("service" as const) : data.category,
      };

      const result = await saveTransactionAction(payload, transaction?.id);
      if (result.success) onSaved();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setValue("type", v as "revenue" | "expense");
                  if (v === "revenue") setValue("category", "service");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <TxFieldHelp helpKey="transaction.type" />
            </div>

            {type === "expense" && (
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) =>
                    setValue("category", v as TransactionFormData["category"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TxFieldHelp helpKey="transaction.category" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min={0.01}
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              <TxFieldHelp helpKey="transaction.amount" />
              {errors.amount && (
                <p className="text-xs text-destructive" role="alert">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              <TxFieldHelp helpKey="transaction.date" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
              <TxFieldHelp helpKey="transaction.description" />
              {errors.description && (
                <p className="text-xs text-destructive" role="alert">{errors.description.message}</p>
              )}
            </div>

            {type === "expense" && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="vendor">Vendor (optional)</Label>
                <Input id="vendor" placeholder="Supplier name" {...register("vendor")} />
                <TxFieldHelp helpKey="transaction.vendor" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : transaction ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
