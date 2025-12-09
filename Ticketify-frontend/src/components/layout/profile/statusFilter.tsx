import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Funnel } from 'lucide-react';
import { BookingStatus } from '@/constants/enums';

const statusLabels: Record<BookingStatus | 'all', string> = {
  all: 'All Bookings',
  [BookingStatus.Booked]: 'Booked',
  [BookingStatus.CheckIn]: 'Checked-In',
  [BookingStatus.CheckedOut]: 'Checked-Out',
  [BookingStatus.Cancelled]: 'Cancelled',
};

interface StatusFilterDropdownProps {
  selected: string;
  onChange: (value: string) => void;
}

export function StatusFilterDropdown({ selected, onChange }: StatusFilterDropdownProps) {
  const buttonLabel = 'All Bookings';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between border-gray-500 text-gray-500">
          <span className='flex gap-2'>
            <Funnel />
            {buttonLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {[
          { value: 'all', label: statusLabels['all'] },
          ...Object.values(BookingStatus).map((value) => ({
            value,
            label: statusLabels[value],
          })),
        ].map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
        flex items-center justify-between 
        hover:bg-root-primary-500 
        ${selected === option.value ? 'bg-root-primary-500 text-white' : ''}
      `}
          >
            {option.label}
            {selected === option.value && (
              <Check className="ml-2 h-4 w-4 text-primary hover:text-white " />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
