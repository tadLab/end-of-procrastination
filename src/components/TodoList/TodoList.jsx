import { useState } from 'react';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import './TodoList.css';

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

function sortTasks(tasks) {
  const incomplete = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);
  incomplete.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return [...incomplete, ...completed];
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return isBefore(parseISO(task.dueDate), startOfDay(new Date()));
}

export function TodoList({ tasks, onUpdate, disableAdd = false, ref }) {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('mid');
  const [newDueDate, setNewDueDate] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAdd = () => {
    const title = newTask.trim();
    if (!title || tasks.length >= 10) return;
    const id = 't_' + Date.now();
    onUpdate([...tasks, { id, title, completed: false, priority, subtasks: [], dueDate: newDueDate || null }]);
    setNewTask('');
    setPriority('mid');
    setNewDueDate('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setNewTask(''); e.target.blur(); }
    if (e.ctrlKey && e.key === '1') { e.preventDefault(); setPriority('high'); }
    if (e.ctrlKey && e.key === '2') { e.preventDefault(); setPriority('mid'); }
    if (e.ctrlKey && e.key === '3') { e.preventDefault(); setPriority('low'); }
  };

  const handleToggle = (id) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    onUpdate(tasks.filter(t => t.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    onUpdate(tasks.map(t => t.id === taskId ? {
      ...t,
      subtasks: (t.subtasks || []).map(s =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      )
    } : t));
  };

  const handleAddSubtask = (taskId) => {
    const title = newSubtask.trim();
    if (!title) return;
    const sub = { id: 'st_' + Date.now(), title, completed: false };
    onUpdate(tasks.map(t => t.id === taskId ? {
      ...t,
      subtasks: [...(t.subtasks || []), sub]
    } : t));
    setNewSubtask('');
  };

  const handleSubtaskDelete = (taskId, subtaskId) => {
    onUpdate(tasks.map(t => t.id === taskId ? {
      ...t,
      subtasks: (t.subtasks || []).filter(s => s.id !== subtaskId)
    } : t));
  };

  const sorted = sortTasks(tasks);

  return (
    <section className="todolist-section">
      <h2>Tasks</h2>
      <div className="todolist-items">
        {sorted.map(t => {
          const subs = t.subtasks || [];
          const subsDone = subs.filter(s => s.completed).length;
          const overdue = isOverdue(t);
          const isExpanded = expanded === t.id;

          return (
            <div key={t.id} className="todolist-item-wrapper">
              <div className={`todolist-item priority-${t.priority}${overdue ? ' overdue' : ''}`}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggle(t.id)}
                />
                <span className={t.completed ? 'completed' : ''}>{t.title}</span>
                {subs.length > 0 && (
                  <span className="subtask-progress">{subsDone}/{subs.length}</span>
                )}
                {overdue && <span className="overdue-badge">Overdue</span>}
                {t.dueDate && !overdue && (
                  <span className="due-badge">{t.dueDate}</span>
                )}
                {subs.length > 0 && (
                  <button
                    className="expand-btn"
                    onClick={() => setExpanded(isExpanded ? null : t.id)}
                    type="button"
                  >
                    {isExpanded ? '\u25B2' : '\u25BC'}
                  </button>
                )}
                {!disableAdd && (
                  <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                    &times;
                  </button>
                )}
              </div>
              {isExpanded && (
                <div className="subtask-list">
                  {subs.map(sub => (
                    <label key={sub.id} className="subtask-item">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleSubtaskToggle(t.id, sub.id)}
                      />
                      <span className={sub.completed ? 'completed' : ''}>{sub.title}</span>
                      {!disableAdd && (
                        <button
                          className="delete-btn"
                          onClick={(e) => { e.preventDefault(); handleSubtaskDelete(t.id, sub.id); }}
                        >
                          &times;
                        </button>
                      )}
                    </label>
                  ))}
                  {!disableAdd && (
                    <div className="subtask-add">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={e => setNewSubtask(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(t.id); } }}
                        placeholder="Add subtask..."
                        maxLength={80}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!disableAdd && (
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
            ref={ref}
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tasks.length >= 10 ? 'Max 10 tasks' : 'Add a task...'}
            disabled={tasks.length >= 10}
            maxLength={100}
          />
          <input
            type="date"
            className="due-date-input"
            value={newDueDate}
            onChange={e => setNewDueDate(e.target.value)}
            title="Due date (optional)"
          />
          <button onClick={handleAdd} disabled={tasks.length >= 10 || !newTask.trim()}>
            Add
          </button>
        </div>
      )}
    </section>
  );
}
