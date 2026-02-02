import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getTodayKey, getDateKey, getWeekDays, addDays, subDays } from './utils/dateHelpers';
import { getDay } from 'date-fns';
import { migrateIfNeeded } from './utils/migrateData';
import { computeHabitStreaks, computeWeeklyCompletion } from './utils/analytics';
import { DayNav } from './components/DayNav/DayNav';
import { WeekBar } from './components/WeekBar/WeekBar';
import { Habits } from './components/Habits/Habits';
import { Priorities } from './components/Priorities/Priorities';
import { TodoList } from './components/TodoList/TodoList';
import { RecurringTasks } from './components/RecurringTasks/RecurringTasks';
import { WeeklyStats } from './components/WeeklyStats/WeeklyStats';
import { EveningReview } from './components/EveningReview/EveningReview';
import './App.css';

// Run migration before any React rendering
migrateIfNeeded();

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

const DEFAULT_DAY = {
  tasks: [],
  habits: {},
  review: { whatWorked: '', whatToImprove: '' },
};

const DEFAULT_REVIEW = { whatWorked: '', whatToImprove: '' };

function deriveTopPriorities(tasks) {
  return tasks
    .filter(t => !t.completed)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedKey = getDateKey(selectedDate);
  const todayKey = getTodayKey();
  const viewingToday = selectedKey === todayKey;

  const [dayData, setDayData] = useLocalStorage('dayData', {});
  const [habitDefinitions, setHabitDefinitions] = useLocalStorage('habitDefinitions', []);
  const [recurringTasks, setRecurringTasks] = useLocalStorage('recurringTasks', []);
  const [lastPopulatedDate, setLastPopulatedDate] = useLocalStorage('lastPopulatedDate', '');
  const [showRecurring, setShowRecurring] = useState(false);

  const taskInputRef = useRef(null);

  const currentDay = dayData[selectedKey] || DEFAULT_DAY;

  const updateDay = (patch) => {
    setDayData(prev => ({
      ...prev,
      [selectedKey]: { ...DEFAULT_DAY, ...prev[selectedKey], ...patch },
    }));
  };

  // Auto-populate recurring tasks for today
  useEffect(() => {
    if (lastPopulatedDate === todayKey) return;
    if (recurringTasks.length === 0) {
      setLastPopulatedDate(todayKey);
      return;
    }

    const dayOfWeek = getDay(new Date());
    const toAdd = recurringTasks.filter(r => {
      if (r.frequency === 'daily') return true;
      if (r.frequency === 'weekly' && r.weekDay === dayOfWeek) return true;
      return false;
    });

    if (toAdd.length === 0) {
      setLastPopulatedDate(todayKey);
      return;
    }

    const existing = dayData[todayKey]?.tasks || [];
    const existingTitles = new Set(existing.map(t => t.title));
    const newTasks = toAdd
      .filter(r => !existingTitles.has(r.title))
      .map((r, i) => ({
        id: 't_' + Date.now() + '_' + i,
        title: r.title,
        completed: false,
        priority: r.priority,
        subtasks: [],
        dueDate: null,
      }));

    if (newTasks.length > 0) {
      setDayData(prev => ({
        ...prev,
        [todayKey]: {
          ...DEFAULT_DAY,
          ...prev[todayKey],
          tasks: [...(prev[todayKey]?.tasks || []), ...newTasks],
        },
      }));
    }
    setLastPopulatedDate(todayKey);
  }, [todayKey, lastPopulatedDate, recurringTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') e.target.blur();
        return;
      }
      switch (e.key) {
        case 'n':
          e.preventDefault();
          taskInputRef.current?.focus();
          break;
        case 'ArrowLeft':
          setSelectedDate(prev => subDays(prev, 1));
          break;
        case 'ArrowRight':
          setSelectedDate(prev => addDays(prev, 1));
          break;
        case 't':
          setSelectedDate(new Date());
          break;
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHabitToggle = (habitId) => {
    const currentHabits = currentDay.habits;
    updateDay({ habits: { ...currentHabits, [habitId]: !currentHabits[habitId] } });
  };

  const handleTaskToggle = (taskId) => {
    const updated = currentDay.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateDay({ tasks: updated });
  };

  const topPriorities = deriveTopPriorities(currentDay.tasks);
  const weekDays = getWeekDays(selectedDate);
  const weekData = computeWeeklyCompletion(dayData, habitDefinitions, new Date());
  const streaks = computeHabitStreaks(dayData, habitDefinitions, new Date());
  const review = currentDay.review || DEFAULT_REVIEW;

  return (
    <div className="app">
      <div className="app-noise" />
      <header className="app-header">
        <DayNav
          selectedDate={selectedDate}
          onNavigate={setSelectedDate}
          viewingToday={viewingToday}
        />
      </header>

      <WeekBar
        weekDays={weekDays}
        dayData={dayData}
        habitDefinitions={habitDefinitions}
        selectedDate={selectedDate}
        onSelectDay={setSelectedDate}
      />

      <main className="dashboard-grid">
        <section className="card card-focus">
          <Priorities
            topPriorities={topPriorities}
            onToggle={handleTaskToggle}
          />
        </section>

        <section className="card card-habits">
          <Habits
            habits={currentDay.habits}
            onToggle={handleHabitToggle}
            habitDefinitions={habitDefinitions}
            onUpdateDefinitions={setHabitDefinitions}
            disableManage={!viewingToday}
          />
        </section>

        <section className="card card-tasks">
          <div className="tasks-header">
            <TodoList
              tasks={currentDay.tasks}
              onUpdate={(tasks) => updateDay({ tasks })}
              disableAdd={!viewingToday}
              ref={taskInputRef}
            />
            {viewingToday && (
              <button
                className="recurring-toggle-btn"
                onClick={() => setShowRecurring(!showRecurring)}
              >
                {showRecurring ? 'Hide Recurring' : 'Recurring'}
              </button>
            )}
          </div>
          {showRecurring && viewingToday && (
            <div className="recurring-panel">
              <RecurringTasks
                recurringTasks={recurringTasks}
                onUpdate={setRecurringTasks}
              />
            </div>
          )}
        </section>

        <section className="card card-stats">
          <WeeklyStats
            weekData={weekData}
            streaks={streaks}
            habitDefinitions={habitDefinitions}
          />
        </section>

        <section className="card card-review">
          <EveningReview
            tasks={currentDay.tasks}
            habits={currentDay.habits}
            habitDefinitions={habitDefinitions}
            review={review}
            onUpdateReview={(review) => updateDay({ review })}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Stored locally on this device</p>
      </footer>
    </div>
  );
}

export default App;
