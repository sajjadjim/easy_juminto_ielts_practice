import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { formatDate, getDailyMessage, getDaysRemaining } from '../utils';

function InlineEdit({
  value, placeholder, onSave, label, type = 'text', className = '',
}: {
  value: string; placeholder: string; onSave: (v: string) => void;
  label: string; type?: string; className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => { setEditing(false); onSave(draft.trim()); };

  if (editing) {
    return (
      <input ref={inputRef} type={type} value={draft} aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className={`bg-transparent border-b-2 border-teal-400 outline-none font-inherit ${className}`}
      />
    );
  }
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      aria-label={`Edit ${label}`} title={`Click to edit ${label}`}
      className={`text-left cursor-pointer transition-all duration-200
        underline decoration-dotted underline-offset-4
        decoration-teal-400/50 hover:decoration-teal-400
        ${!value ? 'italic opacity-50' : ''} ${className}`}>
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

  const countdownColor =
    daysRemaining === null ? 'text-teal-500'
    : daysRemaining <= 0   ? 'text-rose-400'
    : daysRemaining < 14   ? 'text-amber-500'
    : 'text-teal-400';

  return (
    <section aria-label="Welcome"
      className="relative rounded-3xl overflow-hidden shadow-2xl shadow-navy-900/20">
      {/* Deep navy gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
      {/* Inner blobs */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-32 bg-amber-400/8 blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-violet-500/8 blur-2xl" />
      </div>

      <div className="relative px-6 sm:px-8 pt-7 pb-6 space-y-5">
        {/* Date + greeting + band */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-teal-400 mb-2">
              {formatDate(today)}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Hello,{' '}
              {/* <InlineEdit value={profile.name} placeholder="add your name" label="Your name"
                onSave={(v) => updateProfile({ name: v })}
                className="text-teal-300 font-black text-2xl sm:text-3xl" />
              {profile.name && <span className="ml-1">👋</span>} */}
              
            </h1>
          </div>
          {/* Target band widget */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40">Target Band</span>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md group-hover:blur-lg transition-all" />
              <div className="relative w-16 h-16 rounded-2xl
                bg-gradient-to-br from-amber-400/20 to-amber-600/10
                border border-amber-400/25 flex items-center justify-center">
                <InlineEdit value={profile.targetBand} placeholder="?" label="Target band"
                  onSave={(v) => updateProfile({ targetBand: v })}
                  className="text-3xl font-black text-amber-400 text-center w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Exam date + countdown */}
        {/* <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2">Exam Date</p>
            {profile.examDate ? (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/6 border border-white/10">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-teal-400 shrink-0" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <InlineEdit value={profile.examDate} placeholder="YYYY-MM-DD" label="Exam date"
                    type="date" onSave={(v) => updateProfile({ examDate: v })}
                    className="text-sm text-white font-semibold" />
                </div>
                <span className="text-sm text-white/50 font-medium">
                  {new Date(profile.examDate).toLocaleDateString('en-GB',
                    { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            ) : (
              <button
                onClick={() => updateProfile({ examDate: today.toISOString().slice(0, 10) })}
                className="flex items-center gap-2 text-sm text-teal-400 font-medium hover:text-teal-300 transition-colors group">
                <span className="w-5 h-5 rounded-full border border-teal-400/40 flex items-center justify-center
                  group-hover:border-teal-400 group-hover:bg-teal-400/10 transition-all text-xs">+</span>
                Add your exam date to track countdown
              </button>
            )}
          </div>

          {daysRemaining !== null && (
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-black leading-none ${countdownColor}`}>
                {daysRemaining <= 0 ? '🎯' : daysRemaining}
              </div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 mt-1">
                {daysRemaining < 0 ? 'Exam passed' : daysRemaining === 0 ? 'Exam today!' : 'Days left'}
              </div>
            </div>
          )}
        </div> */}

        {/* Motivation */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/8">
          <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">✨</span>
          <p className="text-sm text-white/65 italic leading-relaxed">"{message}"</p>
        </div>
      </div>
    </section>
  );
}
