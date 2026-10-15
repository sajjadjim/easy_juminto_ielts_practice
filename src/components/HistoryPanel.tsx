import { useState } from 'react';
import { useApp } from '../AppContext';
import type { PracticeSession } from '../types';
import { formatShortDate, sessionLabel } from '../utils';

const CONFIDENCE_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Not confident',      emoji: '😟' },
  2: { text: 'Slightly confident', emoji: '🙁' },
  3: { text: 'Moderately confident', emoji: '😐' },
  4: { text: 'Confident',          emoji: '🙂' },
  5: { text: 'Very confident',     emoji: '😄' },
};

function SessionRow({ session }: { session: PracticeSession }) {
  const { updateSession } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(session.notes ?? '');
  const [score, setScore] = useState(session.score ?? '');
  const [rating, setRating] = useState(session.confidenceRating ?? 0);

  const isCompleted = session.status === 'completed';

  const handleComplete = () => {
    updateSession(session.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      confidenceRating: rating || undefined,
      notes: notes.trim() || undefined,
      score: score.trim() || undefined,
    });
    setExpanded(false);
  };

  const handleSaveNotes = () => {
    updateSession(session.id, {
      confidenceRating: rating || undefined,
      notes: notes.trim() || undefined,
      score: score.trim() || undefined,
    });
    setExpanded(false);
  };

  return (
    <article className="rounded-2xl overflow-hidden border transition-all duration-200
      bg-white dark:bg-navy-800/60
      border-navy-900/6 dark:border-white/6
      shadow-sm dark:shadow-black/20
      hover:border-teal-500/20 dark:hover:border-teal-400/20">

      {/* Main row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="w-full flex items-center gap-3 px-4 py-4 text-left
          hover:bg-navy-900/2 dark:hover:bg-white/2 transition-colors"
      >
        {/* Status indicator */}
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm
          ${isCompleted
            ? 'bg-teal-500/12 dark:bg-teal-400/12 text-teal-600 dark:text-teal-400'
            : 'bg-amber-400/12 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400'}`}
          aria-hidden="true">
          {isCompleted ? '✓' : '📖'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-navy-800 dark:text-ivory-100 truncate">
            {sessionLabel(session)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
            <span className="text-xs text-navy-400 dark:text-ivory-500">
              {formatShortDate(session.openedAt)}
              {' · '}
              <span className={isCompleted
                ? 'text-teal-600 dark:text-teal-400 font-medium'
                : 'text-amber-600 dark:text-amber-400 font-medium'}>
                {isCompleted ? 'Completed' : 'Opened'}
              </span>
            </span>
            {isCompleted && session.confidenceRating && (
              <span className="text-xs text-navy-400 dark:text-ivory-500">
                {CONFIDENCE_LABELS[session.confidenceRating].emoji} {session.confidenceRating}/5
              </span>
            )}
            {isCompleted && session.score && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Score: {session.score}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-navy-300 dark:text-ivory-500 shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-5 pt-1 space-y-4 border-t border-navy-900/5 dark:border-white/5">

          {/* Confidence rating */}
          {!isCompleted && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]
                text-navy-400 dark:text-ivory-400 mb-2">
                Confidence rating
              </p>
              <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Confidence rating">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r}
                    role="radio"
                    aria-checked={rating === r}
                    aria-label={`${r} – ${CONFIDENCE_LABELS[r].text}`}
                    onClick={() => setRating(r)}
                    className={`flex flex-col items-center gap-1 w-12 py-2 rounded-xl text-xs font-bold
                      transition-all duration-200
                      ${rating === r
                        ? 'bg-teal-500 text-white scale-105 shadow-md shadow-teal-500/25'
                        : 'bg-navy-900/4 dark:bg-white/5 text-navy-500 dark:text-ivory-400 border border-navy-900/8 dark:border-white/8 hover:bg-teal-500/10'}`}
                  >
                    <span className="text-base">{CONFIDENCE_LABELS[r].emoji}</span>
                    {r}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-1.5 font-medium">
                  {CONFIDENCE_LABELS[rating].text}
                </p>
              )}
            </div>
          )}

          {/* Score */}
          {!isCompleted && (
            <div>
              <label htmlFor={`score-${session.id}`}
                className="block text-[10px] font-bold uppercase tracking-[0.18em]
                  text-navy-400 dark:text-ivory-400 mb-2">
                Score <span className="normal-case font-normal tracking-normal">(optional)</span>
              </label>
              <input
                id={`score-${session.id}`}
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 32/40 or 7.0"
                className="field w-full max-w-[180px] px-3 py-2 rounded-xl text-sm
                  text-navy-900 dark:text-ivory-50
                  placeholder:text-navy-300 dark:placeholder:text-ivory-600"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor={`notes-${session.id}`}
              className="block text-[10px] font-bold uppercase tracking-[0.18em]
                text-navy-400 dark:text-ivory-400 mb-2">
              Notes {!isCompleted && <span className="normal-case font-normal tracking-normal">(optional)</span>}
            </label>
            <textarea
              id={`notes-${session.id}`}
              value={isCompleted ? (session.notes ?? '—') : notes}
              onChange={(e) => !isCompleted && setNotes(e.target.value)}
              readOnly={isCompleted}
              rows={2}
              placeholder="Any thoughts on this session…"
              className="field w-full px-3 py-2 rounded-xl text-sm resize-none
                text-navy-900 dark:text-ivory-50
                placeholder:text-navy-300 dark:placeholder:text-ivory-600
                read-only:opacity-60 read-only:cursor-default focus:outline-none"
            />
          </div>

          {/* Actions */}
          {!isCompleted && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={handleComplete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                  bg-teal-500 hover:bg-teal-600 text-white
                  shadow-sm shadow-teal-500/25 active:scale-95 transition-all">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mark as completed
              </button>
              <button onClick={handleSaveNotes}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                  border border-navy-900/10 dark:border-white/10
                  text-navy-600 dark:text-ivory-300
                  hover:bg-navy-900/4 dark:hover:bg-white/4
                  active:scale-95 transition-all">
                Save notes
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function HistoryPanel() {
  const { state } = useApp();
  const { history } = state;
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? history : history.slice(0, 6);

  return (
    <section aria-label="Practice history">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📋</span>
          <h2 className="text-base font-black text-navy-900 dark:text-ivory-50 tracking-tight">
            Practice history
          </h2>
          {history.length > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full
              bg-navy-900/6 dark:bg-white/8
              text-navy-500 dark:text-ivory-400">
              {history.length}
            </span>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed px-8 py-14 text-center
          border-navy-900/10 dark:border-white/10
          bg-navy-900/2 dark:bg-white/2">
          <div className="text-4xl mb-3" aria-hidden="true">📚</div>
          <p className="font-bold text-navy-600 dark:text-ivory-300">No sessions yet</p>
          <p className="text-sm text-navy-400 dark:text-ivory-500 mt-1 max-w-xs mx-auto">
            Open your first practice session above to start tracking your progress.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {displayed.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
          {history.length > 6 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="w-full mt-4 py-2.5 rounded-2xl text-sm font-bold
                border border-navy-900/8 dark:border-white/8
                text-teal-600 dark:text-teal-400
                hover:bg-teal-500/5 hover:border-teal-500/20
                transition-all duration-200">
              {showAll ? '↑ Show less' : `↓ Show all ${history.length} sessions`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
