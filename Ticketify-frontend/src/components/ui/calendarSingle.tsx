import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { DisabledRange } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

type CalendarSingleProps = {
  selectedDate?: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  disabledDates?: DisabledRange[];
};
function mergeRanges(ranges: DisabledRange[]): DisabledRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
  );

  const merged: DisabledRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    const lastTo = dayjs(last.to);
    const currentFrom = dayjs(current.from);

    if (currentFrom.isSameOrBefore(lastTo.add(1, 'day'))) {
      const newTo = dayjs(last.to).isAfter(current.to) ? last.to : current.to;

      merged[merged.length - 1] = {
        from: last.from,
        to: newTo,
      };
    } else {
      merged.push(current);
    }
  }

  return merged;
}

const CalendarSingle: React.FC<CalendarSingleProps> = ({
  selectedDate,
  onChange,
  minDate,
  disabledDates = [],
}) => {
  const mergedDisabled = mergeRanges(disabledDates); // 👈 Gộp trước

  const disabledDays = mergedDisabled.flatMap(({ from, to }, i, arr) => {
    const days: Date[] = [];

    let start = dayjs(from).add(1, 'day');
    let end = dayjs(to).subtract(1, 'day');

    const next = arr[i + 1];
    const isCheckInOfNext = next && dayjs(next.from).isSame(dayjs(to), 'day');

    if (isCheckInOfNext) {
      end = end.subtract(1, 'day');
    }

    for (let d = start; d.isSameOrBefore(end, 'day'); d = d.add(1, 'day')) {
      days.push(d.toDate());
    }

    return days;
  });

  const disabled = [...disabledDays, ...(minDate ? [{ before: minDate }] : [])].filter(Boolean);

  return (
    <DayPicker
      mode="single"
      selected={selectedDate || undefined}
      onSelect={(date) => onChange(date || null)}
      disabled={disabled}
      fromDate={minDate}
      className="p-3"
    />
  );
};

export default CalendarSingle;
