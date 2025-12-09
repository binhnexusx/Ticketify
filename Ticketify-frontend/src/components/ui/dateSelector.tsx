import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CalendarSingle from '@/components/ui/calendarSingle';
import { format } from 'date-fns';
import { DisabledRange } from '@/utils/dateUtils';
type DateSelectorProps = {
  label: string;
  selectedDate?: Date | null;
  minDate?: Date;
  onChange: (date: Date | null) => void;
  errorMessage?: string | null;
  disabledDates?: DisabledRange[]; 
};

const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  selectedDate,
  minDate,
  onChange,
  errorMessage,
  disabledDates = [],
}) => {
  return (
    <div className="border-l-2 border-root-primary-400 rounded pl-4">
      <label className="block font-semibold mb-1">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full justify-start text-left font-normal border-none">
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : `Pick ${label.toLowerCase()} date`}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarSingle
            selectedDate={selectedDate}
            onChange={onChange}
            minDate={minDate}
            disabledDates={disabledDates}
          />
        </PopoverContent>
      </Popover>
      {errorMessage && <p className="text-sm text-red-500 pt-2">{errorMessage}</p>}
    </div>
  );
};

export default DateSelector;
    