import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './InnerGame.css';

const REFRAME_EXAMPLES = [
  { original: "I failed", reframed: "I got feedback and learned X" },
  { original: "I'm not good enough", reframed: "I'm learning and improving" },
  { original: "This is too hard", reframed: "This is challenging and will help me grow" },
  { original: "I made a mistake", reframed: "I discovered what doesn't work" },
  { original: "They rejected me", reframed: "This wasn't the right fit, better options await" },
];

export function InnerGame({ reframes, setReframes }) {
  const [situation, setSituation] = useState('');
  const [negativeStory, setNegativeStory] = useState('');
  const [newStory, setNewStory] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addReframe = () => {
    if (situation.trim() && negativeStory.trim()) {
      setReframes([
        {
          id: uuidv4(),
          situation: situation.trim(),
          negativeStory: negativeStory.trim(),
          newStory: newStory.trim(),
          createdAt: new Date().toISOString()
        },
        ...reframes
      ]);
      setSituation('');
      setNegativeStory('');
      setNewStory('');
    }
  };

  const updateReframe = (id, updates) => {
    setReframes(reframes.map(r =>
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  const deleteReframe = (id) => {
    setReframes(reframes.filter(r => r.id !== id));
  };

  return (
    <div className="inner-game">
      <div className="inner-game-header">
        <h2>Inner Game</h2>
        <p className="inner-game-subtitle">Change the story you tell yourself</p>
      </div>

      <div className="inner-game-explanation">
        <h3>How it works</h3>
        <p>
          Every event is neutral until we assign meaning to it. The Inner Game is about
          consciously choosing empowering interpretations instead of limiting ones.
        </p>
        <div className="examples">
          <h4>Examples:</h4>
          {REFRAME_EXAMPLES.map((example, idx) => (
            <div key={idx} className="example-row">
              <span className="original">"{example.original}"</span>
              <span className="arrow">→</span>
              <span className="reframed">"{example.reframed}"</span>
            </div>
          ))}
        </div>
      </div>

      <div className="add-reframe">
        <h3>Add a New Reframe</h3>

        <div className="reframe-field">
          <label>What happened? (The situation)</label>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Describe the event objectively..."
          />
        </div>

        <div className="reframe-field">
          <label>What negative story did you tell yourself?</label>
          <input
            type="text"
            value={negativeStory}
            onChange={(e) => setNegativeStory(e.target.value)}
            placeholder="The limiting interpretation..."
          />
        </div>

        <div className="reframe-field">
          <label>What's a more empowering story?</label>
          <input
            type="text"
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            placeholder="Reframe it positively..."
          />
        </div>

        <button className="add-btn" onClick={addReframe}>
          Add Reframe
        </button>
      </div>

      <div className="reframes-list">
        <h3>Your Reframes</h3>

        {reframes.length === 0 ? (
          <div className="empty-state">
            <p>No reframes yet.</p>
            <p className="hint">Start practicing the Inner Game by adding your first reframe above.</p>
          </div>
        ) : (
          reframes.map(reframe => (
            <div key={reframe.id} className="reframe-card">
              {editingId === reframe.id ? (
                <div className="reframe-edit">
                  <input
                    type="text"
                    value={reframe.situation}
                    onChange={(e) => updateReframe(reframe.id, { situation: e.target.value })}
                    placeholder="Situation..."
                  />
                  <input
                    type="text"
                    value={reframe.negativeStory}
                    onChange={(e) => updateReframe(reframe.id, { negativeStory: e.target.value })}
                    placeholder="Negative story..."
                  />
                  <input
                    type="text"
                    value={reframe.newStory}
                    onChange={(e) => updateReframe(reframe.id, { newStory: e.target.value })}
                    placeholder="New story..."
                  />
                  <button onClick={() => setEditingId(null)}>Done</button>
                </div>
              ) : (
                <>
                  <div className="reframe-situation">
                    <span className="label">Situation:</span>
                    <span className="text">{reframe.situation}</span>
                  </div>

                  <div className="reframe-transformation">
                    <div className="old-story">
                      <span className="story-label">Old story:</span>
                      <span className="story-text negative">"{reframe.negativeStory}"</span>
                    </div>
                    <span className="transform-arrow">↓</span>
                    <div className="new-story">
                      <span className="story-label">New story:</span>
                      <span className="story-text positive">
                        {reframe.newStory ? `"${reframe.newStory}"` : '(Not yet reframed)'}
                      </span>
                    </div>
                  </div>

                  <div className="reframe-actions">
                    <button onClick={() => setEditingId(reframe.id)}>Edit</button>
                    <button className="delete" onClick={() => deleteReframe(reframe.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="inner-game-quote">
        <p>"You cannot control what happens to you, but you can control how you interpret it."</p>
        <span>— Petr Ludwig</span>
      </div>
    </div>
  );
}
