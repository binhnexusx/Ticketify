import AuthLayout from "@/components/layout/auth/AuthForm";
import ForgotPassword from "@/components/layout/auth/ForgotPassword";
import { Toaster } from "@/components/ui/toaster";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Toaster />
      <ForgotPassword />
    </AuthLayout>
  );
}
