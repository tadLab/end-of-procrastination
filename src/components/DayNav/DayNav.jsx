import { format } from 'date-fns';
import { addDays, subDays } from '../../utils/dateHelpers';
import './DayNav.css';

export function DayNav({ selectedDate, onNavigate, viewingToday }) {
  return (
    <div className="day-nav">
      <div className="day-nav-row">
        <button className="nav-arrow" onClick={() => onNavigate(subDays(selectedDate, 1))}>
          &#8249;
        </button>
        <div className="nav-date-info">
          <h1>{format(selectedDate, 'EEEE')}</h1>
          <time className="nav-date">{format(selectedDate, 'MMMM d, yyyy')}</time>
        </div>
        <button className="nav-arrow" onClick={() => onNavigate(addDays(selectedDate, 1))}>
          &#8250;
        </button>
      </div>
      {!viewingToday && (
        <button className="today-btn" onClick={() => onNavigate(new Date())}>
          Today
        </button>
      )}
    </div>
  );
}
