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
        onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className={`bg-transparent border-b border-teal-400 outline-none font-inherit ${className}`}
      />
    );
  }
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      aria-label={`Edit ${label}`} title={`Click to edit`}
      className={`text-left underline decoration-dotted underline-offset-2
        decoration-teal-400/50 hover:decoration-teal-300 transition-all
        ${!value ? 'opacity-40 italic' : ''} ${className}`}>
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

  const daysColor =
    daysRemaining === null ? 'text-teal-400'
    : daysRemaining <= 0  ? 'text-rose-400'
    : daysRemaining < 14  ? 'text-amber-400'
    : 'text-teal-400';

  return (
    <section aria-label="Welcome"
      className="relative rounded-2xl overflow-hidden shadow-xl shadow-navy-900/15">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-[#0a1628]" />
      {/* Subtle blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="absolute -bottom-6 left-1/4 w-40 h-32 bg-amber-400/7 blur-2xl" />
      </div>

      {/* ── Single compact row ── */}
      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 px-5 sm:px-7 py-4">

        {/* Greeting */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden="true" />
          <span className="text-white/40 text-xs font-medium hidden sm:inline shrink-0">
            {formatDate(today)} ·
          </span>
          <span className="text-white font-bold text-sm sm:text-base whitespace-nowrap">
            Hello,{' '}
            <InlineEdit value={profile.name} placeholder="your name" label="Your name"
              onSave={(v) => updateProfile({ name: v })}
              className="text-teal-300 font-bold text-sm sm:text-base" />
            {profile.name && ' 👋'}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />

        {/* Motivational quote */}
        <p className="text-xs text-white/45 italic hidden md:block flex-1 min-w-0 truncate">
          ✨ "{message}"
        </p>

        {/* Spacer */}
        <div className="flex-1 hidden lg:block" />

        {/* Target band chip */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">Band</span>
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-amber-400/20 blur-sm" />
            <div className="relative px-2.5 py-1 rounded-lg border border-amber-400/30
              bg-amber-400/10 flex items-center justify-center min-w-[36px]">
              <InlineEdit value={profile.targetBand} placeholder="?" label="Target band"
                onSave={(v) => updateProfile({ targetBand: v })}
                className="text-base font-black text-amber-400 text-center" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />

        {/* Exam date + countdown */}
        <div className="flex items-center gap-3 shrink-0">
          {profile.examDate ? (
            <>
              <div className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-teal-400/70 shrink-0" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <InlineEdit value={profile.examDate} placeholder="YYYY-MM-DD" label="Exam date"
                  type="date" onSave={(v) => updateProfile({ examDate: v })}
                  className="text-xs text-white/70 font-medium" />
              </div>
              {daysRemaining !== null && (
                <div className="flex items-center gap-1">
                  <span className={`text-xl font-black leading-none ${daysColor}`}>
                    {daysRemaining <= 0 ? '🎯' : daysRemaining}
                  </span>
                  <span className="text-[9px] text-white/35 font-bold uppercase tracking-wider leading-tight">
                    {daysRemaining <= 0 ? '' : 'days\nleft'}
                  </span>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => updateProfile({ examDate: today.toISOString().slice(0, 10) })}
              className="flex items-center gap-1.5 text-xs text-teal-400/80 hover:text-teal-300
                font-medium transition-colors whitespace-nowrap">
              <span className="w-4 h-4 rounded-full border border-teal-400/40 flex items-center
                justify-center text-[10px] hover:bg-teal-400/10 transition-all">+</span>
              Add exam date
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
