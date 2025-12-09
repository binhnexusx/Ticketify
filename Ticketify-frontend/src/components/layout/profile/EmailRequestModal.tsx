import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { getCurrentUser } from '@/lib/auth';
import { requestEmailChange } from '@/services/auth';
import { EmailVerifyModal } from './EmailVerifyModal';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/common/Loading';

const EmailSchema = z.object({
  currentEmail: z.string().email('Invalid current email'),
  newEmail: z
    .string()
    .email('Invalid new email')
    .refine((val) => val !== '', { message: 'New email is required' }),
});

type EmailFormValues = z.infer<typeof EmailSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EmailRequestModal = ({ open, onOpenChange }: Props) => {
  const user = getCurrentUser();

  const [isEmailVerifyModalOpen, setIsEmailVerifyModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [isloading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      currentEmail: user?.email || '',
      newEmail: '',
    },
  });

  const handleSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      await requestEmailChange({ userId: user.id, ...values });
      toast({
        title: 'Verification Sent',
        description: 'A verification code has been sent to your new email.',
      });
      setTimeout(() => {
        setPendingEmail(values.newEmail);
        setIsEmailVerifyModalOpen(true);
      }, 100);
    } catch (err) {}
    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex justify-between items-end'>
              Email Setting
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                x
              </Button>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input placeholder="new@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isloading}>
                {isloading ? <Loading variant="spinner" size="md" /> : ' Send Verification'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <EmailVerifyModal
        open={isEmailVerifyModalOpen}
        onOpenChange={setIsEmailVerifyModalOpen}
        email={pendingEmail}
        onVerifySuccess={() => {
          setIsEmailVerifyModalOpen(false);
          onOpenChange(false);
          form.reset();
        }}
      />
    </>
  );
};
