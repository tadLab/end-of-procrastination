import { useState } from 'react';
import { formatDate } from '../../utils/dateHelpers';
import './FlowSheet.css';

export function FlowSheet({ flowEntries, setFlowEntries }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [positives, setPositives] = useState(['', '', '']);
  const [rating, setRating] = useState(0);

  const currentEntry = flowEntries[selectedDate] || { positives: ['', '', ''], rating: 0 };

  const handlePositiveChange = (index, value) => {
    const newPositives = [...(currentEntry.positives || ['', '', ''])];
    newPositives[index] = value;
    setFlowEntries({
      ...flowEntries,
      [selectedDate]: {
        ...currentEntry,
        positives: newPositives
      }
    });
  };

  const handleRatingChange = (value) => {
    setFlowEntries({
      ...flowEntries,
      [selectedDate]: {
        ...currentEntry,
        rating: value
      }
    });
  };

  const getDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDate(date));
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDate(date));
  };

  const goToToday = () => {
    setSelectedDate(formatDate(new Date()));
  };

  const isToday = selectedDate === formatDate(new Date());

  return (
    <div className="flow-sheet">
      <div className="flow-header">
        <h2>Flow Sheet</h2>
        <p className="flow-subtitle">Train your brain to notice the good</p>
      </div>

      <div className="date-navigation">
        <button onClick={goToPreviousDay}>&lt;</button>
        <span className="current-date">{getDateDisplay(selectedDate)}</span>
        <button onClick={goToNextDay}>&gt;</button>
        {!isToday && (
          <button className="today-btn" onClick={goToToday}>Today</button>
        )}
      </div>

      <div className="positives-section">
        <h3>3 Positive Things from Today</h3>
        <p className="section-hint">What went well? What are you grateful for?</p>

        {[0, 1, 2].map((index) => (
          <div key={index} className="positive-input-wrapper">
            <span className="positive-number">{index + 1}</span>
            <input
              type="text"
              value={currentEntry.positives?.[index] || ''}
              onChange={(e) => handlePositiveChange(index, e.target.value)}
              placeholder={`Positive thing #${index + 1}...`}
              className="positive-input"
            />
          </div>
        ))}
      </div>

      <div className="rating-section">
        <h3>Rate Your Day (Optional)</h3>
        <p className="section-hint">How would you rate this day overall?</p>

        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star-btn ${(currentEntry.rating || 0) >= star ? 'active' : ''}`}
              onClick={() => handleRatingChange(star === currentEntry.rating ? 0 : star)}
            >
              {(currentEntry.rating || 0) >= star ? '★' : '☆'}
            </button>
          ))}
          <span className="rating-label">
            {currentEntry.rating === 1 && 'Tough day'}
            {currentEntry.rating === 2 && 'Below average'}
            {currentEntry.rating === 3 && 'Okay'}
            {currentEntry.rating === 4 && 'Good day'}
            {currentEntry.rating === 5 && 'Amazing day!'}
          </span>
        </div>
      </div>

      <div className="flow-quote">
        <p>"By focusing on the positive, we train our brain to see more opportunities and feel more fulfilled."</p>
        <span>— Petr Ludwig</span>
      </div>
    </div>
  );
}
