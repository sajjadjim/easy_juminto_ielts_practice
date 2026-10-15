import { useApp } from '../AppContext';
import { calculateStreak, getStartOfWeek } from '../utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: 'teal' | 'amber' | 'navy';
  subtitle?: string;
}

function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-500/10 dark:bg-teal-500/15',
      text: 'text-teal-700 dark:text-teal-300',
      value: 'text-teal-600 dark:text-teal-400',
    },
    amber: {
      bg: 'bg-amber-400/10 dark:bg-amber-400/15',
      text: 'text-amber-700 dark:text-amber-300',
      value: 'text-amber-600 dark:text-amber-400',
    },
    navy: {
      bg: 'bg-navy-900/6 dark:bg-white/8',
      text: 'text-navy-700 dark:text-ivory-200',
      value: 'text-navy-600 dark:text-ivory-300',
    },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-xl px-4 py-4 flex items-center gap-4 ${c.bg} transition-colors duration-300`}>
      <div className="text-2xl shrink-0" aria-hidden="true">{icon}</div>
      <div>
        <div className={`text-2xl font-black ${c.value}`}>
          {value}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-widest ${c.text} mt-0.5`}>
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-navy-400 dark:text-ivory-500 mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export function ProgressPanel() {
  const { state } = useApp();
  const { history } = state;

  const completed = history.filter((s) => s.status === 'completed');
  const completedCount = completed.length;

  // Sessions completed this week
  const weekStart = getStartOfWeek();
  const weekCompletions = completed.filter((s) => {
    const date = new Date(s.completedAt ?? s.openedAt);
    return date >= weekStart;
  });

  // Streak based on completion dates
  const completedDates = completed.map((s) => s.completedAt ?? s.openedAt);
  const streak = calculateStreak(completedDates);

  return (
    <section aria-label="Progress overview">
      <h2 className="text-base font-bold text-navy-900 dark:text-ivory-50 mb-3 flex items-center gap-2">
        <span aria-hidden="true">📈</span>
        Progress
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          label="Completed"
          value={completedCount}
          icon="✅"
          color="teal"
          subtitle="all time"
        />
        <StatCard
          label="This week"
          value={weekCompletions.length}
          icon="📅"
          color="amber"
          subtitle="completed"
        />
        <StatCard
          label="Streak"
          value={streak === 0 ? '—' : `${streak}d`}
          icon="🔥"
          color="navy"
          subtitle={streak > 0 ? 'consecutive days' : 'no streak yet'}
        />
      </div>

      {/* Encouragement */}
      <div className="rounded-xl bg-gradient-to-r from-teal-500/8 to-amber-400/8
        dark:from-teal-500/12 dark:to-amber-400/12
        border border-teal-500/15 dark:border-teal-500/20
        px-4 py-3 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🧭</span>
        <p className="text-sm text-navy-700 dark:text-ivory-200">
          {completedCount === 0
            ? 'Your first completed session is a step forward. Start whenever you are ready.'
            : streak > 2
            ? `${streak} days in a row — fantastic consistency! Keep the momentum going.`
            : 'Your next session is a step forward. Keep going!'}
        </p>
      </div>
    </section>
  );
}
