import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Deal } from '@/types/deal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

type Props = {
  initialData?: Partial<Deal>;
  onSave: (data: Partial<Deal>) => void;
  onCancel: () => void;
};

const formSchema = z.object({
  deal_name: z.string().min(1, 'Deal name is required'),
  start_date: z.date({ required_error: 'Start date is required' }),
  end_date: z.date({ required_error: 'End date is required' }),
  discount_rate_input: z
    .string()
    .min(1, 'Discount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 1 && num <= 100;
      },
      { message: 'Discount must be between 1% and 100%' }
    ),
  discount_rate: z.number().min(0.01).max(1).optional(),
  status: z.string().optional(),
});

export default function DealForm({ initialData, onSave, onCancel }: Props) {
  const today = new Date();
  const safeData = initialData || {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deal_name: safeData.deal_name || '',
      start_date: safeData.start_date ? new Date(safeData.start_date) : today,
      end_date: safeData.end_date ? new Date(safeData.end_date) : today,
      discount_rate_input:
        safeData.discount_rate !== undefined ? (safeData.discount_rate * 100).toString() : '',
      discount_rate: safeData.discount_rate ?? undefined,
      status:
        (safeData.start_date ? new Date(safeData.start_date) : today) <= today ? 'Ongoing' : 'New',
    },
  });

  // Cập nhật status khi đổi start_date
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'start_date') {
        const start = value.start_date;
        if (start) {
          const status = start <= today ? 'Ongoing' : 'New';
          form.setValue('status', status);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, today]);

  // Format ngày theo local YYYY-MM-DD để tránh UTC shift
  const formatLocalYMD = (date: Date | null | undefined) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const discountValue = values.discount_rate ?? 0.01;
    onSave({
      ...safeData,
      deal_name: values.deal_name,
      start_date: formatLocalYMD(values.start_date),
      end_date: formatLocalYMD(values.end_date),
      discount_rate: discountValue,
      status: values.status,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4">
        {/* Deal Name */}
        <FormField
          control={form.control}
          name="deal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter deal name (15)"
                  {...field}
                  maxLength={15}
                  className="text-sm"
                /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Input
              readOnly
              value={form.watch('status') || ''}
              className={`bg-gray-50 text-sm
                ${form.watch('status') === 'Ongoing' ? 'text-blue-600' : ''}
                ${form.watch('status') === 'New' ? 'text-green-600' : ''}
                ${form.watch('status') === 'Finished' ? 'text-red-600' : ''}
              `}
            />
          </FormControl>
        </FormItem>

        {/* Start & End Date */}
        <div className="grid grid-cols-1 col-span-2 gap-6 md:grid-cols-2">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => date && field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    minDate={today}
                    maxDate={form.watch('end_date') || undefined}
                    className="w-full border rounded px-[17px] py-2 text-sm"
                    dropdownMode="select"
                    popperContainer={({ children }) => (
                      <div className="absolute z-50">{children}</div>
                    )}
                    popperPlacement="bottom-start"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => date && field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    minDate={form.watch('start_date') || today}
                    className="w-full border rounded px-[17px] py-2 text-sm"
                    dropdownMode="select"
                    popperContainer={({ children }) => (
                      <div className="absolute z-50">{children}</div>
                    )}
                    popperPlacement="bottom-start"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Discount */}
        <FormField
          control={form.control}
          name="discount_rate_input"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter discount"
                  className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-3 py-2"
                  onChange={(e) => {
                    let cleaned = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = cleaned.split('.');
                    if (parts.length > 2) {
                      cleaned = parts[0] + '.' + parts.slice(1).join('');
                    }
                    let num = parseFloat(cleaned);
                    if (!isNaN(num) && num > 100) cleaned = '100';
                    form.setValue('discount_rate_input', cleaned);
                    form.setValue(
                      'discount_rate',
                      cleaned ? Math.round((parseFloat(cleaned) / 100) * 10000) / 10000 : undefined
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end col-span-2 gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
