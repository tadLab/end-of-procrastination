import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Xarrow, { Xwrapper } from 'react-xarrows';
import './TodoAll.css';

const PRIORITIES = {
  high: { color: '#ef4444', label: 'High' },
  medium: { color: '#3b82f6', label: 'Medium' },
  low: { color: '#22c55e', label: 'Low' }
};

// Convert time string "HH:MM" to minutes for comparison
const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export function TodoAll({ tasks, setTasks, connections, setConnections }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [manualConnectMode, setManualConnectMode] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const containerRef = useRef(null);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: uuidv4(),
        text: newTaskText.trim(),
        priority: newTaskPriority,
        time: newTaskTime,
        completed: false,
        position: {
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 50
        }
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setNewTaskTime('');
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setConnections(connections.filter(c => c.from !== taskId && c.to !== taskId));
  };

  // Auto-connect tasks by time
  const autoConnectByTime = () => {
    // Get tasks with time, sorted by time
    const tasksWithTime = tasks
      .filter(t => t.time && !t.completed)
      .map(t => ({ ...t, minutes: timeToMinutes(t.time) }))
      .sort((a, b) => a.minutes - b.minutes);

    if (tasksWithTime.length < 2) {
      alert('Need at least 2 tasks with time set to auto-connect');
      return;
    }

    // Create connections between consecutive tasks
    const newConnections = [];
    for (let i = 0; i < tasksWithTime.length - 1; i++) {
      const from = tasksWithTime[i].id;
      const to = tasksWithTime[i + 1].id;

      // Check if connection already exists
      const exists = connections.some(
        c => (c.from === from && c.to === to)
      );

      if (!exists) {
        newConnections.push({ from, to });
      }
    }

    if (newConnections.length > 0) {
      setConnections([...connections, ...newConnections]);
    }

    // Also arrange tasks visually by time
    arrangeTasksByTime(tasksWithTime);
  };

  // Arrange tasks visually in a flow
  const arrangeTasksByTime = (sortedTasks) => {
    const startX = 80;
    const startY = 80;
    const spacingX = 180;
    const spacingY = 150;
    const tasksPerRow = 4;

    const updatedTasks = tasks.map(task => {
      const sortedIndex = sortedTasks.findIndex(t => t.id === task.id);
      if (sortedIndex === -1) return task;

      const row = Math.floor(sortedIndex / tasksPerRow);
      const col = sortedIndex % tasksPerRow;

      return {
        ...task,
        position: {
          x: startX + col * spacingX,
          y: startY + row * spacingY
        }
      };
    });

    setTasks(updatedTasks);
  };

  // Manual connection between two tasks
  const handleManualConnect = (taskId) => {
    if (!manualConnectMode) return;

    if (connectingFrom === null) {
      setConnectingFrom(taskId);
    } else if (connectingFrom !== taskId) {
      // Check if connection already exists (in either direction)
      const exists = connections.some(
        c => (c.from === connectingFrom && c.to === taskId) ||
             (c.from === taskId && c.to === connectingFrom)
      );

      if (!exists) {
        setConnections([...connections, { from: connectingFrom, to: taskId }]);
      }
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  };

  const toggleManualConnectMode = () => {
    setManualConnectMode(!manualConnectMode);
    setConnectingFrom(null);
    setSelectedTask(null);
  };

  const removeConnection = (from, to) => {
    setConnections(connections.filter(c => !(c.from === from && c.to === to)));
  };

  const clearAllConnections = () => {
    setConnections([]);
  };

  const updateTaskPosition = (taskId, newPosition) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, position: newPosition } : t
    ));
  };

  const handleDrag = (e, taskId) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 60;
    updateTaskPosition(taskId, { x: Math.max(0, x), y: Math.max(0, y) });
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    ));
    setEditingTask(null);
  };

  const clearCompleted = () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    setTasks(tasks.filter(t => !t.completed));
    setConnections(connections.filter(c =>
      !completedIds.includes(c.from) && !completedIds.includes(c.to)
    ));
  };

  const handleTaskClick = (taskId) => {
    if (manualConnectMode) {
      handleManualConnect(taskId);
    } else {
      setSelectedTask(taskId === selectedTask ? null : taskId);
    }
  };

  return (
    <div className="todo-all">
      <div className="todo-header">
        <h2>To Do All</h2>
        <p className="todo-subtitle">Plan your day visually with connected tasks</p>
      </div>

      <div className="todo-actions">
        <button className="auto-connect-btn" onClick={autoConnectByTime}>
          Auto Connect by Time
        </button>
        <button
          className={`manual-connect-btn ${manualConnectMode ? 'active' : ''}`}
          onClick={toggleManualConnectMode}
        >
          {manualConnectMode ? (connectingFrom ? 'Click 2nd task...' : 'Click 1st task...') : 'Manual Connect'}
        </button>
        <button className="clear-connections-btn" onClick={clearAllConnections}>
          Clear Arrows
        </button>
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Done
        </button>
      </div>

      {manualConnectMode && (
        <div className="connect-instructions">
          {connectingFrom
            ? 'Now click the task you want to connect TO (the arrow will point to it)'
            : 'Click the task you want to connect FROM (the arrow will start here)'}
        </div>
      )}

      <div className="add-task">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add new task..."
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <input
          type="time"
          value={newTaskTime}
          onChange={(e) => setNewTaskTime(e.target.value)}
          className="time-input"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-canvas" ref={containerRef}>
        <Xwrapper>
          {tasks.map(task => (
            <div
              key={task.id}
              id={task.id}
              className={`task-circle ${task.completed ? 'completed' : ''} ${connectingFrom === task.id ? 'connecting-from' : ''} ${manualConnectMode && connectingFrom && connectingFrom !== task.id ? 'connect-target' : ''} ${manualConnectMode ? 'connect-mode' : ''}`}
              style={{
                left: task.position.x,
                top: task.position.y,
                borderColor: PRIORITIES[task.priority].color,
                backgroundColor: task.completed ? '#1a1a2e' : `${PRIORITIES[task.priority].color}20`
              }}
              draggable={!manualConnectMode}
              onDragEnd={(e) => handleDrag(e, task.id)}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-content">
                {editingTask === task.id ? (
                  <input
                    type="text"
                    defaultValue={task.text}
                    autoFocus
                    onBlur={(e) => updateTask(task.id, { text: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task.id, { text: e.target.value });
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="edit-input"
                  />
                ) : (
                  <span className="task-text">{task.text}</span>
                )}
                {task.time && <span className="task-time">{task.time}</span>}
              </div>

              {selectedTask === task.id && !manualConnectMode && (
                <div className="task-menu" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? '↩ Undo' : '✓ Done'}
                  </button>
                  <button onClick={() => setEditingTask(task.id)}>✏ Edit</button>
                  <div className="time-edit">
                    <input
                      type="time"
                      value={task.time || ''}
                      onChange={(e) => updateTask(task.id, { time: e.target.value })}
                    />
                  </div>
                  <select
                    value={task.priority}
                    onChange={(e) => updateTask(task.id, { priority: e.target.value })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑</button>
                </div>
              )}
            </div>
          ))}

          {connections.map((conn, idx) => (
            <Xarrow
              key={`${conn.from}-${conn.to}-${idx}`}
              start={conn.from}
              end={conn.to}
              color="#8b5cf6"
              strokeWidth={2}
              headSize={6}
              path="smooth"
              curveness={0.3}
              showHead={true}
            />
          ))}
        </Xwrapper>

        {tasks.length === 0 && (
          <p className="empty-state">
            Add tasks with times, then click "Auto Connect by Time" to create your daily flow!
          </p>
        )}
      </div>

      <div className="task-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: PRIORITIES.high.color }}></span>
          High Priority
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: PRIORITIES.medium.color }}></span>
          Medium Priority
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: PRIORITIES.low.color }}></span>
          Low Priority
        </span>
        <span className="legend-item">
          <span className="legend-arrow">→</span>
          Task Flow
        </span>
      </div>
    </div>
  );
}
