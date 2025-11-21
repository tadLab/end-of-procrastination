import { useState, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { HabitTracker } from './components/HabitTracker/HabitTracker';
import { TodoAll } from './components/TodoAll/TodoAll';
import { FlowSheet } from './components/FlowSheet/FlowSheet';
import { HamsterRestart } from './components/HamsterRestart/HamsterRestart';
import { MeetingWithYourself } from './components/MeetingWithYourself/MeetingWithYourself';
import { InnerGame } from './components/InnerGame/InnerGame';
import { exportToJSON, importFromJSON } from './utils/storage';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('habits');
  const fileInputRef = useRef(null);

  // Habit Tracker State
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [habitLog, setHabitLog] = useLocalStorage('habitLog', {});

  // Todo All State
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [connections, setConnections] = useLocalStorage('connections', []);

  // Flow Sheet State
  const [flowEntries, setFlowEntries] = useLocalStorage('flowEntries', {});

  // Hamster Restart State
  const [hamsters, setHamsters] = useLocalStorage('hamsters', []);

  // Meeting with Yourself State
  const [meetings, setMeetings] = useLocalStorage('meetings', {});

  // Inner Game State
  const [reframes, setReframes] = useLocalStorage('reframes', []);

  const handleExport = () => {
    const data = {
      habits,
      habitLog,
      tasks,
      connections,
      flowEntries,
      hamsters,
      meetings,
      reframes,
      exportedAt: new Date().toISOString()
    };
    exportToJSON(data, 'end-of-procrastination-data.json');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await importFromJSON(file);
        if (data.habits) setHabits(data.habits);
        if (data.habitLog) setHabitLog(data.habitLog);
        if (data.tasks) setTasks(data.tasks);
        if (data.connections) setConnections(data.connections);
        if (data.flowEntries) setFlowEntries(data.flowEntries);
        if (data.hamsters) setHamsters(data.hamsters);
        if (data.meetings) setMeetings(data.meetings);
        if (data.reframes) setReframes(data.reframes);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import: ' + error.message);
      }
    }
    e.target.value = '';
  };

  const sections = [
    { id: 'habits', label: 'Habits' },
    { id: 'todos', label: 'To Do All' },
    { id: 'flow', label: 'Flow Sheet' },
    { id: 'hamster', label: 'Hamster Restart' },
    { id: 'meeting', label: 'Meeting' },
    { id: 'innergame', label: 'Inner Game' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>End of Procrastination</h1>
          <span className="credits">Inspired by Petr Ludwig's book</span>
        </div>
        <nav className="main-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div className="data-actions">
          <button onClick={handleExport} className="export-btn">
            Export
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="import-btn">
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <main className="app-main">
        {activeSection === 'habits' && (
          <HabitTracker
            habits={habits}
            setHabits={setHabits}
            habitLog={habitLog}
            setHabitLog={setHabitLog}
          />
        )}

        {activeSection === 'todos' && (
          <TodoAll
            tasks={tasks}
            setTasks={setTasks}
            connections={connections}
            setConnections={setConnections}
          />
        )}

        {activeSection === 'flow' && (
          <FlowSheet
            flowEntries={flowEntries}
            setFlowEntries={setFlowEntries}
          />
        )}

        {activeSection === 'hamster' && (
          <HamsterRestart
            hamsters={hamsters}
            setHamsters={setHamsters}
          />
        )}

        {activeSection === 'meeting' && (
          <MeetingWithYourself
            meetings={meetings}
            setMeetings={setMeetings}
          />
        )}

        {activeSection === 'innergame' && (
          <InnerGame
            reframes={reframes}
            setReframes={setReframes}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Based on <strong>"The End of Procrastination"</strong> by <strong>Petr Ludwig</strong>
        </p>
        <p className="footer-note">Your data is stored locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
