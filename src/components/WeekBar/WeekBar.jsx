import { format, isSameDay } from 'date-fns';
import { isToday } from '../../utils/dateHelpers';
import './WeekBar.css';

function getDayRate(dayData, dateKey, habitDefinitions) {
  const entry = dayData[dateKey];
  if (!entry) return 0;
  const tasks = entry.tasks || [];
  const taskTotal = tasks.length;
  const taskDone = tasks.filter(t => t.completed).length;
  const habitTotal = habitDefinitions.length;
  const habitDone = habitDefinitions.reduce(
    (n, h) => n + (entry.habits?.[h.id] ? 1 : 0), 0
  );
  const total = taskTotal + habitTotal;
  if (total === 0) return 0;
  return (taskDone + habitDone) / total;
}

export function WeekBar({ weekDays, dayData, habitDefinitions, selectedDate, onSelectDay }) {
  return (
    <div className="week-bar">
      {weekDays.map(day => {
        const key = format(day, 'yyyy-MM-dd');
        const rate = getDayRate(dayData, key, habitDefinitions);
        const isSelected = isSameDay(day, selectedDate);
        const today = isToday(day);
        const hasData = !!dayData[key];

        let dotClass = 'wb-dot';
        if (isSelected) dotClass += ' selected';
        if (today) dotClass += ' today';

        let fillColor = 'rgba(255,255,255,0.1)';
        if (hasData) {
          if (rate >= 0.8) fillColor = '#30d158';
          else if (rate >= 0.4) fillColor = '#ffd60a';
          else fillColor = 'rgba(255,255,255,0.25)';
        }

        return (
          <button key={key} className={dotClass} onClick={() => onSelectDay(day)}>
            <span className="wb-label">{format(day, 'EEEEE')}</span>
            <span
              className="wb-fill"
              style={{
                height: `${Math.max(rate * 100, hasData ? 8 : 0)}%`,
                background: fillColor,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
