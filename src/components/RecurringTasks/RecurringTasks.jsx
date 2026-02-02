import { useState } from 'react';
import './RecurringTasks.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function RecurringTasks({ recurringTasks, onUpdate }) {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('mid');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [newWeekDay, setNewWeekDay] = useState(1);

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    const id = 'r_' + Date.now();
    onUpdate([...recurringTasks, {
      id,
      title,
      priority: newPriority,
      frequency: newFrequency,
      weekDay: newFrequency === 'weekly' ? newWeekDay : undefined,
    }]);
    setNewTitle('');
    setNewPriority('mid');
    setNewFrequency('daily');
  };

  const handleRemove = (id) => {
    onUpdate(recurringTasks.filter(r => r.id !== id));
  };

  return (
    <div className="recurring-manage">
      {recurringTasks.length === 0 && (
        <p className="recurring-empty">No recurring tasks defined.</p>
      )}
      {recurringTasks.map(r => (
        <div key={r.id} className="recurring-row">
          <span className={`recurring-dot dot-${r.priority}`} />
          <span className="recurring-title">{r.title}</span>
          <span className="recurring-freq">
            {r.frequency === 'daily' ? 'Daily' : DAY_NAMES[r.weekDay]}
          </span>
          <button className="recurring-remove" onClick={() => handleRemove(r.id)}>
            &times;
          </button>
        </div>
      ))}
      <div className="recurring-add">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="Recurring task..."
          maxLength={80}
        />
        <div className="recurring-options">
          <div className="recurring-priority-sel">
            {['high', 'mid', 'low'].map(p => (
              <button
                key={p}
                className={`priority-dot dot-${p} ${newPriority === p ? 'active' : ''}`}
                onClick={() => setNewPriority(p)}
                type="button"
              />
            ))}
          </div>
          <select
            value={newFrequency}
            onChange={e => setNewFrequency(e.target.value)}
            className="recurring-freq-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {newFrequency === 'weekly' && (
            <select
              value={newWeekDay}
              onChange={e => setNewWeekDay(Number(e.target.value))}
              className="recurring-day-select"
            >
              {DAY_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          )}
          <button className="recurring-add-btn" onClick={handleAdd} disabled={!newTitle.trim()}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
