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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerApi } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const passwordRegex = /^\S*$/;

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z]+$/, 'First name must contain only letters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .regex(passwordRegex, 'password cannot contain spaces')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .regex(passwordRegex, 'confirm password cannot contain spaces')
      .min(6, 'Confirm password is required'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({
        message: 'You must agree to the Terms and Privacy Policies',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    mode:'onChange'
  });
  const { errors } = form.formState;

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setLoading(true);
      setGeneralError('');

      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: 'user',
        firstname: data.firstName,
        lastname: data.lastName,
      };

      await registerApi(payload);
      navigate('/login');
    } catch (error: any) {
      setGeneralError(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        <h1 className="text-xl font-bold text-black">Register</h1>

        {generalError && <p className="text-sm text-red-500">{generalError}</p>}

        <div className="flex w-full gap-9">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} className="border-root-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} className="border-root-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  className="w-full border-root-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                  className="w-full border-root-gray-400"
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                  className="w-full border-root-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-1"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center justify-center text-sm text-gray-700">
                    I agree to all the Terms and Privacy Policies
                  </FormLabel>
                </div>
              </div>
              <div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-base rounded" disabled={loading}>
          {loading ? 'Registering...' : 'Register Now'}
        </Button>

        <p className="mt-4 text-xs text-center text-black w-400">
          Already have an account?{' '}
          <a href="/login" className="text-root-primary-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </Form>
  );
}
