import { useState } from 'react';
import { useApp } from '../AppContext';
import type { PracticeSession } from '../types';
import { formatShortDate, sessionLabel } from '../utils';

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Not confident',
  2: 'Slightly confident',
  3: 'Moderately confident',
  4: 'Confident',
  5: 'Very confident',
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
    <article className="rounded-xl border transition-all duration-200
      bg-white dark:bg-navy-800/50
      border-navy-900/8 dark:border-white/8
      shadow-sm">
      {/* Main row */}
      <div className="flex items-start sm:items-center gap-3 px-4 py-3.5">
        {/* Status dot */}
        <div className={`shrink-0 mt-0.5 sm:mt-0 w-2 h-2 rounded-full ${isCompleted ? 'bg-teal-500' : 'bg-amber-400'}`}
          aria-label={isCompleted ? 'Completed' : 'Opened'} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy-800 dark:text-ivory-100 truncate">
            {sessionLabel(session)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
            <span className="text-xs text-navy-400 dark:text-ivory-500">
              {isCompleted ? '✓ Completed' : '📖 Opened'} · {formatShortDate(session.openedAt)}
            </span>
            {isCompleted && session.confidenceRating && (
              <span className="text-xs text-teal-600 dark:text-teal-400">
                Confidence: {session.confidenceRating}/5
              </span>
            )}
            {isCompleted && session.score && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Score: {session.score}
              </span>
            )}
          </div>
        </div>

        {/* Toggle expand */}
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? 'Collapse session details' : 'Expand session details'}
          aria-expanded={expanded}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
            text-navy-400 dark:text-ivory-400
            hover:bg-navy-900/8 dark:hover:bg-white/8 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-navy-900/6 dark:border-white/6 pt-4 space-y-4">
          {/* Confidence rating */}
          {!isCompleted && (
            <div>
              <p className="text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-2">
                Confidence rating
              </p>
              <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Confidence rating">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    role="radio"
                    aria-checked={rating === r}
                    aria-label={`${r} – ${CONFIDENCE_LABELS[r]}`}
                    onClick={() => setRating(r)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all
                      ${rating === r
                        ? 'bg-teal-500 text-white'
                        : 'bg-ivory-100 dark:bg-navy-700/50 text-navy-600 dark:text-ivory-300 hover:bg-teal-500/15'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-navy-500 dark:text-ivory-400 mt-1">{CONFIDENCE_LABELS[rating]}</p>
              )}
            </div>
          )}

          {/* Score */}
          {!isCompleted && (
            <div>
              <label htmlFor={`score-${session.id}`} className="block text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-1.5">
                Score (optional)
              </label>
              <input
                id={`score-${session.id}`}
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 32/40 or 7.0"
                className="w-full max-w-xs px-3 py-2 rounded-xl border text-sm
                  border-navy-900/15 dark:border-white/10
                  bg-ivory-50 dark:bg-navy-900/50
                  text-navy-900 dark:text-ivory-50
                  placeholder:text-navy-400 dark:placeholder:text-ivory-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor={`notes-${session.id}`} className="block text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-1.5">
              Notes {isCompleted ? '' : '(optional)'}
            </label>
            <textarea
              id={`notes-${session.id}`}
              value={isCompleted ? (session.notes ?? '—') : notes}
              onChange={(e) => !isCompleted && setNotes(e.target.value)}
              readOnly={isCompleted}
              rows={2}
              placeholder="Any thoughts on this session…"
              className="w-full px-3 py-2 rounded-xl border text-sm resize-none
                border-navy-900/15 dark:border-white/10
                bg-ivory-50 dark:bg-navy-900/50
                text-navy-900 dark:text-ivory-50
                placeholder:text-navy-400 dark:placeholder:text-ivory-500
                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all
                read-only:opacity-60 read-only:cursor-default"
            />
          </div>

          {/* Actions */}
          {!isCompleted && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-teal-500 hover:bg-teal-600 text-white
                  active:scale-95 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                Mark as completed
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  border border-navy-900/12 dark:border-white/10
                  text-navy-700 dark:text-ivory-200
                  hover:bg-navy-900/4 dark:hover:bg-white/4
                  active:scale-95 transition-all"
              >
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-navy-900 dark:text-ivory-50 flex items-center gap-2">
          <span className="text-navy-400" aria-hidden="true">📋</span>
          Practice history
          {history.length > 0 && (
            <span className="text-xs bg-navy-900/8 dark:bg-white/8 text-navy-600 dark:text-ivory-300 px-2 py-0.5 rounded-full font-semibold">
              {history.length}
            </span>
          )}
        </h2>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-10 text-center
          border-navy-900/15 dark:border-white/10">
          <div className="text-3xl mb-3" aria-hidden="true">📚</div>
          <p className="text-sm font-medium text-navy-600 dark:text-ivory-300">No sessions yet</p>
          <p className="text-xs text-navy-400 dark:text-ivory-500 mt-1">
            Open your first practice session to start tracking.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayed.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
          {history.length > 6 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="w-full mt-3 py-2 text-sm text-teal-600 dark:text-teal-400 hover:underline text-center transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${history.length} sessions`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
