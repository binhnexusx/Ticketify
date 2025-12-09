'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from '@/pages/user/BookingCheckout';
import { getInputClass, getLabelClass } from '@/utils/formStyles';

type Props = {
  form: UseFormReturn<BookingFormValues>;
};

export default function BankCard({ form }: Props) {
  const { errors } = form.formState;

  return (
    <Card className="p-0 mt-4 border-none shadow-none">
      <CardHeader className="p-4 pt-0 text-lg font-semibold">Bank Card Information</CardHeader>
      <CardContent className="flex flex-col gap-4 pl-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={getLabelClass(!!errors.cardName)}>
                  Full Name on Card
                  <span className="ml-1 text-xs text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Full Name"
                    className={getInputClass(!!errors.cardName)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={getLabelClass(!!errors.cardNumber)}>
                  Card Number <span className="ml-1 text-xs text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="*******************"
                    maxLength={16}
                    className={getInputClass(!!errors.cardNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={getLabelClass(!!errors.expiryDate)}>
                  Expiry Date <span className="ml-1 text-xs text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MM/YY"
                    className={getInputClass(!!errors.expiryDate)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
