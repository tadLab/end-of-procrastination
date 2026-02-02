import { format } from 'date-fns';
import './WeeklyStats.css';

export function WeeklyStats({ weekData, streaks, habitDefinitions }) {
  const barWidth = 28;
  const barGap = 12;
  const maxHeight = 56;
  const totalWidth = weekData.length * (barWidth + barGap) - barGap;

  return (
    <section className="weekly-stats">
      <h2>This Week</h2>
      <div className="stats-chart">
        <svg
          width="100%"
          height={maxHeight + 22}
          viewBox={`0 0 ${totalWidth} ${maxHeight + 22}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {weekData.map((day, i) => {
            const x = i * (barWidth + barGap);
            const taskH = Math.max(day.taskRate * maxHeight, day.taskTotal > 0 ? 3 : 0);
            const habitH = Math.max(day.habitRate * maxHeight, day.habitTotal > 0 ? 3 : 0);
            const halfW = barWidth / 2 - 1;

            return (
              <g key={day.key}>
                <rect
                  x={x}
                  y={maxHeight - taskH}
                  width={halfW}
                  height={taskH}
                  rx={3}
                  fill="rgba(100, 120, 255, 0.7)"
                />
                <rect
                  x={x + halfW + 2}
                  y={maxHeight - habitH}
                  width={halfW}
                  height={habitH}
                  rx={3}
                  fill="rgba(45, 210, 180, 0.7)"
                />
                <text
                  x={x + barWidth / 2}
                  y={maxHeight + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                  fontFamily="inherit"
                >
                  {format(day.date, 'EEE').charAt(0)}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="stats-legend">
          <span className="legend-item"><span className="legend-dot legend-tasks" /> Tasks</span>
          <span className="legend-item"><span className="legend-dot legend-habits" /> Habits</span>
        </div>
      </div>
      {habitDefinitions.length > 0 && (
        <div className="streaks-list">
          <h3>Streaks</h3>
          <div className="streaks-items">
            {habitDefinitions.map(h => (
              <div key={h.id} className="streak-item">
                <span className="streak-name">{h.name}</span>
                <span className="streak-count">{streaks[h.id] || 0}d</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
