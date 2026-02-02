import { format, addDays, subDays, startOfWeek, eachDayOfInterval, isToday } from 'date-fns';

export function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  return format(date, formatStr);
}

export function getWeekDays(referenceDate) {
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export { addDays, subDays, isToday };
