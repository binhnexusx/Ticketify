import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PaymentMethod } from '@/constants/enums';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem, customRadioClass } from '../ui/radio-group';

const paymentOptions = Object.entries(PaymentMethod);

type PaymentMethodCardProps = {
  control: any;
};

const PaymentMethodCard = ({ control }: PaymentMethodCardProps) => {
  return (
      <Card className="mt-4 flex flex-col w-full">
        <CardHeader className="text-base font-semibold p-4">Payment Method</CardHeader>
        <CardContent className="flex w-full items-center justify-between pl-4 ">
          <div className="flex w-[50%] gap-4">
           <p>Payment Methods</p>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
{/* 
          <Controller
            name="purpose"
            control={control}
            defaultValue="work"
            render={({ field }) => (
              <RadioGroup {...field} className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="work" id="work" className={customRadioClass} />
                  <Label htmlFor="work">Booking For Work</Label>
                </div>
              </RadioGroup>
            )}
          /> */}
        </CardContent>
      </Card>
  );
};

export default PaymentMethodCard;
