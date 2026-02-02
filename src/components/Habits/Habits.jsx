import { useState } from 'react';
import './Habits.css';

export function Habits({ habits, onToggle, habitDefinitions, onUpdateDefinitions, disableManage = false }) {
  const [managing, setManaging] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = () => {
    const name = newHabit.trim();
    if (!name || habitDefinitions.length >= 6) return;
    const id = 'h_' + Date.now();
    onUpdateDefinitions([...habitDefinitions, { id, name }]);
    setNewHabit('');
  };

  const handleRemove = (id) => {
    onUpdateDefinitions(habitDefinitions.filter(h => h.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <section className="habits-section">
      <div className="section-header">
        <h2>Habits</h2>
        {!disableManage && (
          <button
            className="manage-btn"
            onClick={() => setManaging(!managing)}
          >
            {managing ? 'Done' : 'Manage'}
          </button>
        )}
      </div>

      {managing ? (
        <div className="habits-manage">
          {habitDefinitions.map(h => (
            <div key={h.id} className="habit-manage-row">
              <span>{h.name}</span>
              <button className="remove-btn" onClick={() => handleRemove(h.id)}>Remove</button>
            </div>
          ))}
          {habitDefinitions.length < 6 && (
            <div className="habit-add-row">
              <input
                type="text"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="New habit name..."
                maxLength={40}
              />
              <button className="add-btn" onClick={handleAdd} disabled={!newHabit.trim()}>
                Add
              </button>
            </div>
          )}
          {habitDefinitions.length >= 6 && (
            <p className="limit-note">Maximum 6 habits reached.</p>
          )}
        </div>
      ) : (
        <div className="habits-grid">
          {habitDefinitions.length === 0 ? (
            <p className="empty-note">No habits defined. Click "Manage" to add some.</p>
          ) : (
            habitDefinitions.map(h => (
              <label key={h.id} className="habit-item">
                <input
                  type="checkbox"
                  checked={!!habits[h.id]}
                  onChange={() => onToggle(h.id)}
                />
                <span className={habits[h.id] ? 'done' : ''}>{h.name}</span>
              </label>
            ))
          )}
        </div>
      )}
    </section>
  );
}
