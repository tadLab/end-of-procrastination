import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './HamsterRestart.css';

export function HamsterRestart({ hamsters, setHamsters }) {
  const [newHamster, setNewHamster] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addHamster = () => {
    if (newHamster.trim()) {
      setHamsters([
        {
          id: uuidv4(),
          thought: newHamster.trim(),
          reframe: '',
          learned: '',
          nextTime: '',
          stopped: false,
          createdAt: new Date().toISOString()
        },
        ...hamsters
      ]);
      setNewHamster('');
    }
  };

  const updateHamster = (id, updates) => {
    setHamsters(hamsters.map(h =>
      h.id === id ? { ...h, ...updates } : h
    ));
  };

  const deleteHamster = (id) => {
    setHamsters(hamsters.filter(h => h.id !== id));
  };

  const toggleStopped = (id) => {
    setHamsters(hamsters.map(h =>
      h.id === id ? { ...h, stopped: !h.stopped } : h
    ));
  };

  return (
    <div className="hamster-restart">
      <div className="hamster-header">
        <h2>Hamster Restart</h2>
        <p className="hamster-subtitle">Stop negative thought loops and reframe them</p>
      </div>

      <div className="hamster-explanation">
        <h3>What are Inner Hamsters?</h3>
        <p>
          Hamsters are unwanted thought loops - repetitive negative thoughts like
          "I'm a failure", "I'll never make it", "Everyone is better than me".
        </p>
        <p>
          <strong>The process:</strong> Notice → Name → Stop → Reframe
        </p>
      </div>

      <div className="add-hamster">
        <input
          type="text"
          value={newHamster}
          onChange={(e) => setNewHamster(e.target.value)}
          placeholder="Write down a negative thought loop you've noticed..."
          onKeyDown={(e) => e.key === 'Enter' && addHamster()}
        />
        <button onClick={addHamster}>Catch Hamster</button>
      </div>

      <div className="hamsters-list">
        {hamsters.length === 0 ? (
          <div className="empty-state">
            <p>No hamsters caught yet.</p>
            <p className="hint">When you notice a negative thought loop, write it down here to work through it.</p>
          </div>
        ) : (
          hamsters.map(hamster => (
            <div
              key={hamster.id}
              className={`hamster-card ${hamster.stopped ? 'stopped' : ''}`}
            >
              <div className="hamster-thought">
                <span className="hamster-icon">{hamster.stopped ? '✓' : '🐹'}</span>
                <span className="thought-text">"{hamster.thought}"</span>
                <button
                  className="stop-btn"
                  onClick={() => toggleStopped(hamster.id)}
                >
                  {hamster.stopped ? 'Reactivate' : 'Mark Stopped'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteHamster(hamster.id)}
                >
                  ×
                </button>
              </div>

              {editingId === hamster.id ? (
                <div className="hamster-reframe-edit">
                  <div className="reframe-field">
                    <label>I learned:</label>
                    <input
                      type="text"
                      value={hamster.learned}
                      onChange={(e) => updateHamster(hamster.id, { learned: e.target.value })}
                      placeholder="What did this situation teach me?"
                    />
                  </div>
                  <div className="reframe-field">
                    <label>Next time I'll try:</label>
                    <input
                      type="text"
                      value={hamster.nextTime}
                      onChange={(e) => updateHamster(hamster.id, { nextTime: e.target.value })}
                      placeholder="What will I do differently?"
                    />
                  </div>
                  <div className="reframe-field">
                    <label>Reframed thought:</label>
                    <input
                      type="text"
                      value={hamster.reframe}
                      onChange={(e) => updateHamster(hamster.id, { reframe: e.target.value })}
                      placeholder="Turn this into a constructive thought..."
                    />
                  </div>
                  <button
                    className="done-editing-btn"
                    onClick={() => setEditingId(null)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="hamster-reframe-view">
                  {(hamster.learned || hamster.nextTime || hamster.reframe) ? (
                    <>
                      {hamster.learned && (
                        <p className="reframe-item">
                          <strong>Learned:</strong> {hamster.learned}
                        </p>
                      )}
                      {hamster.nextTime && (
                        <p className="reframe-item">
                          <strong>Next time:</strong> {hamster.nextTime}
                        </p>
                      )}
                      {hamster.reframe && (
                        <p className="reframe-item reframed">
                          <strong>Reframe:</strong> "{hamster.reframe}"
                        </p>
                      )}
                    </>
                  ) : null}
                  <button
                    className="edit-reframe-btn"
                    onClick={() => setEditingId(hamster.id)}
                  >
                    {(hamster.learned || hamster.nextTime || hamster.reframe) ? 'Edit Reframe' : 'Add Reframe'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="hamster-quote">
        <p>"The goal isn't to eliminate negative thoughts, but to notice them and choose not to follow them down the rabbit hole."</p>
        <span>— Petr Ludwig</span>
      </div>
    </div>
  );
}
