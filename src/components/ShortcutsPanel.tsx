import { useState } from 'react';
import { useApp } from '../AppContext';
import type { Shortcut } from '../types';
import { moduleLabel, partLabel } from '../utils';

function ShortcutCard({ sc }: { sc: Shortcut }) {
  const { removeShortcut, renameShortcut, addSession } = useApp();
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(sc.label);

  const commitRename = () => {
    setRenaming(false);
    if (draft.trim()) renameShortcut(sc.id, draft.trim());
  };

  const handleOpen = () => {
    addSession({
      book: sc.book,
      test: sc.test,
      module: sc.module,
      part: sc.part,
      url: sc.url,
      openedAt: new Date().toISOString(),
      status: 'opened',
    });
    window.open(sc.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 rounded-xl border
        bg-white dark:bg-navy-800/50
        border-navy-900/8 dark:border-white/8
        shadow-sm hover:shadow-md hover:border-teal-500/20
        transition-all duration-200 group"
    >
      {/* Icon */}
      <div className="shrink-0 w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center
        text-teal-600 dark:text-teal-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        {renaming ? (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setDraft(sc.label); setRenaming(false); }
            }}
            aria-label="Rename shortcut"
            className="w-full bg-transparent border-b border-teal-500 outline-none text-sm font-medium text-navy-800 dark:text-ivory-100"
          />
        ) : (
          <p className="text-sm font-medium text-navy-800 dark:text-ivory-100 truncate">
            {sc.label}
          </p>
        )}
        <p className="text-xs text-navy-500 dark:text-ivory-400 mt-0.5">
          Book {sc.book} · Test {sc.test} · {moduleLabel(sc.module)} · {partLabel(sc.module, sc.part)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleOpen}
          aria-label={`Open ${sc.label}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            bg-teal-500 hover:bg-teal-600 text-white
            active:scale-95 transition-all duration-150"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Open
        </button>
        <button
          onClick={() => setRenaming(true)}
          aria-label={`Rename ${sc.label}`}
          className="w-7 h-7 rounded-lg flex items-center justify-center
            text-navy-400 dark:text-ivory-400
            hover:bg-navy-900/8 dark:hover:bg-white/8
            transition-all duration-150"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button
          onClick={() => removeShortcut(sc.id)}
          aria-label={`Delete ${sc.label}`}
          className="w-7 h-7 rounded-lg flex items-center justify-center
            text-navy-400 dark:text-ivory-400
            hover:bg-red-500/10 hover:text-red-500
            transition-all duration-150"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </article>
  );
}

export function ShortcutsPanel() {
  const { state } = useApp();
  const { shortcuts } = state;

  return (
    <section aria-label="Saved shortcuts">
      <h2 className="text-base font-bold text-navy-900 dark:text-ivory-50 mb-3 flex items-center gap-2">
        <span className="text-amber-500" aria-hidden="true">⭐</span>
        Saved shortcuts
        {shortcuts.length > 0 && (
          <span className="text-xs bg-amber-400/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
            {shortcuts.length}
          </span>
        )}
      </h2>

      {shortcuts.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-10 text-center
          border-navy-900/15 dark:border-white/10">
          <div className="text-3xl mb-3" aria-hidden="true">⭐</div>
          <p className="text-sm font-medium text-navy-600 dark:text-ivory-300">No shortcuts yet</p>
          <p className="text-xs text-navy-400 dark:text-ivory-500 mt-1">
            Use "Save shortcut" on your favourite practice sessions.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {shortcuts.map((sc) => (
            <ShortcutCard key={sc.id} sc={sc} />
          ))}
        </div>
      )}
    </section>
  );
}
