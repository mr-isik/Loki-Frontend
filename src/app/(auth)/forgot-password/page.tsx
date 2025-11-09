"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

import {AuthLayout, ForgotPasswordForm, type ForgotPasswordFormData} from "@/features/auth";
import {AuthAPI} from "@/features/auth/api";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const {error, success} = await AuthAPI.forgotPassword(data);

      if (success) {
        setIsEmailSent(true);
      } else if (error) {
        setError(error.message);
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <AuthLayout
      footerLink={{
        text: "Hesap oluşturun",
        href: "/signup",
      }}
      footerText="Hesabınız yok mu?"
      subtitle="Şifrenizi sıfırlamak için e-posta adresinizi girin"
      title="Şifremi Unuttum"
    >
      <ForgotPasswordForm
        error={error || undefined}
        isEmailSent={isEmailSent}
        isLoading={isLoading}
        onBackToLogin={handleBackToLogin}
        onSubmit={handleForgotPassword}
      />
    </AuthLayout>
  );
}
