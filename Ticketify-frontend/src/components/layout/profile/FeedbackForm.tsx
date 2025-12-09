import * as RadioGroup from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
Form,
FormField,
FormItem,
FormLabel,
FormControl,
FormMessage,
} from "@/components/ui/form";

import { useToast } from '@/hooks/use-toast';
import { submitHotelFeedback } from "@/services/profile";

const formSchema = z.object({
comment: z.string().min(1, "Please enter your feedback"),
rating: z.string().min(1, "Please select a rating"),
});

export default function FeedbackForm() {
const { toast } = useToast(); 
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    comment: "",
    rating: "",
  },
});

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  if (!user?.id) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please log in again.",
    });
    return;
  }
  try {
    await submitHotelFeedback({
      comment: values.comment,
      rating: Number(values.rating),
      user_id: user.id,
    });
    toast({
      title: "Feedback sent",
      description: "Thank you for your feedback!",
    });
    form.reset();
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Send feedback failed!",
    });
  }
};
return (
  <div className="flex justify-center items-center h-[550px] w-[500px]">
    <div className="w-[560px] bg-gray-100 p-4 rounded-lg shadow-md">
      <img
        src="/assets/images/feedback-form.png"
        alt="Feedback Banner"
        className=" h-[200px] w-[550px]"
      />
      <div className="flex flex-col items-center py-4">
        <div className="text-xs text-root-primary-50 font-bold">
          Share your experience
        </div>
        <div className="text-xs text-black">
          Your feedback helps us improve our service quality
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
                  <FormLabel className="text-black">Overall Rating</FormLabel>
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
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 hover:text-yellow-400 hover:fill-yellow-400"
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
                <FormLabel className="text-black">Detailed feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share your experience about hotel, service,..."
                    className="text-xs border-root-gray-400 h-16 rounded-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center pt-2">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  </div>
);
}
