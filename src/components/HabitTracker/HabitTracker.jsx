import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getDaysInMonth,
  formatDate,
  getMonthName,
  getDayName,
  getDayNumber,
  isToday
} from '../../utils/dateHelpers';
import './HabitTracker.css';

export function HabitTracker({ habits, setHabits, habitLog, setHabitLog }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newHabitName, setNewHabitName] = useState('');

  const days = getDaysInMonth(currentDate);

  const addHabit = () => {
    if (newHabitName.trim()) {
      setHabits([...habits, { id: uuidv4(), name: newHabitName.trim() }]);
      setNewHabitName('');
    }
  };

  const removeHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    const newLog = { ...habitLog };
    Object.keys(newLog).forEach(date => {
      delete newLog[date][habitId];
    });
    setHabitLog(newLog);
  };

  const toggleHabit = (date, habitId) => {
    const dateKey = formatDate(date);
    const currentLog = habitLog[dateKey] || {};
    setHabitLog({
      ...habitLog,
      [dateKey]: {
        ...currentLog,
        [habitId]: !currentLog[habitId]
      }
    });
  };

  const isHabitDone = (date, habitId) => {
    const dateKey = formatDate(date);
    return habitLog[dateKey]?.[habitId] || false;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getHabitStreak = (habitId) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today is done
    const todayKey = formatDate(today);
    const todayDone = habitLog[todayKey]?.[habitId];

    // Start counting from today if done, otherwise from yesterday
    const startOffset = todayDone ? 0 : 1;

    for (let i = startOffset; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = formatDate(checkDate);
      if (habitLog[dateKey]?.[habitId]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="habit-tracker">
      <div className="habit-header">
        <h2>Habit Tracker</h2>
        <div className="month-nav">
          <button onClick={prevMonth}>&lt;</button>
          <span>{getMonthName(currentDate)}</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      <div className="add-habit">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Add new habit..."
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <div className="habit-table-container">
        <table className="habit-table">
          <thead>
            <tr>
              <th className="date-header">Date</th>
              {habits.map(habit => (
                <th key={habit.id} className="habit-header-cell">
                  <div className="habit-name">
                    <span>{habit.name}</span>
                    <button
                      className="remove-habit"
                      onClick={() => removeHabit(habit.id)}
                      title="Remove habit"
                    >
                      ×
                    </button>
                  </div>
                  <div className="habit-streak">
                    {getHabitStreak(habit.id)} day streak
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={formatDate(day)} className={isToday(day) ? 'today-row' : ''}>
                <td className="date-cell">
                  <span className="day-name">{getDayName(day)}</span>
                  <span className="day-number">{getDayNumber(day)}</span>
                </td>
                {habits.map(habit => (
                  <td
                    key={habit.id}
                    className={`habit-cell ${isHabitDone(day, habit.id) ? 'done' : ''}`}
                    onClick={() => toggleHabit(day, habit.id)}
                  >
                    {isHabitDone(day, habit.id) && <span className="check">✓</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {habits.length === 0 && (
        <p className="empty-state">Add your first habit to start tracking!</p>
      )}
    </div>
  );
}
