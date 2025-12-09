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
import { login } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserRole } from '@/constants/role';
import { setAuthStorage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const passwordRegex = /^\S*$/;
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .regex(passwordRegex, 'Current password cannot contain spaces')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const toast = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode:'onChange'
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      setGeneralError('');

      const res = await login(data);
      const { user, accessToken: token, refreshToken } = res;

      if (!user || !token) {
        throw new Error('Invalid login response from server');
      }

      setAuthStorage(token, user, refreshToken, data.rememberMe ?? false);

      if (user.role === UserRole.ADMIN) {
        toast.dismiss();
        navigate('/admin/dashboard');
      } else {
        toast.dismiss();
        navigate('/');
      }
    } catch (error: any) {
      console.log('❌ Error:', error);
      setGeneralError(error?.response?.data?.message || error?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-16 space-y-6 w-96">
        <h1 className="text-xl font-bold text-black">Login</h1>
        <p className="text-xs text-black">Login to access your EasySet24 account</p>

        {generalError && <p className="text-sm text-red-500">{generalError}</p>}

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
                  placeholder="Enter your password"
                  {...field}
                  className="w-full border-root-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between text-sm text-gray-500 w-400">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center pb-2 space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="flex items-center justify-center w-5 h-5 mt-2 border border-gray-300"
                  />
                </FormControl>
                <FormLabel className="m-0 text-sm font-normal ">Remember me</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link to="/forgot-password" className="text-root-primary-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full text-base rounded" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="mt-4 text-xs text-center text-black w-400">
          Don't have an account in EasySet24 yet?{' '}
          <a href="/register" className="text-root-primary-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </Form>
  );
}
