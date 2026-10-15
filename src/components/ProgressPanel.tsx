import { useApp } from '../AppContext';
import { calculateStreak, getStartOfWeek } from '../utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  gradient: string;
  textColor: string;
  subtitle?: string;
}

function StatCard({ label, value, icon, gradient, textColor, subtitle }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden transition-all duration-300
      hover:-translate-y-0.5 hover:shadow-lg group
      bg-white dark:bg-navy-800/60
      border border-navy-900/6 dark:border-white/6
      shadow-sm dark:shadow-black/20`}
    >
      {/* Gradient blob */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 dark:opacity-20
        transition-opacity duration-300 group-hover:opacity-50 ${gradient}`} aria-hidden="true" />

      <div className="relative">
        <div className="text-2xl mb-3" aria-hidden="true">{icon}</div>
        <div className={`text-3xl font-black ${textColor} leading-none mb-1`}>
          {value}
        </div>
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-navy-500 dark:text-ivory-400">
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

  const weekStart = getStartOfWeek();
  const weekCompletions = completed.filter((s) => {
    const date = new Date(s.completedAt ?? s.openedAt);
    return date >= weekStart;
  });

  const completedDates = completed.map((s) => s.completedAt ?? s.openedAt);
  const streak = calculateStreak(completedDates);

  return (
    <section aria-label="Progress overview">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg" aria-hidden="true">📈</span>
        <h2 className="text-base font-black text-navy-900 dark:text-ivory-50 tracking-tight">
          Progress
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard
          label="Completed"
          value={completedCount}
          icon="✅"
          gradient="bg-teal-400"
          textColor="text-teal-600 dark:text-teal-400"
          subtitle="all time"
        />
        <StatCard
          label="This week"
          value={weekCompletions.length}
          icon="📅"
          gradient="bg-amber-400"
          textColor="text-amber-600 dark:text-amber-400"
          subtitle="sessions done"
        />
        <StatCard
          label="Streak"
          value={streak === 0 ? '—' : `${streak}d`}
          icon="🔥"
          gradient="bg-violet-400"
          textColor="text-violet-600 dark:text-violet-400"
          subtitle={streak > 0 ? 'days in a row' : 'start today!'}
        />
      </div>

      {/* Encouragement banner */}
      <div className="relative rounded-2xl px-5 py-4 overflow-hidden
        bg-gradient-to-r from-teal-500/8 via-transparent to-amber-400/8
        dark:from-teal-500/12 dark:via-navy-800/0 dark:to-amber-400/10
        border border-teal-500/15 dark:border-teal-400/15">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/3 to-transparent" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center
            bg-gradient-to-br from-teal-500/20 to-teal-600/10
            border border-teal-500/20">
            <span className="text-lg" aria-hidden="true">🧭</span>
          </div>
          <p className="text-sm font-medium text-navy-700 dark:text-ivory-200 leading-relaxed">
            {completedCount === 0
              ? 'Your first completed session is a step forward. Start whenever you are ready.'
              : streak > 2
              ? `${streak} days in a row — fantastic consistency! Keep the momentum going.`
              : 'Your next session is a step forward. Keep going!'}
          </p>
        </div>
      </div>
    </section>
  );
}
