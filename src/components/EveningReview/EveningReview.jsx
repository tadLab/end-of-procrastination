import { useState } from 'react';
import './EveningReview.css';

export function EveningReview({ tasks, habits, habitDefinitions, review, onUpdateReview }) {
  const [open, setOpen] = useState(false);

  const taskCount = tasks.filter(t => t.completed).length;
  const taskTotal = tasks.length;
  const habitCount = habitDefinitions.reduce((n, h) => n + (habits[h.id] ? 1 : 0), 0);
  const habitTotal = habitDefinitions.length;

  return (
    <section className="review-section">
      <button className="review-toggle" onClick={() => setOpen(!open)}>
        <h2>Evening Review</h2>
        <span className="review-arrow">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div className="review-content">
          <p className="review-summary">
            Tasks: {taskCount}/{taskTotal} &middot; Habits: {habitCount}/{habitTotal}
          </p>

          <div className="review-field">
            <label htmlFor="whatWorked">What worked?</label>
            <textarea
              id="whatWorked"
              value={review.whatWorked}
              onChange={e => onUpdateReview({ ...review, whatWorked: e.target.value })}
              placeholder="Things that went well today..."
              rows={2}
            />
          </div>

          <div className="review-field">
            <label htmlFor="whatToImprove">What to improve tomorrow?</label>
            <textarea
              id="whatToImprove"
              value={review.whatToImprove}
              onChange={e => onUpdateReview({ ...review, whatToImprove: e.target.value })}
              placeholder="Things to do differently..."
              rows={2}
            />
          </div>
        </div>
      )}
    </section>
  );
}
