import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import type { Module } from '../types';
import {
  MODULE_PARTS,
  MODULES,
  VERIFIED_MODULES,
  buildUrl,
  generateId,
  isValidUrl,
  moduleLabel,
  partLabel,
  sessionLabel,
} from '../utils';

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium animate-fade-in
        ${type === 'success'
          ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20'
          : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20'}`}
    >
      {type === 'success' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      )}
      {message}
    </div>
  );
}

interface ToastState { id: string; message: string; type: 'success' | 'error'; }

function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = generateId();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return { toasts, show };
}

function ModuleTab({
  m,
  active,
  onClick,
}: {
  m: Module;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
          : 'text-navy-600 dark:text-ivory-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400'}`}
    >
      {moduleLabel(m)}
      {!VERIFIED_MODULES.includes(m) && (
        <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle" aria-hidden="true" />
      )}
    </button>
  );
}

export function PracticeCard() {
  const { state, setBook, setTest, setModule, setPart, addShortcut, addSession } = useApp();
  const { selection, urlTemplates } = state;
  const { book, test, module, part } = selection;

  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const [bookInput, setBookInput] = useState(String(book));
  const { toasts, show: showToast } = useToast();

  const generatedUrl = buildUrl(urlTemplates[module], book, test, module, part);
  const activeUrl = manualUrl ?? generatedUrl;

  const urlValid = isValidUrl(activeUrl);

  // Sync bookInput when book changes externally
  useEffect(() => {
    setBookInput(String(book));
  }, [book]);

  // Clear manual override when selection changes
  const prevSelection = useRef(selection);
  useEffect(() => {
    if (
      prevSelection.current.book !== selection.book ||
      prevSelection.current.test !== selection.test ||
      prevSelection.current.module !== selection.module ||
      prevSelection.current.part !== selection.part
    ) {
      if (manualUrl !== null) {
        // keep override; user must explicitly clear it
      }
      prevSelection.current = selection;
    }
  }, [selection, manualUrl]);

  // Reset manual URL when generated URL is used
  const handleUseGenerated = () => {
    setManualUrl(null);
  };

  const handleOpen = () => {
    if (!urlValid.valid) return;
    const url = activeUrl;

    // Record session
    addSession({
      book,
      test,
      module,
      part,
      url,
      openedAt: new Date().toISOString(),
      status: 'opened',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Session opened in new tab.');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      showToast('Link copied to clipboard.');
    } catch {
      showToast('Could not copy link.', 'error');
    }
  };

  const handleSaveShortcut = () => {
    const label = sessionLabel({ book, test, module, part });
    const result = addShortcut({ label, book, test, module, part, url: generatedUrl });
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const hostname = (() => {
    try { return new URL(activeUrl).hostname; } catch { return ''; }
  })();

  const parts = MODULE_PARTS[module];

  return (
    <section
      aria-label="Start your practice"
      className="rounded-2xl border transition-colors duration-300
        bg-white dark:bg-navy-800/60
        border-navy-900/8 dark:border-white/8
        shadow-lg shadow-navy-900/5 dark:shadow-none"
    >
      {/* Card header */}
      <div className="px-6 pt-6 pb-5 border-b border-navy-900/6 dark:border-white/6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-ivory-50">
              Start your practice
            </h2>
            <p className="text-sm text-navy-500 dark:text-ivory-400 mt-0.5">Academic • IELTS</p>
          </div>
          {/* Hostname badge */}
          {hostname && urlValid.valid && (
            <span className="text-xs bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full font-medium">
              🌐 {hostname}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Book + Test row */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Book */}
          <div>
            <label htmlFor="book-input" className="block text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-2">
              Cambridge Book
            </label>
            <div className="flex items-center gap-2">
              <input
                id="book-input"
                type="number"
                min={1}
                max={99}
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onBlur={() => {
                  const n = parseInt(bookInput, 10);
                  if (!isNaN(n) && n >= 1) { setBook(n); } else { setBookInput(String(book)); }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = parseInt(bookInput, 10);
                    if (!isNaN(n) && n >= 1) setBook(n);
                  }
                }}
                className="w-20 px-3 py-2.5 rounded-xl border text-center font-bold text-lg
                  border-navy-900/15 dark:border-white/10
                  bg-ivory-50 dark:bg-navy-900/50
                  text-navy-900 dark:text-ivory-50
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  transition-all"
              />
              <div className="flex gap-1.5">
                {[18, 19].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBook(b)}
                    aria-label={`Select Cambridge book ${b}`}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                      ${book === b
                        ? 'bg-teal-500 text-white'
                        : 'bg-ivory-100 dark:bg-navy-700/50 text-navy-600 dark:text-ivory-300 hover:bg-teal-500/10'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test */}
          <div>
            <label className="block text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-2">
              Test
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4].map((t) => (
                <button
                  key={t}
                  onClick={() => setTest(t)}
                  aria-label={`Select test ${t}`}
                  aria-pressed={test === t}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-150
                    ${test === t
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-ivory-100 dark:bg-navy-700/50 text-navy-600 dark:text-ivory-300 hover:bg-teal-500/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Module tabs */}
        <div>
          <p className="text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-2">
            Module
          </p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select module">
            {MODULES.map((m) => (
              <ModuleTab key={m} m={m} active={module === m} onClick={() => setModule(m)} />
            ))}
          </div>
          {!VERIFIED_MODULES.includes(module) && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
              <span aria-hidden="true">⚠️</span>
              <span>
                Routes for <strong>{moduleLabel(module)}</strong> use a configurable template and have not been verified against the live site. Check the URL or use "Customize URL" below before opening.
              </span>
            </p>
          )}
        </div>

        {/* Part selector */}
        <div>
          <p className="text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-2">
            {parts.prefix}
          </p>
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label={`Select ${parts.prefix.toLowerCase()}`}>
            {Array.from({ length: parts.count }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPart(p)}
                aria-label={`${parts.prefix} ${p}`}
                aria-pressed={part === p}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                  ${part === p
                    ? 'bg-amber-400 text-navy-900 shadow-sm'
                    : 'bg-ivory-100 dark:bg-navy-700/50 text-navy-600 dark:text-ivory-300 hover:bg-amber-400/15'}`}
              >
                {partLabel(module, p)}
              </button>
            ))}
          </div>
        </div>

        {/* URL preview */}
        <div className="rounded-xl bg-ivory-100 dark:bg-navy-900/60 border border-navy-900/8 dark:border-white/8 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest">
              Generated URL
            </p>
            {manualUrl !== null && (
              <button
                onClick={handleUseGenerated}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline shrink-0"
              >
                Use generated URL ↩
              </button>
            )}
          </div>
          {manualUrl !== null && (
            <div className="mb-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <span aria-hidden="true">✏️</span> Manual URL override active
            </div>
          )}
          <code className="text-xs text-teal-700 dark:text-teal-300 break-all leading-relaxed font-mono">
            {activeUrl}
          </code>
          {!urlValid.valid && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{urlValid.error}</p>
          )}
        </div>

        {/* Toasts */}
        {toasts.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {toasts.map((t) => (
              <Toast key={t.id} message={t.message} type={t.type} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-1">
          {/* Primary */}
          <button
            onClick={handleOpen}
            disabled={!urlValid.valid}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2
              px-6 py-3 rounded-xl font-semibold text-sm
              bg-teal-500 hover:bg-teal-600 active:scale-95
              text-white shadow-md shadow-teal-500/25
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open practice
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              border border-navy-900/12 dark:border-white/10
              text-navy-700 dark:text-ivory-200
              hover:bg-teal-500/8 hover:border-teal-500/30
              active:scale-95 transition-all duration-150"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy link
          </button>

          {/* Save shortcut */}
          <button
            onClick={handleSaveShortcut}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              border border-navy-900/12 dark:border-white/10
              text-navy-700 dark:text-ivory-200
              hover:bg-amber-400/10 hover:border-amber-400/30
              active:scale-95 transition-all duration-150"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Save shortcut
          </button>
        </div>
      </div>
    </section>
  );
}
