import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem, customRadioClass } from '../ui/radio-group';
import { BookingFormValues } from '@/pages/user/BookingCheckout';
import { Button } from '../ui/button';
import { ChevronRight, Pencil } from 'lucide-react';
import { getUser } from '@/services/profile';
import { getAccessToken, getCurrentUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchUser } from '@/redux/userSlice';
import { API_URL } from '@/constants/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { getInputClass, getLabelClass } from '@/utils/formStyles';

interface GuestInfoCardProps {
  form: UseFormReturn<BookingFormValues>;
}
export default function GuestInfoCard({ form }: GuestInfoCardProps) {
  const { errors } = form.formState;
  const navigate = useNavigate();

  // const mainGuestOptions = [
  //   {
  //     value: 'self',
  //     id: 'mainGuestSelf',
  //     label: 'I am the main guest',
  //   },
  //   {
  //     value: 'someoneElse',
  //     id: 'mainGuestOther',
  //     label: 'Booking is for someone else',
  //   },
  // ];
  const dispatch = useAppDispatch();
  const { data: user, loading } = useAppSelector((state) => state.user);
  const token = getAccessToken();

  // Lấy user nếu chưa có
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user) {
      form.setValue('firstName', user.first_name || '');
      form.setValue('lastName', user.last_name || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.phone || '');
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <Card className="relative flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar_url ? `${API_URL}${user.avatar_url}` : '/assets/images/avatar.png'}
              alt="avatar"
              className="object-cover w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="justify-between"
            onClick={() => {
              navigate('/user/bookingHistories');
            }}
          >
            <span className="flex items-center gap-1">
              Booking history <ChevronRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
        {/* <FormField
          control={form.control}
          name="mainGuest"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-2 space-y-0">
              <FormLabel className="font-semibold text-md">Who are you booking for?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  {mainGuestOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={option.value}
                        id={option.id}
                        className={customRadioClass}
                      />
                      <Label htmlFor={option.id} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="relative mt-2">
          <h2 className="text-lg font-bold">Edit your Information</h2>
          <span className="flex items-center justify-between">
            <p className="text-md">Make sure the information in your profile below is correct.</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('info-user');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="transition-colors border-none hover:text-blue-500"
                    aria-label="Edit information"
                  >
                    <Pencil size={18} className="cursor-pointer text-root-primary-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </div>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4" id="info-user">
          <div>
            <Label className={getLabelClass(!!errors.firstName)}>
              Full Name <span className="ml-1 text-xs text-red-500">*</span>
            </Label>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First name*"
                        {...field}
                        className={getInputClass(!!errors.firstName)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input type="text" placeholder="Middle name" {...field} className={getInputClass(!!errors.middleName)} />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last name*"
                        {...field}
                        className={getInputClass(!!errors.lastName)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between w-full gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={getLabelClass(!!errors.email)}>
                    Email Address <span className="ml-1 text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      className={getInputClass(!!errors.email)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={getLabelClass(!!errors.phone)}>
                    Phone Number
                    <span className="ml-1 text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="764378888888"
                      {...field}
                      className={getInputClass(!!errors.phone)}
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </Form>
  );
}
