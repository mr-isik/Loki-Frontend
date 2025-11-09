"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

import {AuthLayout, ResetPasswordForm, type ResetPasswordFormData} from "@/features/auth";
import {AuthAPI} from "@/features/auth/api";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const {error, success} = await AuthAPI.resetPassword(data, token);

      if (success) {
        setIsSuccess(true);
      } else if (error) {
        setError(error.message);
      }
    } catch {
      setError("Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  // If no token, redirect to forgot password
  if (!token) {
    router.push("/forgot-password");

    return null;
  }

  return (
    <AuthLayout
      footerLink={{
        text: "Giriş yapın",
        href: "/login",
      }}
      footerText="Şifrenizi hatırladınız mı?"
      subtitle="Hesabınız için yeni bir şifre oluşturun"
      title="Şifre Sıfırlama"
    >
      <ResetPasswordForm
        error={error || undefined}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onSubmit={handleResetPassword}
      />
    </AuthLayout>
  );
}
