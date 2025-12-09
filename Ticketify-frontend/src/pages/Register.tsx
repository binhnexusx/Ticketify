// src/pages/RegisterPage.tsx
import AuthLayout from "@/components/layout/auth/AuthForm";
import RegisterForm from "@/components/layout/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
