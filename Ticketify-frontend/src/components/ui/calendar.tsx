import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type CalendarProps = {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: [Date | null, Date | null]) => void;
  minDate?: Date;
  className?: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  onChange,
  minDate = new Date(),
}) => {
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => onChange(update as [Date | null, Date | null])}
      minDate={minDate}
      inline
      calendarClassName="!border-none"
      dayClassName={(date) =>
        isPastDate(date)
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-[13px] text-root-gray-700 hover:bg-root-primary-100 hover:text-root-primary-600 rounded-md transition-colors'
      }
    />
  );
};
