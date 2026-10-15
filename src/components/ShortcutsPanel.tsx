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
      book: sc.book, test: sc.test, module: sc.module, part: sc.part,
      url: sc.url,
      openedAt: new Date().toISOString(),
      status: 'opened',
    });
    window.open(sc.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="group relative rounded-2xl border transition-all duration-200
      bg-white dark:bg-navy-800/60
      border-navy-900/6 dark:border-white/6
      shadow-sm dark:shadow-black/20
      hover:border-teal-500/25 dark:hover:border-teal-400/20
      hover:shadow-md dark:hover:shadow-black/30
      hover:-translate-y-0.5">

      {/* Hover accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-teal-500
        opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />

      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Icon */}
        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
          bg-gradient-to-br from-teal-500/15 to-teal-600/8
          border border-teal-500/20 dark:border-teal-400/20
          text-teal-600 dark:text-teal-400">
          ⭐
        </div>

        {/* Label + meta */}
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
              className="w-full bg-transparent border-b-2 border-teal-500 outline-none
                text-sm font-semibold text-navy-800 dark:text-ivory-100"
            />
          ) : (
            <p className="text-sm font-semibold text-navy-800 dark:text-ivory-100 truncate">
              {sc.label}
            </p>
          )}
          <p className="text-xs text-navy-400 dark:text-ivory-500 mt-0.5 truncate">
            Book {sc.book} · Test {sc.test} · {moduleLabel(sc.module)} · {partLabel(sc.module, sc.part)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handleOpen} aria-label={`Open ${sc.label}`}
            className="px-3 py-1.5 rounded-xl text-xs font-bold
              bg-teal-500 hover:bg-teal-600 text-white
              shadow-sm shadow-teal-500/20
              active:scale-95 transition-all duration-150">
            Open
          </button>
          <button onClick={() => setRenaming(true)} aria-label={`Rename ${sc.label}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center
              text-navy-300 dark:text-ivory-500
              hover:bg-navy-900/6 dark:hover:bg-white/6 hover:text-navy-600 dark:hover:text-ivory-200
              transition-all duration-150">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button onClick={() => removeShortcut(sc.id)} aria-label={`Delete ${sc.label}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center
              text-navy-300 dark:text-ivory-500
              hover:bg-rose-500/10 hover:text-rose-500
              transition-all duration-150">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ShortcutsPanel() {
  const { state } = useApp();
  const { shortcuts } = state;

  return (
    <section aria-label="Saved shortcuts">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg" aria-hidden="true">⭐</span>
        <h2 className="text-base font-black text-navy-900 dark:text-ivory-50 tracking-tight">
          Saved shortcuts
        </h2>
        {shortcuts.length > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full
            bg-amber-400/15 dark:bg-amber-400/15
            text-amber-700 dark:text-amber-300">
            {shortcuts.length}
          </span>
        )}
      </div>

      {shortcuts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed px-6 py-12 text-center
          border-navy-900/10 dark:border-white/10
          bg-navy-900/2 dark:bg-white/2">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center
            bg-amber-400/10 border border-amber-400/20">
            <span className="text-2xl" aria-hidden="true">⭐</span>
          </div>
          <p className="font-bold text-navy-600 dark:text-ivory-300 text-sm">No shortcuts yet</p>
          <p className="text-xs text-navy-400 dark:text-ivory-500 mt-1.5 leading-relaxed">
            Hit <strong>"Save shortcut"</strong> on your favourite practice sessions to find them here quickly.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {shortcuts.map((sc) => (
            <ShortcutCard key={sc.id} sc={sc} />
          ))}
        </div>
      )}
    </section>
  );
}
