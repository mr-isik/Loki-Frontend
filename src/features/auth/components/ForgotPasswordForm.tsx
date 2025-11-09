"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowRight, ChevronLeft, Mail} from "lucide-react";
import {useForm} from "react-hook-form";

import {DynamicFormField} from "@/components/shared/DynamicFormField";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";

import {forgotPasswordSchema, type ForgotPasswordFormData} from "../utils/validation";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string;
  isEmailSent?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  error,
  isEmailSent = false,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch {
      // Error handling is done by parent component
    }
  };

  if (isEmailSent) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
          <Mail className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold">E-posta Gönderildi!</h3>
          <p className="text-muted-foreground leading-relaxed">
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. E-postanızı kontrol edin ve
            bağlantıya tıklayarak şifrenizi sıfırlayın.
          </p>
        </div>

        <div className="space-y-4">
          <Button className="w-full" type="button" onClick={onBackToLogin}>
            Giriş Sayfasına Dön
          </Button>

          <p className="text-xs text-slate-400">
            E-postayı alamadınız mı? Spam klasörünüzü kontrol edin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button size={"sm"} type="button" variant="outline" onClick={onBackToLogin}>
        <ChevronLeft />
        Giriş Sayfasına Dön
      </Button>

      {/* Form */}
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 backdrop-blur-sm">
              {error}
            </div>
          )}

          <DynamicFormField
            control={form.control}
            disabled={isLoading}
            label="E-posta Adresi"
            name="email"
            placeholder="ornek@email.com"
            type="email"
          />

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
            {!isLoading && <ArrowRight />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
