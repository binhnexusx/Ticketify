import * as RadioGroup from '@radix-ui/react-radio-group';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { useToast } from '@/hooks/use-toast';
import { submitRoomFeedback } from '@/services/profile';

const formSchema = z.object({
  comment: z.string().min(1, 'Please enter your feedback'),
  rating: z.string().min(1, 'Please select a rating'),
  room_name: z.string(),
  room_description: z.string(),
  room_id: z.number().min(1),
  booking_detail_id: z.number().min(1),
});

export default function RoomFeedbackForm({ roomId, bookingDetailId, roomName, roomDescription  }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
      rating: '',
      room_id: roomId,
      booking_detail_id: bookingDetailId,
      room_name: roomName,
    room_description: roomDescription,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem("user") || '{}');
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please log in again.',
      });
      return;
    }
    try {
      await submitRoomFeedback({
        room_id: values.room_id,
        room_name: values.room_name,
        booking_detail_id: values.booking_detail_id,
        rating: Number(values.rating),
        comment: values.comment,
        room_description: values.room_description,
      });
      toast({
        title: 'Feedback sent',
        description: 'Thank you for your feedback!',
      });
      form.reset();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Send feedback failed!',
      });
    }
  };
  return (
    <div className="flex justify-center items-center h-[550px] w-[500px]">
      <div className="w-[560px] bg-gray-100 p-4 rounded-lg shadow-md ">
        <div className='border border-root-primary-100 rounded-lg mb-6'>
          <div className='flex gap-2 p-3'>
            <img
            src="/assets/images/feedback-form.png"
            alt="Feedback Banner"
            className=" h-[150px] w-[200px]"
          />
          <div className='space-y-4'>
            <div>{roomName}</div>
            <div className="max-h-[110px] overflow-y-auto">
              {roomDescription}
            </div>
          </div>
          </div>
          
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => {
                const selectedRating = Number(field.value);

                return (
                  <FormItem>
                    <FormLabel className='text-xs text-black font-normal"'>How was your experience?</FormLabel>
                    <FormControl>
                      <RadioGroup.Root
                        className="flex gap-2"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <RadioGroup.Item
                            key={num}
                            value={String(num)}
                            className="cursor-pointer"
                            aria-label={`${num} star`}
                          >
                            <Star
                              size={32}
                              className={`transition-colors ${
                                selectedRating >= num
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 hover:text-yellow-400 hover:fill-yellow-400'
                              }`}
                            />
                          </RadioGroup.Item>
                        ))}
                      </RadioGroup.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-black font-normal">Share your thoughts</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience..."
                      className="text-xs border-root-gray-400 h-16 rounded-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center pt-2">
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
