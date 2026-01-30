# v2 Improvements

## Data & Persistence

### Day navigation + week view
- Navigate between days to review past habits/tasks
- Week overview showing completion rates per day
- Currently all historical data is stored in localStorage but invisible

### Data migration
- Old entries still have `priorities` arrays in localStorage from v1
- One-time migration script to clean up legacy shape

### Cloud sync (optional)
- Firebase or Supabase backend for cross-device sync
- Keep local-first as default, sync as opt-in

---

## Calendar Card

### Google Calendar integration
- Replace placeholder with read-only agenda via Google Calendar API
- Show today's events inline in the calendar card
- OAuth flow for account connection

---

## Task Improvements

### Drag-to-reorder
- Manual ordering within the same priority tier
- Library option: `@dnd-kit/core` or `react-beautiful-dnd`

### Subtasks / checklists
- Break a task into smaller steps with nested checkboxes
- Progress indicator (e.g. 2/4 complete)

### Recurring tasks
- Mark tasks as daily/weekly recurring
- Auto-populate on new day

### Due dates
- Optional date field per task
- Overdue highlighting (red tint or badge)

---

## Evening Review

- `EveningReview` component exists in codebase but was dropped from the dashboard
- Bring back as collapsible panel or modal triggered after a set hour
- Show daily summary: priorities completed, habits done, tasks finished

---

## Analytics

### Streaks & completion rates
- Habit streaks (consecutive days completed)
- Weekly task completion percentage

### Charts
- Sparkline or bar chart for last 7 days of habit/task completion
- Library option: lightweight `recharts` or custom SVG

---

## UX Polish

### Keyboard shortcuts
- `n` to focus add-task input
- `1/2/3` to set priority while typing
- `Esc` to cancel

### Transitions
- Animate tasks moving between incomplete/completed sections
- Smooth reorder on priority change

### PWA support
- Add web app manifest
- Service worker for offline support
- Installable on mobile home screen

---

## Priority

If picking one thing first: **day navigation + week view** — it makes all stored historical data accessible and gives habits/priorities real meaning over time.
