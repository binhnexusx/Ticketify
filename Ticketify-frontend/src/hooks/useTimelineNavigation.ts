import { useState } from 'react';
import { UseTimelineNavigationReturn, NavigationDirection } from '../types/gantt';

export const useTimelineNavigation = (): UseTimelineNavigationReturn => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentStartDate, setCurrentStartDate] = useState(today);

  const generateDays = (startDate: Date, count: number = 12) => {
    const days = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateDate = (direction: NavigationDirection) => {
    const newDate = new Date(currentStartDate);
    const offset = direction === 'prev' ? -7 : 7;
    newDate.setDate(currentStartDate.getDate() + offset);
    setCurrentStartDate(newDate);
  };

  const days = generateDays(currentStartDate);

  return {
    currentStartDate,
    days,
    navigateDate,
    today,
  };
};
