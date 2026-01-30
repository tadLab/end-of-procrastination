import { format } from 'date-fns';

export function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  return format(date, formatStr);
}
