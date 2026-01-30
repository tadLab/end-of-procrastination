import './Priorities.css';

const PRIORITY_COLORS = {
  high: '#ff453a',
  mid: '#007aff',
  low: '#30d158',
};

export function Priorities({ topPriorities, onToggle }) {
  const slots = [0, 1, 2];

  return (
    <section className="priorities-section">
      <h2>Top 3 Focus</h2>
      <div className="priorities-list">
        {slots.map(i => {
          const task = topPriorities[i];
          if (!task) {
            return (
              <div key={`empty-${i}`} className="priority-item empty">
                <span className="priority-indicator" />
                <span className="priority-placeholder">—</span>
              </div>
            );
          }
          return (
            <div key={task.id} className="priority-item">
              <span
                className="priority-indicator"
                style={{ background: PRIORITY_COLORS[task.priority] }}
              />
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
              />
              <span className={`priority-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
