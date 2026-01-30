import { useLocalStorage } from './hooks/useLocalStorage';
import { getTodayKey } from './utils/dateHelpers';
import { format } from 'date-fns';
import { Habits } from './components/Habits/Habits';
import { Priorities } from './components/Priorities/Priorities';
import { TodoList } from './components/TodoList/TodoList';
import { CalendarPlaceholder } from './components/CalendarPlaceholder/CalendarPlaceholder';
import './App.css';

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

const DEFAULT_DAY = {
  tasks: [],
  habits: {},
};

function deriveTopPriorities(tasks) {
  return tasks
    .filter(t => !t.completed)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);
}

function App() {
  const todayKey = getTodayKey();
  const [dayData, setDayData] = useLocalStorage('dayData', {});
  const [habitDefinitions, setHabitDefinitions] = useLocalStorage('habitDefinitions', []);

  const today = dayData[todayKey] || DEFAULT_DAY;

  const updateToday = (patch) => {
    setDayData(prev => ({
      ...prev,
      [todayKey]: { ...DEFAULT_DAY, ...prev[todayKey], ...patch },
    }));
  };

  const handleHabitToggle = (habitId) => {
    const currentHabits = today.habits;
    updateToday({ habits: { ...currentHabits, [habitId]: !currentHabits[habitId] } });
  };

  const handleTaskToggle = (taskId) => {
    const updated = today.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateToday({ tasks: updated });
  };

  const topPriorities = deriveTopPriorities(today.tasks);
  const now = new Date();

  return (
    <div className="app">
      <div className="app-noise" />
      <header className="app-header">
        <div className="greeting">
          <h1>{format(now, 'EEEE')}</h1>
          <time className="today-date">{format(now, 'MMMM d, yyyy')}</time>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="card card-focus">
          <Priorities
            topPriorities={topPriorities}
            onToggle={handleTaskToggle}
          />
        </section>

        <section className="card card-habits">
          <Habits
            habits={today.habits}
            onToggle={handleHabitToggle}
            habitDefinitions={habitDefinitions}
            onUpdateDefinitions={setHabitDefinitions}
          />
        </section>

        <section className="card card-tasks">
          <TodoList
            tasks={today.tasks}
            onUpdate={(tasks) => updateToday({ tasks })}
          />
        </section>

        <section className="card card-calendar">
          <CalendarPlaceholder />
        </section>
      </main>

      <footer className="app-footer">
        <p>Stored locally on this device</p>
      </footer>
    </div>
  );
}

export default App;
