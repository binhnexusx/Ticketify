import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Home, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RoomSearchFormValues } from '@/types';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { RoomLevel } from '@/constants/rooms';

const searchSchema = z
  .object({
    check_in: z.date().optional(),
    check_out: z.date().optional(),
    people: z.number().min(1, 'At least 1 person').max(6, 'Maximum 6 people').optional(),
    room_level: z.number().optional(),
  })
  .refine((data) => !data.check_in || !data.check_out || data.check_out > data.check_in, {
    message: 'Check-out must be after check-in',
    path: ['check_out'],
  });

interface RoomSearchBarProps {
  onSearch: (data: RoomSearchFormValues) => void;
  loading?: boolean;
  error?: string | null;
}

export default function RoomSearchBar({
  onSearch,
  loading: propLoading,
  error: propError,
}: RoomSearchBarProps) {
  const [searchParams] = useSearchParams();
  const { filterOptions, loading: filterLoading, error: filterError } = useFilterOptions();

  const form = useForm<RoomSearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      check_in: undefined,
      check_out: undefined,
      people: undefined,
      room_level: undefined,
    },
  });

  const { handleSubmit, watch, setValue, reset, formState, trigger } = form;
  const checkIn = watch('check_in');
  const checkOut = watch('check_out');

  useEffect(() => {
    const checkInParam = searchParams.get('check_in');
    const checkOutParam = searchParams.get('check_out');
    const peopleParam = searchParams.get('people');
    const roomLevelParam = searchParams.get('room_level');

    const formData: Partial<RoomSearchFormValues> = {
      people: 1,
    };

    if (checkInParam) {
      const date = new Date(checkInParam);
      if (!isNaN(date.getTime())) {
        formData.check_in = date;
      }
    }

    if (checkOutParam) {
      const date = new Date(checkOutParam);
      if (!isNaN(date.getTime())) {
        formData.check_out = date;
      }
    }

    if (peopleParam && !isNaN(parseInt(peopleParam, 10))) {
      formData.people = parseInt(peopleParam, 10);
    }

    if (roomLevelParam && !isNaN(parseInt(roomLevelParam, 10))) {
      formData.room_level = parseInt(roomLevelParam, 10);
    }

    reset(formData);
  }, [searchParams, reset]);

  const onSubmit = (data: RoomSearchFormValues) => {
    const today = new Date();
    const defaultCheckOut = addDays(today, 7);

    const finalData: RoomSearchFormValues = {
      ...data,
      check_in: data.check_in ?? today,
      check_out: data.check_out ?? defaultCheckOut,
      people: data.people ?? undefined,
      room_level: data.room_level ?? undefined,
    };

    console.log('Form data on submit:', finalData);
    console.log('Form errors:', formState.errors);
    onSearch(finalData);
  };

  const dateError = formState.errors.check_out?.message;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative px-4 py-6 bg-white sm:py-10 sm:px-5"
      >
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-1 text-lg font-bold sm:text-xl md:text-2xl text-root-primary-500">
            Where Is Your Next Dream Place?
          </h2>
          <p className="text-xs sm:text-sm text-root-primary-500">
            Find Exclusive Genius Rewards In Every Corner Of The World!
          </p>
        </div>

        {filterError && <div className="mb-4 text-sm text-red-500">{filterError}</div>}

        {/* Desktop Layout - giữ nguyên thiết kế gốc */}
        <div className="relative items-end hidden ml-auto md:flex">
          {/* People */}
          <FormField
            control={form.control}
            name="people"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-black">People</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const parsedValue = parseInt(value, 10);
                    if (!isNaN(parsedValue)) {
                      field.onChange(parsedValue);
                    } else {
                      field.onChange(1);
                    }
                  }}
                  value={field.value?.toString()}
                  disabled={filterLoading}
                >
                  <FormControl>
                    <SelectTrigger className="flex items-center justify-between py-4 pr-20 text-sm border-none rounded-none shadow-none text-neutral-950 bg-neutral-50">
                      <Users className="w-6 h-6 mx-2 text-root-gray-500" />
                      <span className="w-[120px] text-left truncate">
                        {field.value ? `${field.value} people` : 'Select people'}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    {filterOptions?.maxPeople?.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </SelectItem>
                    )) || <SelectItem value="1">1 person</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Room Level */}
          <FormField
            control={form.control}
            name="room_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-black">Room Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const parsedValue = parseInt(value, 10);
                    field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                  }}
                  value={field.value?.toString() ?? ''}
                  disabled={filterLoading}
                >
                  <FormControl>
                    <SelectTrigger className="flex items-center justify-between py-4 pr-20 text-sm border-none rounded-none shadow-none text-neutral-950 bg-neutral-50">
                      <Home className="w-6 h-6 mx-2 text-root-gray-500" />
                      <span className="w-[136px] text-left truncate">
                        {filterOptions?.roomLevels?.find(
                          (level) => level.room_level_id === (field.value as number)
                        )?.name ?? 'Select room level'}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    {filterOptions?.roomLevels?.map((level) => (
                      <SelectItem key={level.room_level_id} value={level.room_level_id.toString()}>
                        {level.name}
                      </SelectItem>
                    )) || <SelectItem value="0">No options available</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range */}
          <FormItem>
            <FormLabel className="text-sm font-bold text-black">Check In – Check Out</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="flex items-center justify-between py-4 text-sm cursor-pointer pr-28 bg-neutral-50 text-neutral-950">
                    <CalendarIcon className="w-6 h-6 mx-2 text-root-gray-500" />
                    <span className="w-[210px] text-left truncate">
                      {dateError ? (
                        <span className="text-red-500">{dateError}</span>
                      ) : (
                        <span
                          className={cn(
                            checkIn && checkOut ? 'text-neutral-950' : 'text-root-gray-500'
                          )}
                        >
                          {checkIn && checkOut
                            ? `${format(checkIn, 'dd/MM/yyyy')} - ${format(checkOut, 'dd/MM/yyyy')}`
                            : 'Select date range'}
                        </span>
                      )}
                    </span>
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <DayPicker
                  mode="range"
                  selected={{ from: checkIn, to: checkOut }}
                  onSelect={async (range: DateRange | undefined) => {
                    if (range?.from) {
                      setValue('check_in', range.from, { shouldValidate: true });
                    } else {
                      setValue('check_in', undefined, { shouldValidate: true });
                    }
                    if (range?.to) {
                      setValue('check_out', range.to, { shouldValidate: true });
                    } else {
                      setValue('check_out', undefined, { shouldValidate: true });
                    }
                    await trigger(['check_in', 'check_out']);
                  }}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              className="h-full text-base font-semibold text-white rounded-r-md rounded-l-[0px] py-4 px-28 bg-root-primary-500 hover:bg-root-primary-600"
              disabled={propLoading || filterLoading}
            >
              {propLoading || filterLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Mobile Layout - Stack theo chiều dọc */}
        <div className="block space-y-4 md:hidden">
          {/* People - Mobile */}
          <FormField
            control={form.control}
            name="people"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-black">People</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const parsedValue = parseInt(value, 10);
                    if (!isNaN(parsedValue)) {
                      field.onChange(parsedValue);
                    } else {
                      field.onChange(1);
                    }
                  }}
                  value={field.value?.toString()}
                  disabled={filterLoading}
                >
                  <FormControl>
                    <SelectTrigger className="flex items-center py-4 text-sm bg-neutral-50 text-neutral-950">
                      <Users className="w-6 h-6 mx-2 text-root-gray-500" />
                      <span className="flex-1 text-left">
                        {field.value ? `${field.value} people` : 'Select people'}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filterOptions?.maxPeople?.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </SelectItem>
                    )) || <SelectItem value="1">1 person</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Room Level - Mobile */}
          <FormField
            control={form.control}
            name="room_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-black">Room Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const parsedValue = parseInt(value, 10);
                    field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                  }}
                  value={field.value?.toString() ?? ''}
                  disabled={filterLoading}
                >
                  <FormControl>
                    <SelectTrigger className="flex items-center py-4 text-sm bg-neutral-50 text-neutral-950">
                      <Home className="w-6 h-6 mx-2 text-root-gray-500" />
                      <span className="flex-1 text-left truncate">
                        {filterOptions?.roomLevels?.find(
                          (level) => level.room_level_id === (field.value as number)
                        )?.name ?? 'Select room level'}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filterOptions?.roomLevels?.map((level) => (
                      <SelectItem key={level.room_level_id} value={level.room_level_id.toString()}>
                        {level.name}
                      </SelectItem>
                    )) || <SelectItem value="0">No options available</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range - Mobile */}
          <FormItem>
            <FormLabel className="text-sm font-bold text-black">Check In – Check Out</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="flex items-center py-4 text-sm cursor-pointer bg-neutral-50 text-neutral-950">
                    <CalendarIcon className="w-6 h-6 mx-2 text-root-gray-500" />
                    <span className="flex-1 text-left">
                      {dateError ? (
                        <span className="text-red-500">{dateError}</span>
                      ) : (
                        <span
                          className={cn(
                            checkIn && checkOut ? 'text-neutral-950' : 'text-root-gray-500'
                          )}
                        >
                          {checkIn && checkOut
                            ? `${format(checkIn, 'dd/MM/yyyy')} - ${format(checkOut, 'dd/MM/yyyy')}`
                            : 'Select date range'}
                        </span>
                      )}
                    </span>
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <DayPicker
                  mode="range"
                  selected={{ from: checkIn, to: checkOut }}
                  onSelect={async (range: DateRange | undefined) => {
                    if (range?.from) {
                      setValue('check_in', range.from, { shouldValidate: true });
                    } else {
                      setValue('check_in', undefined, { shouldValidate: true });
                    }
                    if (range?.to) {
                      setValue('check_out', range.to, { shouldValidate: true });
                    } else {
                      setValue('check_out', undefined, { shouldValidate: true });
                    }
                    await trigger(['check_in', 'check_out']);
                  }}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>

          <Button
            type="submit"
            className="w-full py-4 text-base font-semibold text-white bg-root-primary-500 hover:bg-root-primary-600"
            disabled={propLoading || filterLoading}
          >
            {propLoading || filterLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
