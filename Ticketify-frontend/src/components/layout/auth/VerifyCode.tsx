import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { verifyForgotPasswordOTP, sendForgotPasswordOTP } from '@/services/auth';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const verifySchema = z.object({
  code: z.string().min(6, 'Code must be 6 characters'),
});

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setLoading(true);

    try {
      let email = localStorage.getItem('resetEmail');
      if (!email) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Email not found. Please restart the reset process.',
        });
        setLoading(false);
        return;
      }

      email = email.trim().toLowerCase();
      const otp = data.code.trim();

      const response = await verifyForgotPasswordOTP(email, otp);

      if (response.status !== 'success' || !response.resetToken) {
        toast({
          variant: 'destructive',
          title: 'Invalid or expired OTP',
          description: response.message || 'Please try again.',
        });
        return;
      }

      toast({
        title: 'OTP verified successfully',
        description: 'You can now reset your password.',
      });

      localStorage.setItem('resetToken', response.resetToken);
      navigate('/reset-password');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Error verifying OTP',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const email = localStorage.getItem('resetEmail');

      if (!email) {
        toast({ variant: 'destructive', title: 'Error', description: 'Email not found.' });
        return;
      }

      setSending(true);
      const res = await sendForgotPasswordOTP(email.trim().toLowerCase());
      setSending(false);

      toast({ title: 'OTP sent', description: 'A new OTP has been sent to your email.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to resend OTP',
        description: error.message || 'Please try again later.',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 mb-6 hover:underline self-start"
      >
        <ArrowLeft className="mr-1 w-4 h-4" />
        Back
      </button>
      <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-sm mb-4">
        We've sent a 6-digit verification code to{' '}
        <span className="font-medium">{localStorage.getItem('resetEmail')}</span>. Please enter the
        code below.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Verification code</label>
          <Input placeholder="Enter 6-digit code" {...form.register('code')} />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <p className="text-sm mt-4 text-center">
          Didn’t receive the code?
          <Button
            type="button"
            onClick={handleResend}
            disabled={sending}
            variant="link"
            className="text-root-primary-500 p-0"
          >
            {sending ? 'Sending...' : 'Send again!'}
          </Button>
        </p>
      </form>
    </div>
  );
}
