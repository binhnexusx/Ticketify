import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getPaymentMethod, updatePaymentMethod } from '@/services/payment';
import { PaymentMethod } from '@/constants/enums';

import visa from '/assets/images/visa-logo.png';
import mastercard from '/assets/images/master-logo.png';
import amex from '/assets/images/american-express-logo.png';
import paypal from '/assets/images/paypal-logo.png';

const paymentSchema = z.object({
  method: z.enum(['Visa', 'MasterCard', 'American Express', 'PayPal']),
  card_name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Please enter a valid cardholder name'),
  card_number: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  exp_date: z
    .string()
    .regex(/^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Expiration date must be in DD-MM-YYYY')
    .refine((val) => {
      const [day, month, year] = val.split('-').map(Number);
      const expDate = new Date(year, month - 1, day);
      return expDate >= new Date();
    }, 'Card expired'),
});

const paymentOptions = [
  { label: 'Visa', value: 'Visa', img: visa },
  { label: 'American Express', value: 'American Express', img: amex },
  { label: 'MasterCard', value: 'MasterCard', img: mastercard },
  { label: 'PayPal', value: 'PayPal', img: paypal },
];

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentInfo({ booking_id = 1 }: { booking_id?: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<PaymentFormValues | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'Visa',
      card_name: '',
      card_number: '',
      exp_date: '',
    },
  });

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await getPaymentMethod(booking_id);
        const payment = res?.data || res;
        if (payment?.card_name) {
          const formData = {
            card_name: payment.card_name || '',
            card_number: payment.card_number || '',
            exp_date: payment.exp_date || '',
            method: payment.method || 'Visa',
          };
          reset(formData);
          setInitialData(formData);
        } else {
          reset();
          setInitialData(null);
        }
      } catch {
        toast({ variant: 'destructive', title: 'Failed to fetch payment info.' });
      }
    };

    fetchPaymentInfo();
  }, [booking_id, reset, toast]);

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      const payload = { booking_id, ...data };
      const res = await updatePaymentMethod(booking_id, payload);
      if (!res || typeof res !== 'object') throw new Error('Invalid response');

      setInitialData(data);
      setIsEditing(false);
      toast({ title: 'Payment info updated successfully.' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to update payment info.' });
    }
  };

  const handleCancel = () => {
    initialData ? reset(initialData) : reset();
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Payment</h2>
        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-sm text-root-primary-500 hover:text-root-primary-700 hover:bg-transparent"
          >
            Edit
          </Button>
        )}
      </div>

      <p className="text-sm text-root-gray-500 mb-4">
        Securely Add Or Remove Payment Methods To Make It Easier When You Book.
      </p>

      <div className="space-y-6 max-w-md">
        <div>
          <Label className="font-semibold mb-2 block">Payment Method</Label>
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex justify-between"
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  setValue('method', val as PaymentMethod);
                }}
                disabled={!isEditing}
              >
                {paymentOptions.map((option) => (
                  <div key={option.value} className="text-center space-y-1">
                    <RadioGroupItem
                      value={option.value}
                      id={`pm-${option.value}`}
                      className="peer sr-only"
                      disabled={!isEditing}
                    />
                    <label
                      htmlFor={`pm-${option.value}`}
                      className={`w-24 h-8 flex items-center justify-center rounded-md border transition-all cursor-pointer
                      ${
                        field.value === option.value
                          ? 'bg-white border-root-primary-500 ring-2 ring-root-primary-200'
                          : 'bg-root-gray-100 border-root-gray-300 hover:border-root-gray-400'
                      }
                      disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <img src={option.img} alt={option.label} className="max-h-8 max-w-14 object-contain" />
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.method && <p className="text-sm text-red-500 mt-1">{errors.method.message}</p>}
        </div>

        <div>
          <Label>
            Name On The Card <span className="text-red-500">*</span>
          </Label>
          <Input type="text" {...register('card_name')} disabled={!isEditing} />
          {errors.card_name && <p className="text-sm text-red-500 mt-1">{errors.card_name.message}</p>}
        </div>

        <div>
          <Label>
            Card Number <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={16}
            {...register('card_number')}
            disabled={!isEditing}
          />
          {errors.card_number && <p className="text-sm text-red-500 mt-1">{errors.card_number.message}</p>}
        </div>

        <div>
          <Label>
            Expiration Date (DD-MM-YYYY) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="DD-MM-YYYY"
            {...register('exp_date')}
            disabled={!isEditing}
          />
          {errors.exp_date && <p className="text-sm text-red-500 mt-1">{errors.exp_date.message}</p>}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-root-primary-600 text-white hover:bg-root-primary-700"
              disabled={!isDirty}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}