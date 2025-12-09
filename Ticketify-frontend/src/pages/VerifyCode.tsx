import AuthLayout from "@/components/layout/auth/AuthForm";
import VerifyCode from "@/components/layout/auth/VerifyCode";
import { Toaster } from "@/components/ui/toaster";

export default function VerifyCodePage() {
  return (
    <AuthLayout>
      <Toaster />
      <VerifyCode />
    </AuthLayout>
  );
}
