import { useCallback, useEffect, useState } from 'react';
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

/* ── Toast ─────────────────────────────────────────────── */
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

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <span role="status" aria-live="polite"
      className={`animate-fade-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
        ${type === 'success'
          ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25'
          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25'}`}
    >
      {type === 'success' ? '✓' : '!'} {message}
    </span>
  );
}

/* ── Module pill ─────────────────────────────────────────── */
const MODULE_ICONS: Record<Module, string> = {
  reading: '📖', listening: '🎧', writing: '✍️', speaking: '🎤',
};

function ModulePill({ m, active, onClick }: { m: Module; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
        transition-all duration-200 relative group
        ${active
          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
          : `text-navy-600 dark:text-ivory-300
             hover:bg-teal-500/8 dark:hover:bg-teal-400/10
             hover:text-teal-700 dark:hover:text-teal-300
             border border-transparent hover:border-teal-500/20`}`}
    >
      <span aria-hidden="true">{MODULE_ICONS[m]}</span>
      {moduleLabel(m)}
      {!VERIFIED_MODULES.includes(m) && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────── */
export function PracticeCard() {
  const { state, setBook, setTest, setModule, setPart, addShortcut, addSession } = useApp();
  const { selection, urlTemplates } = state;
  const { book, test, module, part } = selection;

  const [bookInput, setBookInput] = useState(String(book));
  const { toasts, show: showToast } = useToast();

  const generatedUrl = buildUrl(urlTemplates[module], book, test, module, part);
  const urlValid = isValidUrl(generatedUrl);

  useEffect(() => { setBookInput(String(book)); }, [book]);

  const handleOpen = () => {
    if (!urlValid.valid) return;
    addSession({
      book, test, module, part,
      url: generatedUrl,
      openedAt: new Date().toISOString(),
      status: 'opened',
    });
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
    showToast('Session opened in a new tab.');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
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

  const hostname = (() => { try { return new URL(generatedUrl).hostname; } catch { return ''; } })();
  const parts = MODULE_PARTS[module];

  /* Number picker button */
  const NumBtn = ({
    value, active, onClick, label,
  }: { value: number | string; active: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 scale-105'
          : `bg-navy-900/4 dark:bg-white/5
             text-navy-600 dark:text-ivory-300
             border border-navy-900/8 dark:border-white/8
             hover:bg-teal-500/12 hover:border-teal-500/25 hover:text-teal-700 dark:hover:text-teal-300`}`}
    >
      {value}
    </button>
  );

  /* Part button (amber accent) */
  const PartBtn = ({
    p, active, onClick,
  }: { p: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-label={`${parts.prefix} ${p}`}
      aria-pressed={active}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-navy-900 shadow-md shadow-amber-400/30 scale-105'
          : `bg-navy-900/4 dark:bg-white/5
             text-navy-600 dark:text-ivory-300
             border border-navy-900/8 dark:border-white/8
             hover:bg-amber-400/12 hover:border-amber-400/25 hover:text-amber-700 dark:hover:text-amber-300`}`}
    >
      {partLabel(module, p)}
    </button>
  );

  return (
    <section
      aria-label="Start your practice"
      className="rounded-3xl overflow-hidden transition-all duration-300
        bg-white dark:bg-navy-800/70
        border border-navy-900/6 dark:border-white/6
        shadow-xl shadow-navy-900/6 dark:shadow-black/30
        backdrop-blur-sm"
    >
      {/* Card header strip */}
      <div className="px-6 sm:px-8 pt-6 pb-5
        border-b border-navy-900/5 dark:border-white/5
        bg-gradient-to-r from-teal-500/4 via-transparent to-amber-400/4
        dark:from-teal-500/8 dark:via-transparent dark:to-amber-400/6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-black text-navy-900 dark:text-ivory-50 tracking-tight">
              Start your practice
            </h2>
            <p className="text-xs font-semibold text-navy-400 dark:text-ivory-400 mt-0.5 uppercase tracking-widest">
              Academic · IELTS
            </p>
          </div>
          {hostname && urlValid.valid && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
              bg-teal-500/10 dark:bg-teal-400/10
              border border-teal-500/20 dark:border-teal-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-glow shrink-0" />
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">{hostname}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-8 py-7 space-y-7">

        {/* ── Book + Test ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Book */}
          <div className="space-y-3">
            <label htmlFor="book-input"
              className="block text-[11px] font-bold uppercase tracking-[0.18em]
                text-navy-400 dark:text-ivory-400">
              Cambridge Book
            </label>
            <div className="flex items-center gap-3">
              <input
                id="book-input"
                type="number" min={1} max={99}
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onBlur={() => {
                  const n = parseInt(bookInput, 10);
                  if (!isNaN(n) && n >= 1) setBook(n);
                  else setBookInput(String(book));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = parseInt(bookInput, 10);
                    if (!isNaN(n) && n >= 1) setBook(n);
                  }
                }}
                aria-label="Cambridge book number"
                className="field w-20 px-2 py-2.5 rounded-xl text-center font-black text-lg
                  text-navy-900 dark:text-ivory-50 focus:outline-none transition-all"
              />
              <div className="flex gap-2 cursor-pointer">
                {[21, 20].map((b) => (
                  <button key={b} onClick={() => setBook(b)}
                    aria-label={`Quick select book ${b}`}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      ${book === b
                        ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25'
                        : 'bg-navy-900/4 dark:bg-white/5 text-navy-600 dark:text-ivory-300 border border-navy-900/8 dark:border-white/8 hover:bg-teal-500/10'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-400 dark:text-ivory-400">
              Test
            </p>
            <div className="flex gap-2" role="group" aria-label="Select test">
              {[1, 2, 3, 4].map((t) => (
                <NumBtn key={t} value={t} active={test === t}
                  onClick={() => setTest(t)} label={`Test ${t}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Module ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-400 dark:text-ivory-400">
            Module
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select module">
            {MODULES.map((m) => (
              <ModulePill key={m} m={m} active={module === m} onClick={() => setModule(m)} />
            ))}
          </div>
          {!VERIFIED_MODULES.includes(module) && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl
              bg-amber-400/8 dark:bg-amber-400/10
              border border-amber-400/20 dark:border-amber-400/20">
              <span className="text-base shrink-0" aria-hidden="true">⚠️</span>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <strong>{moduleLabel(module)}</strong> routes use a configurable template and have not been verified against the live site. Please confirm the URL before opening.
              </p>
            </div>
          )}
        </div>

        {/* ── Part ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-400 dark:text-ivory-400">
            {parts.prefix}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Select ${parts.prefix.toLowerCase()}`}>
            {Array.from({ length: parts.count }, (_, i) => i + 1).map((p) => (
              <PartBtn key={p} p={p} active={part === p} onClick={() => setPart(p)} />
            ))}
          </div>
        </div>

        {/* ── URL preview ── */}
        <div className="rounded-2xl overflow-hidden border border-navy-900/8 dark:border-white/8">
          <div className="px-4 py-2.5 bg-navy-900/3 dark:bg-white/3
            border-b border-navy-900/6 dark:border-white/6
            flex items-center gap-2">
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400/60" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400 dark:text-ivory-500 ml-1">
              Generated URL
            </p>
          </div>
          <div className="px-4 py-3.5 bg-navy-900/2 dark:bg-navy-950/50">
            <code className="text-xs font-mono leading-relaxed break-all
              text-teal-700 dark:text-teal-300">
              {generatedUrl}
            </code>
            {!urlValid.valid && (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{urlValid.error}</p>
            )}
          </div>
        </div>

        {/* ── Toasts ── */}
        {toasts.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} />)}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 pt-1">
          {/* Primary */}
          <button
            onClick={handleOpen}
            disabled={!urlValid.valid}
            className="btn-shimmer flex-1 sm:flex-none flex items-center justify-center gap-2
              px-6 py-3 rounded-xl font-bold text-sm text-white
              disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open practice
          </button>

          {/* Copy */}
          <button onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold
              border border-navy-900/10 dark:border-white/10
              text-navy-600 dark:text-ivory-300
              hover:bg-teal-500/8 hover:border-teal-500/25 hover:text-teal-700 dark:hover:text-teal-300
              active:scale-95 transition-all duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy link
          </button>

          {/* Save shortcut */}
          <button onClick={handleSaveShortcut}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold
              border border-navy-900/10 dark:border-white/10
              text-navy-600 dark:text-ivory-300
              hover:bg-amber-400/10 hover:border-amber-400/25 hover:text-amber-700 dark:hover:text-amber-300
              active:scale-95 transition-all duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Save shortcut
          </button>
        </div>
      </div>
    </section>
  );
}
