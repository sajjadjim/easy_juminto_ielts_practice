import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import type { Module } from '../types';
import {
  MODULE_PARTS, MODULES, VERIFIED_MODULES,
  buildUrl, generateId, isValidUrl, moduleLabel, partLabel, sessionLabel,
} from '../utils';

/* ── Toast ─────────────────────────────────────────── */
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
          ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-sm'
          : 'bg-red-50 text-red-700 border border-red-200 shadow-sm'}`}>
      {type === 'success' ? '✓' : '!'} {message}
    </span>
  );
}

/* ── Module pill ─────────────────────────────────────── */
const MODULE_ICONS: Record<Module, string> = {
  reading: '📖', listening: '🎧', writing: '✍️', speaking: '🎤',
};

function ModulePill({ m, active, onClick }: { m: Module; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold
        transition-all duration-200
        ${active
          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 scale-[1.03]'
          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'}`}>
      <span aria-hidden="true">{MODULE_ICONS[m]}</span>
      {moduleLabel(m)}
      {!VERIFIED_MODULES.includes(m) && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}

/* ── Number button ───────────────────────────────────── */
function NumBtn({ value, active, onClick, label }: {
  value: number | string; active: boolean; onClick: () => void; label: string;
}) {
  return (
    <button onClick={onClick} aria-label={label} aria-pressed={active}
      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/30 scale-105'
          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'}`}>
      {value}
    </button>
  );
}

/* ── Part button (amber) ─────────────────────────────── */
function PartBtn({ p, active, onClick, module }: {
  p: number; active: boolean; onClick: () => void; module: Module;
}) {
  return (
    <button onClick={onClick} aria-label={`${MODULE_PARTS[module].prefix} ${p}`} aria-pressed={active}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-400/35 scale-105'
          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'}`}>
      {partLabel(module, p)}
    </button>
  );
}

/* ── Main component ──────────────────────────────────── */
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
    addSession({ book, test, module, part, url: generatedUrl, openedAt: new Date().toISOString(), status: 'opened' });
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
    showToast('Session opened in a new tab.');
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generatedUrl); showToast('Link copied!'); }
    catch { showToast('Could not copy.', 'error'); }
  };

  const handleSave = () => {
    const label = sessionLabel({ book, test, module, part });
    const r = addShortcut({ label, book, test, module, part, url: generatedUrl });
    showToast(r.message, r.success ? 'success' : 'error');
  };

  const hostname = (() => { try { return new URL(generatedUrl).hostname; } catch { return ''; } })();
  const parts = MODULE_PARTS[module];

  return (
    <section aria-label="Start your practice"
      className="rounded-3xl overflow-hidden bg-white border border-slate-100
        shadow-xl shadow-slate-200/60">

      {/* Header strip */}
      <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-teal-500/5 via-transparent to-amber-400/5
        border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Start your practice</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Academic · IELTS</p>
          </div>
          {hostname && urlValid.valid && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
              bg-teal-50 border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-teal-700">{hostname}</span>
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
              className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Cambridge Book
            </label>
            <div className="flex items-center gap-3">
              <input id="book-input" type="number" min={1} max={99}
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onBlur={() => { const n = parseInt(bookInput, 10); if (!isNaN(n) && n >= 1) setBook(n); else setBookInput(String(book)); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { const n = parseInt(bookInput, 10); if (!isNaN(n) && n >= 1) setBook(n); } }}
                aria-label="Cambridge book number"
                className="w-20 px-2 py-2.5 rounded-xl text-center font-black text-xl
                  bg-slate-50 border border-slate-200 text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                  transition-all" />
              <div className="flex gap-2">
                {[18, 19].map((b) => (
                  <button key={b} onClick={() => setBook(b)} aria-label={`Quick select book ${b}`}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      ${book === b
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Test</p>
            <div className="flex gap-2" role="group" aria-label="Select test">
              {[1, 2, 3, 4].map((t) => (
                <NumBtn key={t} value={t} active={test === t} onClick={() => setTest(t)} label={`Test ${t}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Module ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Module</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select module">
            {MODULES.map((m) => <ModulePill key={m} m={m} active={module === m} onClick={() => setModule(m)} />)}
          </div>
          {!VERIFIED_MODULES.includes(module) && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl
              bg-amber-50 border border-amber-200">
              <span className="text-base shrink-0" aria-hidden="true">⚠️</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>{moduleLabel(module)}</strong> routes use a configurable template and
                have not been verified against the live site. Please confirm the URL before opening.
              </p>
            </div>
          )}
        </div>

        {/* ── Part ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{parts.prefix}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Select ${parts.prefix.toLowerCase()}`}>
            {Array.from({ length: parts.count }, (_, i) => i + 1).map((p) => (
              <PartBtn key={p} p={p} active={part === p} onClick={() => setPart(p)} module={module} />
            ))}
          </div>
        </div>

        {/* ── URL preview ── */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Browser bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-300" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Generated URL</p>
          </div>
          <div className="px-4 py-4 bg-white">
            <code className="text-xs font-mono leading-relaxed break-all text-teal-700 select-all">
              {generatedUrl}
            </code>
            {!urlValid.valid && (
              <p className="mt-2 text-xs text-red-600 font-medium">{urlValid.error}</p>
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
          <button onClick={handleOpen} disabled={!urlValid.valid}
            className="btn-shimmer flex-1 sm:flex-none flex items-center justify-center gap-2
              px-6 py-3.5 rounded-xl font-bold text-sm text-white
              disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open practice
          </button>

          <button onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold
              bg-slate-50 border border-slate-200 text-slate-600
              hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700
              active:scale-95 transition-all duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy link
          </button>

          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold
              bg-slate-50 border border-slate-200 text-slate-600
              hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700
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
