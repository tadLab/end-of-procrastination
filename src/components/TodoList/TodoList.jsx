import { useState } from 'react';
import './TodoList.css';

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

function sortTasks(tasks) {
  const incomplete = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);
  incomplete.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return [...incomplete, ...completed];
}

export function TodoList({ tasks, onUpdate }) {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('mid');

  const handleAdd = () => {
    const title = newTask.trim();
    if (!title || tasks.length >= 10) return;
    const id = 't_' + Date.now();
    onUpdate([...tasks, { id, title, completed: false, priority }]);
    setNewTask('');
    setPriority('mid');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleToggle = (id) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const sorted = sortTasks(tasks);

  return (
    <section className="todolist-section">
      <h2>Tasks</h2>
      <div className="todolist-items">
        {sorted.map(t => (
          <div key={t.id} className={`todolist-item priority-${t.priority}`}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => handleToggle(t.id)}
            />
            <span className={t.completed ? 'completed' : ''}>{t.title}</span>
            <button className="delete-btn" onClick={() => handleDelete(t.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="todolist-add">
        <div className="priority-selector">
          {['high', 'mid', 'low'].map(p => (
            <button
              key={p}
              className={`priority-dot dot-${p} ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
              title={`${p} priority`}
              type="button"
            />
          ))}
        </div>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tasks.length >= 10 ? 'Max 10 tasks' : 'Add a task...'}
          disabled={tasks.length >= 10}
          maxLength={100}
        />
        <button onClick={handleAdd} disabled={tasks.length >= 10 || !newTask.trim()}>
          Add
        </button>
      </div>
    </section>
  );
}
