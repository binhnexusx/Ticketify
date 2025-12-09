import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendForgotPasswordOTP } from '@/services/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    try {
      setLoading(true);
      setMessage('');
      await sendForgotPasswordOTP(data.email.trim().toLowerCase());
      localStorage.setItem('resetEmail', data.email.trim().toLowerCase());

      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${data.email}.`,
      });

      navigate(`/verify-code`);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to send verification code';
      setMessage(errorMsg);

      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
      <h1 className="text-xl font-bold">Forgot Password</h1>
      <p className="text-sm mb-4">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>

      {message && <p className="mb-2">{message}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="easyset24@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
