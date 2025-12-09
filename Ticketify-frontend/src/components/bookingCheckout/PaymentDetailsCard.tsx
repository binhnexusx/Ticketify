import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { convertCurrency, formatCurrency } from '@/utils/currency';
import { Check } from 'lucide-react';
import { RoomData } from '@/types/room';
import { differenceInDays } from 'date-fns';
import dayjs from 'dayjs';
interface PaymentDetailsCardProps {
  room: RoomData | null;
  checkInDate: string | null;
  checkOutDate: string | null;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  room,
  checkInDate,
  checkOutDate,
}) => {
  const nights =
    checkInDate && checkOutDate
      ? dayjs(checkOutDate).startOf('day').diff(dayjs(checkInDate).startOf('day'), 'day')
      : 0;
  const pricePerNight = Number(room?.price || 0);
  const originalPrice = pricePerNight * nights;
  const discount = originalPrice * (room?.discount_rate || 0);
  const total = originalPrice - discount;

  return (
    <Card className="mt-6">
      <CardHeader className="p-4 text-base font-semibold">Payment Information</CardHeader>
      <CardContent className="p-4 pt-0 space-y-4 text-sm">
        <p className="text-lg font-bold border-b border-gray-300">Your Price Summary</p>

        <div className="flex justify-between border-b border-gray-300">
          <span className="font-bold">Original Price</span>
          <div>
            <span className="font-bold">{formatCurrency(pricePerNight)}</span>
            <span className="ml-3 font-bold text-root-gray-500">{nights} night(s)</span>
          </div>
        </div>

        <div className="flex justify-between border-b border-gray-300">
          <div>
            <span>Room Discount </span>
            <span className="text-root-gray-500">
              {((room?.discount_rate ?? 0) * 100).toFixed(0)}% off
            </span>
          </div>
          <span className="text-red-500">- {formatCurrency(discount)}</span>
        </div>

        <div className="flex justify-between pb-2 font-bold border-b-2 border-gray-500 rounded">
          <span>Total Payment</span>
          <span className="text-root-state-Success_Dark">{formatCurrency(total)}</span>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-semibold">Cancellation Policy</h3>
          <p className="flex font-bold text-md">
            <Check className="mr-1 text-sm" />
            Free Cancellation
          </p>
          <p className="text-sm">
            Cancel or rebook at least 24 hours before check-in. Otherwise, 80% fee applies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetailsCard;
