"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowRight, CheckCircle} from "lucide-react";
import {useForm} from "react-hook-form";

import DynamicFormField from "@/components/shared/DynamicFormField";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";

import {resetPasswordSchema, type ResetPasswordFormData} from "../utils/validation";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  isSuccess?: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
  error,
  isSuccess = false,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch {
      // Error handling is done by parent component
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Şifre Başarıyla Sıfırlandı!</h3>
          <p className="text-muted-foreground leading-relaxed">
            Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
          </p>
        </div>

        <Button
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          type="button"
          onClick={() => (window.location.href = "/login")}
        >
          Giriş Sayfasına Git
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            label="Yeni Şifre"
            name="password"
            placeholder="Yeni şifrenizi giriniz"
            type="password"
          />

          <DynamicFormField
            control={form.control}
            label="Yeni Şifre Tekrar"
            name="confirmPassword"
            placeholder="Yeni şifrenizi tekrar giriniz"
            type="password"
          />

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Şifre güncelleniyor..." : "Şifreyi Güncelle"}
            {!isLoading && <ArrowRight />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
