'use client';

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
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { resetPasswordWithToken } from '@/services/auth';
import { getInputClass, getLabelClass } from '@/utils/formStyles';

const passwordRegex = /^\S*$/;

const resetSchema = z
  .object({
    password: z
      .string()
      .regex(passwordRegex, 'New password cannot contain spaces')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .regex(passwordRegex, 'Confirm password cannot contain spaces')
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const { errors } = form.formState;
  

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    try {
      setLoading(true);

      const email = localStorage.getItem('resetEmail');
      const resetToken = localStorage.getItem('resetToken');

      if (!email || !resetToken) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Missing email or reset token. Please retry the reset process.',
        });
        setLoading(false);
        return;
      }

      const newPassword = data.password;
      const res = await resetPasswordWithToken(email, resetToken, newPassword);

      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetToken');

      toast({
        title: 'Success',
        description: 'Password updated successfully.',
      });

      setTimeout(() => {
        navigate('/success');
      }, 1000);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: ' Failed to reset password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 px-10">
      <h1 className="mb-4 text-xl font-bold">Update Password</h1>
      <p className="mb-4 text-sm">
        Please create a new password for your account. Make sure it's strong and secure.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={getLabelClass(!!errors.password)}>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    className={getInputClass(!!errors.password)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={getLabelClass(!!errors.confirmPassword)}>
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                    className={getInputClass(!!errors.confirmPassword)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
