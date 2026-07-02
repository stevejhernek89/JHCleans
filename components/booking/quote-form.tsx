"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
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
import { quoteSchema, type QuoteSchema } from "@/lib/validations/schemas";
import { submitQuoteAction } from "@/app/actions/contact";
import { businessConfig } from "@/lib/config/business";
import { trackConversion } from "@/lib/analytics/track";

export function QuoteForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    referenceId?: string;
  } | null>(null);

  const form = useForm<QuoteSchema>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      serviceType: "unsure",
      binCount: 1,
      message: "",
      consent: false,
      honeypot: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: QuoteSchema) => {
    startTransition(async () => {
      const res = await submitQuoteAction(data);
      setResult(res);
      if (res.success) trackConversion("quote");
    });
  };

  if (result?.success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
        {result.referenceId && (
          <p className="text-sm text-muted-foreground mb-2">
            Reference: {result.referenceId}
          </p>
        )}
        <p className="text-foreground font-semibold">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 sm:p-8 space-y-4" noValidate>
      <input
        type="text"
        {...register("honeypot")}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="quote-firstName">First Name</Label>
          <Input id="quote-firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="quote-lastName">Last Name</Label>
          <Input id="quote-lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="quote-email">Email</Label>
          <Input id="quote-email" type="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="quote-phone">Phone</Label>
          <Input id="quote-phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="quote-zip">ZIP Code</Label>
          <Input id="quote-zip" {...register("zipCode")} maxLength={5} />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.zipCode.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="quote-bins">Number of Bins</Label>
          <Input id="quote-bins" type="number" min={1} max={20} {...register("binCount", { valueAsNumber: true })} />
        </div>
      </div>

      <div>
        <Label htmlFor="quote-service">Service Type</Label>
        <Controller
          name="serviceType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="quote-service">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-Time Cleaning</SelectItem>
                <SelectItem value="monthly">Monthly Cleaning</SelectItem>
                <SelectItem value="biweekly">Biweekly Cleaning</SelectItem>
                <SelectItem value="multi-can">Multi-Can Plan</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="unsure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="quote-message">Additional Details (optional)</Label>
        <Textarea id="quote-message" {...register("message")} />
      </div>

      <div className="flex items-start gap-3">
        <Controller
          name="consent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="quote-consent"
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor="quote-consent" className="text-sm text-muted-foreground leading-relaxed">
          I agree to be contacted by {businessConfig.name} with pricing information.
        </Label>
      </div>
      {errors.consent && (
        <p className="text-sm text-destructive" role="alert">{errors.consent.message}</p>
      )}

      {result && !result.success && (
        <p className="text-sm text-destructive" role="alert">{result.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Quote"
        )}
      </Button>
    </form>
  );
}
