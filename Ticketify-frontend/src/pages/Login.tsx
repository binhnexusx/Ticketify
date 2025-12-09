// src/pages/LoginPage.tsx
import AuthLayout from "@/components/layout/auth/AuthForm";
import LoginForm from "@/components/layout/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
