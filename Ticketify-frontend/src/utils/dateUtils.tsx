import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Ho_Chi_Minh';

export const toTzDate = (date: Date, hour: number) =>
  dayjs(date).tz(TIMEZONE).hour(hour).minute(0).second(0).millisecond(0).toDate();

export type DisabledRange = {
  from: Date;
  to: Date;
};

export const isDateTimeDisabled = (
  startDate: Date,
  endDate: Date,
  disabledRanges: DisabledRange[]
): boolean => {
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).endOf('day');

  return disabledRanges.some(({ from, to }) => {
    const rangeStart = dayjs(from).startOf('day');
    const rangeEnd = dayjs(to).endOf('day');

    //  (start == rangeEnd)
    //  (end == rangeStart)
    if (start.isSame(rangeEnd, 'day') || end.isSame(rangeStart, 'day')) {
      return false;
    }

    return start.isBefore(rangeEnd) && end.isAfter(rangeStart);
  });
};



export const flattenDateRanges = (ranges: { from: string; to: string }[]): DisabledRange[] =>
  ranges.map(({ from, to }) => ({
    from: new Date(from),
    to: dayjs(to).endOf('day').toDate(),
  }));
