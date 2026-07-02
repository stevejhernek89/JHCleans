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
import { contactSchema, type ContactSchema } from "@/lib/validations/schemas";
import { submitContactAction } from "@/app/actions/contact";
import { useSiteContent } from "@/lib/content/site-content-context";
import { trackConversion } from "@/lib/analytics/track";

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = "general" }: ContactFormProps) {
  const { business } = useSiteContent();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: defaultSubject,
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

  const onSubmit = (data: ContactSchema) => {
    startTransition(async () => {
      const res = await submitContactAction(data);
      setResult(res);
      if (res.success) trackConversion("contact");
    });
  };

  if (result?.success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
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

      <div>
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" {...register("name")} autoComplete="name" />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...register("email")} autoComplete="email" />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive" role="alert">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input id="contact-phone" type="tel" {...register("phone")} autoComplete="tel" />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" {...register("subject")} />
        {errors.subject && (
          <p className="mt-1 text-sm text-destructive" role="alert">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" {...register("message")} rows={5} />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive" role="alert">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Controller
          name="consent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="contact-consent"
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor="contact-consent" className="text-sm text-muted-foreground leading-relaxed">
          I agree to be contacted by {business.name} regarding my inquiry.
        </Label>
      </div>
      {errors.consent && (
        <p className="text-sm text-destructive" role="alert">{errors.consent.message}</p>
      )}

      {result && !result.success && (
        <p className="text-sm text-destructive" role="alert">{result.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
