import { subDays, format } from 'date-fns';

export function computeHabitStreaks(dayData, habitDefinitions, referenceDate = new Date()) {
  const streaks = {};
  for (const habit of habitDefinitions) {
    let count = 0;
    let date = referenceDate;
    while (true) {
      const key = format(date, 'yyyy-MM-dd');
      const entry = dayData[key];
      if (entry?.habits?.[habit.id]) {
        count++;
        date = subDays(date, 1);
      } else {
        break;
      }
    }
    streaks[habit.id] = count;
  }
  return streaks;
}

export function computeWeeklyCompletion(dayData, habitDefinitions, referenceDate = new Date()) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(referenceDate, i);
    const key = format(date, 'yyyy-MM-dd');
    const entry = dayData[key];
    const tasks = entry?.tasks || [];
    const taskDone = tasks.filter(t => t.completed).length;
    const taskTotal = tasks.length;
    const habitDone = habitDefinitions.reduce(
      (n, h) => n + (entry?.habits?.[h.id] ? 1 : 0), 0
    );
    const habitTotal = habitDefinitions.length;
    days.push({
      date,
      key,
      taskRate: taskTotal > 0 ? taskDone / taskTotal : 0,
      habitRate: habitTotal > 0 ? habitDone / habitTotal : 0,
      taskDone,
      taskTotal,
      habitDone,
      habitTotal,
    });
  }
  return days;
}
