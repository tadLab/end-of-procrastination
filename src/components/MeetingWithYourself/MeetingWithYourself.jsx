import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './MeetingWithYourself.css';

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeekKey(date) {
  return `${date.getFullYear()}-W${getWeekNumber(date).toString().padStart(2, '0')}`;
}

function getWeekDisplay(weekKey) {
  const [year, week] = weekKey.split('-W');
  return `Week ${parseInt(week)}, ${year}`;
}

export function MeetingWithYourself({ meetings, setMeetings }) {
  const [selectedWeek, setSelectedWeek] = useState(getWeekKey(new Date()));
  const [newPriority, setNewPriority] = useState('');

  const currentMeeting = meetings[selectedWeek] || {
    wentWell: '',
    didntGoWell: '',
    whyDidntGoWell: '',
    willChange: '',
    priorities: []
  };

  const updateMeeting = (field, value) => {
    setMeetings({
      ...meetings,
      [selectedWeek]: {
        ...currentMeeting,
        [field]: value
      }
    });
  };

  const addPriority = () => {
    if (newPriority.trim()) {
      const priorities = [...(currentMeeting.priorities || [])];
      priorities.push({
        id: uuidv4(),
        text: newPriority.trim(),
        completed: false
      });
      updateMeeting('priorities', priorities);
      setNewPriority('');
    }
  };

  const togglePriority = (id) => {
    const priorities = currentMeeting.priorities.map(p =>
      p.id === id ? { ...p, completed: !p.completed } : p
    );
    updateMeeting('priorities', priorities);
  };

  const deletePriority = (id) => {
    const priorities = currentMeeting.priorities.filter(p => p.id !== id);
    updateMeeting('priorities', priorities);
  };

  const goToPreviousWeek = () => {
    const [year, week] = selectedWeek.split('-W');
    const date = new Date(year, 0, 1 + (parseInt(week) - 1) * 7);
    date.setDate(date.getDate() - 7);
    setSelectedWeek(getWeekKey(date));
  };

  const goToNextWeek = () => {
    const [year, week] = selectedWeek.split('-W');
    const date = new Date(year, 0, 1 + (parseInt(week) - 1) * 7);
    date.setDate(date.getDate() + 7);
    setSelectedWeek(getWeekKey(date));
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(getWeekKey(new Date()));
  };

  const isCurrentWeek = selectedWeek === getWeekKey(new Date());

  return (
    <div className="meeting-with-yourself">
      <div className="meeting-header">
        <h2>Meeting with Yourself</h2>
        <p className="meeting-subtitle">Weekly reflection to grow and improve</p>
      </div>

      <div className="week-navigation">
        <button onClick={goToPreviousWeek}>&lt;</button>
        <span className="current-week">{getWeekDisplay(selectedWeek)}</span>
        <button onClick={goToNextWeek}>&gt;</button>
        {!isCurrentWeek && (
          <button className="current-week-btn" onClick={goToCurrentWeek}>
            This Week
          </button>
        )}
      </div>

      <div className="meeting-sections">
        <div className="meeting-section positive">
          <h3>What went well?</h3>
          <textarea
            value={currentMeeting.wentWell || ''}
            onChange={(e) => updateMeeting('wentWell', e.target.value)}
            placeholder="Celebrate your wins, big or small..."
            rows={3}
          />
        </div>

        <div className="meeting-section negative">
          <h3>What didn't go well?</h3>
          <textarea
            value={currentMeeting.didntGoWell || ''}
            onChange={(e) => updateMeeting('didntGoWell', e.target.value)}
            placeholder="Be honest about challenges..."
            rows={3}
          />
        </div>

        <div className="meeting-section analysis">
          <h3>Why didn't it go well?</h3>
          <textarea
            value={currentMeeting.whyDidntGoWell || ''}
            onChange={(e) => updateMeeting('whyDidntGoWell', e.target.value)}
            placeholder="Dig into the root causes..."
            rows={3}
          />
        </div>

        <div className="meeting-section change">
          <h3>What will I change next week?</h3>
          <textarea
            value={currentMeeting.willChange || ''}
            onChange={(e) => updateMeeting('willChange', e.target.value)}
            placeholder="Specific, actionable changes..."
            rows={3}
          />
        </div>

        <div className="meeting-section priorities">
          <h3>Top priorities for next week</h3>
          <div className="add-priority">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="Add a priority..."
              onKeyDown={(e) => e.key === 'Enter' && addPriority()}
            />
            <button onClick={addPriority}>Add</button>
          </div>

          <div className="priorities-list">
            {(currentMeeting.priorities || []).map((priority, index) => (
              <div
                key={priority.id}
                className={`priority-item ${priority.completed ? 'completed' : ''}`}
              >
                <span className="priority-number">{index + 1}</span>
                <button
                  className="priority-checkbox"
                  onClick={() => togglePriority(priority.id)}
                >
                  {priority.completed ? '✓' : ''}
                </button>
                <span className="priority-text">{priority.text}</span>
                <button
                  className="delete-priority"
                  onClick={() => deletePriority(priority.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="meeting-quote">
        <p>"The weekly meeting with yourself is the most important meeting you'll ever have."</p>
        <span>— Petr Ludwig</span>
      </div>
    </div>
  );
}
