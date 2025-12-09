import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setRoomDetail } from '@/redux/room/roomSlice';

import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import GuestInfoCard from '@/components/bookingCheckout/GuestInforCard';
import HotelInformationCard from '@/components/bookingCheckout/HotelInformationCard';
import PaymentDetailsCard from '@/components/bookingCheckout/PaymentDetailsCard';
import BankCard from '@/components/bookingCheckout/BankCard';
import PaymentMethodCard from '@/components/bookingCheckout/paymentMethod';
import BookingDetailsCard from '@/components/bookingCheckout/BookingDetailCard';

import { Card } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { convertExpiryToDate } from '@/utils/formatDate';

import { PaymentMethod } from '@/constants/enums';
import { handlePayment } from '@/services/payment';
import { createBooking, getIdBookings, getUserBookings } from '@/services/bookingService';

import { CreatePaymentDTO } from '@/types';
import Loading from '@/components/common/Loading';
import { clearRoomDetailFromLocalStorage, getRoomDetailFromLocalStorage } from '@/utils/storage';

const BookingSchema = z.object({
  firstName: z.string().min(1, 'Full name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string()
    .regex(/^\d+$/, 'Phone number must contain digits only')
    .min(10, 'Phone number must be at least 10 digits')
    .max(11, 'Phone number must be at most 11 digits'),
  cardName: z
    .string()
    .min(2, 'Card name required')
    .regex(/^[^0-9]*$/, 'Card name cannot contain numbers'),

  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits and only digits'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format') 
    .refine(
      (val) => {
        const [monthStr, yearStr] = val.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt('20' + yearStr, 10); 

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        return year > currentYear || (year === currentYear && month >= currentMonth);
      },
      {
        message: 'Card has expired. Please use another card!',
      }
    ),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type BookingFormValues = z.infer<typeof BookingSchema>;

export default function BookingCheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { room, checkInDate, checkOutDate, guest } = useSelector(
    (state: RootState) => state.roomDetail
  );
  const [showAll, setShowAll] = useState(false);
  const user = getCurrentUser();

  const stored = getRoomDetailFromLocalStorage();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      firstName: stored?.formData?.firstName || user?.firstName || '',
      lastName: stored?.formData?.lastName || user?.lastName || '',
      email: stored?.formData?.email || user?.email || '',
      phone: stored?.formData?.phone || user?.phone || '',
      middleName: stored?.formData?.middleName || '',
      // mainGuest: stored?.formData?.mainGuest || 'self',
      // assistance: stored?.formData?.assistance || '',
      cardName: stored?.formData?.cardName || '',
      cardNumber: stored?.formData?.cardNumber || '',
      expiryDate: stored?.formData?.expiryDate || '',
      paymentMethod: stored?.formData?.paymentMethod || PaymentMethod.Visa,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!room) {
      const stored = localStorage.getItem('roomDetail');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch(setRoomDetail(parsed));
        } catch (err) {
          console.error('⚠️ Failed to parse roomDetail from localStorage:', err);
        }
      }
    }
  }, [room, dispatch]);

  const { handleSubmit } = form;

  const onSubmit = async (data: BookingFormValues) => {
    if (!room || !checkInDate || !checkOutDate) {
      toast({
        title: 'Missing booking info',
        description: 'Please select room and dates.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        roomId: room.room_id,
        checkInDate,
        checkOutDate,
        totalGuests: 1,
      });
      console.log('Booking..:', booking);
      const bookingDetailList = await getIdBookings(booking.booking_id);

      localStorage.setItem('lastBookingId', booking.booking_id.toString());
      const payload: CreatePaymentDTO = {
        booking_id: booking?.booking_id,
        amount: bookingDetailList?.total_discounted_price || 0,
        method: data.paymentMethod,
        card_name: data.cardName,
        card_number: data.cardNumber,
        exp_date: convertExpiryToDate(data.expiryDate),
      };

      await handlePayment(payload);
      clearRoomDetailFromLocalStorage();
      toast({
        title: 'Booking Confirmed',
        description:
          'Thank you! Your booking is now confirmed.Please check email to review all information!',
      });

      navigate(`/payment-confirmed/${booking.booking_id}`);
    } catch (error) {
      console.error('❌ Payment failed:', error);
    }
    setIsSubmitting(false);
  };
  if (!room) return <div>Room not found.</div>;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-screen-xl mx-auto flex flex-col gap-6 px-10 py-10"
        >
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            {/* Left column */}
            <div className="w-full lg:w-[519px]">
              <HotelInformationCard room={room} showAll={showAll} setShowAll={setShowAll} />
              <PaymentDetailsCard
                room={room}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
              />
            </div>

            {/* Right column */}
            <div className="w-full lg:flex-1 space-y-6">
              <GuestInfoCard form={form} />
              <PaymentMethodCard control={form.control} />
              <BookingDetailsCard />
              <Card className="flex flex-col items-center lg:items-end relative">
                <BankCard form={form} />
                <Button
                  type="submit"
                  className="m-5 w-full max-w-[200px] relative"
                  disabled={isSubmitting || !!bookingError || !checkInDate || !checkOutDate}
                >
                  {isSubmitting ? <Loading variant="spinner" size="md" /> : 'Pay Now'}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
