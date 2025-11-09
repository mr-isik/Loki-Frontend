export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormData {
  code: string;
}

export interface SocialAuthProvider {
  name: "google" | "facebook";
  displayName: string;
  icon: React.ComponentType<{className?: string}>;
  color: string;
  hoverColor: string;
}

export interface AuthFormProps {
  onSubmit: (data: LoginFormData | SignupFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: {
    text: string;
    href: string;
  };
}
