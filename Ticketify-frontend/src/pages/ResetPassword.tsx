import AuthLayout from "@/components/layout/auth/AuthForm";
import ResetPassword from "@/components/layout/auth/ResetPassword";
import { Toaster } from "@/components/ui/toaster";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Toaster />
      <ResetPassword />
    </AuthLayout>
  );
}
