import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameMonth
} from 'date-fns';

export function getDaysInMonth(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  return format(date, formatStr);
}

export function getMonthName(date) {
  return format(date, 'MMMM yyyy');
}

export function getDayName(date) {
  return format(date, 'EEE');
}

export function getDayNumber(date) {
  return format(date, 'd');
}

export { isToday, isSameMonth, getDay };
