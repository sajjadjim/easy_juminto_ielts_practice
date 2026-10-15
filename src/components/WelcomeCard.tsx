import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { formatDate, getDailyMessage, getDaysRemaining } from '../utils';

function EditableField({
  value,
  placeholder,
  onSave,
  label,
  type = 'text',
  className = '',
}: {
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
  label: string;
  type?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onSave(draft.trim());
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className={`bg-transparent border-b-2 border-teal-500 outline-none text-inherit font-inherit ${className}`}
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      aria-label={`Edit ${label}: ${value || placeholder}`}
      className={`text-left underline decoration-dotted decoration-teal-500/50 underline-offset-2
        hover:decoration-teal-500 transition-colors cursor-pointer ${className}
        ${!value ? 'text-navy-500/60 dark:text-ivory-300/40 italic' : ''}`}
    >
      {value || placeholder}
    </button>
  );
}

export function WelcomeCard() {
  const { state, updateProfile } = useApp();
  const { profile } = state;
  const today = new Date();
  const daysRemaining = getDaysRemaining(profile.examDate);
  const message = getDailyMessage();

  return (
    <section
      aria-label="Welcome"
      className="rounded-2xl p-6 sm:p-8 border transition-colors duration-300
        bg-gradient-to-br from-navy-800 to-navy-900
        border-navy-700/50
        shadow-xl shadow-navy-900/20"
    >
      {/* Greeting row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-teal-400 text-sm font-medium mb-1 uppercase tracking-widest">
            {formatDate(today)}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ivory-50 leading-tight">
            Hello,{' '}
            <EditableField
              value={profile.name}
              placeholder="add your name"
              label="Your name"
              onSave={(v) => updateProfile({ name: v })}
              className="text-teal-400 text-2xl sm:text-3xl font-bold"
            />
            {profile.name && <span className="text-ivory-50"> 👋</span>}
          </h1>
        </div>

        {/* Band target badge */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-ivory-200/60 uppercase tracking-widest">Target Band</span>
          <EditableField
            value={profile.targetBand}
            placeholder="set band"
            label="Target IELTS band"
            onSave={(v) => updateProfile({ targetBand: v })}
            className="text-3xl font-bold text-amber-400"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-6" />

      {/* Exam date + countdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-ivory-200/60 uppercase tracking-widest mb-1">Exam date</p>
          {profile.examDate ? (
            <div className="flex items-center gap-3">
              <EditableField
                value={profile.examDate}
                placeholder="YYYY-MM-DD"
                label="Exam date"
                type="date"
                onSave={(v) => updateProfile({ examDate: v })}
                className="text-ivory-100 font-medium"
              />
              <span className="text-xs text-ivory-300/60">
                {new Date(profile.examDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>
          ) : (
            <button
              onClick={() => updateProfile({ examDate: today.toISOString().slice(0, 10) })}
              className="text-sm text-teal-400 underline decoration-dotted underline-offset-2 hover:text-teal-300 transition-colors"
            >
              + Add your exam date to track countdown
            </button>
          )}
        </div>

        {daysRemaining !== null && (
          <div className="text-right">
            <div className={`text-4xl font-black ${daysRemaining < 0 ? 'text-red-400' : daysRemaining < 14 ? 'text-amber-400' : 'text-teal-400'}`}>
              {daysRemaining < 0 ? '—' : daysRemaining}
            </div>
            <div className="text-xs text-ivory-200/60 uppercase tracking-widest">
              {daysRemaining < 0 ? 'exam passed' : daysRemaining === 0 ? 'exam today!' : 'days left'}
            </div>
          </div>
        )}
      </div>

      {/* Motivational message */}
      <p className="text-sm text-ivory-200/70 italic border-l-2 border-teal-500/40 pl-3">
        "{message}"
      </p>
    </section>
  );
}
