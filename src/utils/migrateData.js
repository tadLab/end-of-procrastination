export function migrateIfNeeded() {
  const currentVersion = JSON.parse(localStorage.getItem('dataVersion') || '0');
  if (currentVersion >= 2) return;

  const raw = localStorage.getItem('dayData');
  if (raw) {
    const dayData = JSON.parse(raw);
    for (const key of Object.keys(dayData)) {
      const entry = dayData[key];
      if (entry.priorities) {
        delete entry.priorities;
      }
      if (Array.isArray(entry.tasks)) {
        entry.tasks = entry.tasks.map(t => ({
          ...t,
          priority: t.priority || 'mid',
        }));
      }
      if (!entry.habits) {
        entry.habits = {};
      }
    }
    localStorage.setItem('dayData', JSON.stringify(dayData));
  }

  localStorage.setItem('dataVersion', JSON.stringify(2));
}
