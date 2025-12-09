import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/date';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/btn';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '@/constants/api';

const formSchema = z.object({
  check_in: z.date(),
  check_out: z.date(),
  firstName: z
    .string()
    .min(1, 'First Name is required')
    .regex(/^[^\s]+$/, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(1, 'Last Name is required')
    .regex(/^[^\s]+$/, 'Last name must contain only letters'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits'),
  email: z.string().email('Invalid email'),
  status: z.enum(['booked']),
});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingFormModalProps {
  open: boolean;
  onClose: () => void;
  defaultRoomNumber: string;
  selectedRoom: {
    id: number;
    firstName: string;
    lastName: string;
    floor: number;
    amenities: { name: string; icon: string }[];
    price: number;
    description: string;
  } | null;
  onSubmit: (data: BookingFormValues) => void;
  roomDataById?: Partial<BookingFormValues>;
}

export default function BookingFormModal({
  open,
  onClose,
  defaultRoomNumber,
  selectedRoom,
  onSubmit,
  roomDataById,
}: BookingFormModalProps) {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const checkInParam = searchParams.get('check_in');
  const checkOutParam = searchParams.get('check_out');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      check_in: checkInParam ? new Date(checkInParam) : new Date(),
      check_out: checkOutParam ? new Date(checkOutParam) : new Date(),
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      status: 'booked',
    },
  });

  useEffect(() => {
    reset({
      check_in: roomDataById?.check_in || (checkInParam ? new Date(checkInParam) : new Date()),
      check_out: roomDataById?.check_out || (checkOutParam ? new Date(checkOutParam) : new Date()),
      firstName: roomDataById?.firstName || '',
      lastName: roomDataById?.lastName || '',
      phone: roomDataById?.phone || '',
      email: roomDataById?.email || '',
      status: roomDataById?.status || 'booked',
    });
  }, [roomDataById, checkInParam, checkOutParam, reset]);

  const check_in = watch('check_in');
  const check_out = watch('check_out');

  const onSubmitHandler: SubmitHandler<BookingFormValues> = async (values) => {
    if (!selectedRoom?.id) {
      toast({ variant: 'destructive', title: 'No room selected!' });
      return;
    }

    try {
      const nights =
        (values.check_out.getTime() - values.check_in.getTime()) / (1000 * 60 * 60 * 24);
      const totalPrice = nights * selectedRoom.price;

      const body = {
        roomId: selectedRoom.id,
        ...values,
        checkInDate: format(values.check_in, 'yyyy-MM-dd'),
        checkOutDate: format(values.check_out, 'yyyy-MM-dd'),
        checkInTimestamp: values.check_in.getTime(),
        checkOutTimestamp: values.check_out.getTime(),
        totalPrice,
      };

      await api.post('/api/bookings/front-desk', body);

      toast({ title: 'Booked successfully', description: `${selectedRoom.name} was booked.` });
      onSubmit(values);
      onClose();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Booking failed!',
        description: err.response?.data?.message || 'Unexpected error',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl space-y-6">
        {!selectedRoom ? (
          <div className="p-6 text-center text-gray-500 bg-gray-100 rounded">No room selected</div>
        ) : (
          <div className="p-6 mb-4 rounded bg-adminLayout-primary-50">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {selectedRoom.amenities?.map((a, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
                      <img src={`${API_URL}${a.icon}`} className="w-4 h-4" alt={a.name} /> {a.name}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {selectedRoom.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-green-600">${selectedRoom.price}</p>
                <p className="text-xs text-gray-500">Per night</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-3">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Check in', value: check_in, name: 'check_in' },
              { label: 'Check out', value: check_out, name: 'check_out' },
            ].map((field) => (
              <div key={field.name}>
                <Label>{field.label}</Label>
                <Popover>
                  <PopoverTrigger asChild disabled>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {field.value ? format(field.value, 'dd/MM/yyyy') : 'Pick'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(d) => d && setValue(field.name as keyof BookingFormValues, d)}
                    />
                  </PopoverContent>
                </Popover>
                {errors[field.name as keyof BookingFormValues] && (
                  <p className="text-xs text-red-500">
                    {errors[field.name as keyof BookingFormValues]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Last Name</Label>
                <Input {...register('lastName')} placeholder="Enter guest last name" />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <Label>First Name</Label>
                <Input {...register('firstName')} placeholder="Enter guest first name" />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Room number</Label>
              <Input value={selectedRoom?.name || defaultRoomNumber} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Phone</Label>
              <Input {...register('phone')} placeholder="Enter phone number" />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Status</Label>
              <Input value="Booked" disabled className="border shadow-none" />
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register('email')} placeholder="Enter email ID" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
