import { useState } from 'react';
import { useApp } from '../AppContext';
import type { Module } from '../types';
import { DEFAULT_TEMPLATES, MODULES, buildUrl, isValidUrl, moduleLabel, parseJumpIntoUrl } from '../utils';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function UrlSettingsPanel() {
  const { state, updateUrlTemplate, resetUrlTemplates, setBook, setTest, setModule, setPart } = useApp();
  const { urlTemplates, selection } = state;

  const [open, setOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [templateErrors, setTemplateErrors] = useState<Partial<Record<Module, string>>>({});

  const { book, test, module, part } = selection;
  const previewUrl = buildUrl(urlTemplates[module], book, test, module, part);
  const previewValid = isValidUrl(previewUrl);

  const handleTemplateChange = (m: Module, value: string) => {
    updateUrlTemplate(m, value);
    // Validate
    const built = buildUrl(value, 1, 1, m, 1);
    const result = isValidUrl(built);
    setTemplateErrors((prev) => ({
      ...prev,
      [m]: result.valid ? undefined : result.error,
    }));
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess('');
    const trimmed = importUrl.trim();
    if (!trimmed) {
      setImportError('Please enter a URL to import.');
      return;
    }
    const urlCheck = isValidUrl(trimmed);
    if (!urlCheck.valid) {
      setImportError(urlCheck.error ?? 'Invalid URL.');
      return;
    }
    const parsed = parseJumpIntoUrl(trimmed);
    if (!parsed) {
      setImportError(
        'Could not parse this URL. It may not match the supported structure: /ielts/practice/academic/{book}/{test}/{module}/{part}',
      );
      return;
    }
    setBook(parsed.book);
    setTest(parsed.test);
    setModule(parsed.module);
    setPart(parsed.part);
    setImportUrl('');
    setImportSuccess(
      `Imported: Book ${parsed.book}, Test ${parsed.test}, ${moduleLabel(parsed.module)}, Part ${parsed.part}.`,
    );
    setTimeout(() => setImportSuccess(''), 4000);
  };

  return (
    <section aria-label="URL settings">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200
          bg-white dark:bg-navy-800/40
          border-navy-900/8 dark:border-white/8
          text-navy-700 dark:text-ivory-200
          hover:border-teal-500/30 hover:bg-teal-500/5
          shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="text-teal-500" aria-hidden="true">⚙️</span>
          <span className="font-semibold text-sm">Customize URL templates</span>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="mt-2 rounded-2xl border p-6 space-y-6 transition-colors duration-300
          bg-white dark:bg-navy-800/40
          border-navy-900/8 dark:border-white/8
          shadow-sm">

          {/* Import URL */}
          <div>
            <h3 className="text-sm font-bold text-navy-800 dark:text-ivory-100 mb-1">
              Import a practice URL
            </h3>
            <p className="text-xs text-navy-500 dark:text-ivory-400 mb-3">
              Paste a JumpInto practice URL to auto-populate the selectors.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://jumpinto.com/ielts/practice/academic/..."
                aria-label="Import practice URL"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-sm font-mono
                  border-navy-900/15 dark:border-white/10
                  bg-ivory-50 dark:bg-navy-900/50
                  text-navy-900 dark:text-ivory-50
                  placeholder:text-navy-400 dark:placeholder:text-ivory-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleImport()}
              />
              <button
                onClick={handleImport}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold
                  transition-all active:scale-95 shrink-0"
              >
                Import
              </button>
            </div>
            {importError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{importError}</p>
            )}
            {importSuccess && (
              <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">✓ {importSuccess}</p>
            )}
          </div>

          <hr className="border-navy-900/8 dark:border-white/8" />

          {/* URL Templates per module */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy-800 dark:text-ivory-100">
                URL templates
              </h3>
              <button
                onClick={() => { resetUrlTemplates(); setTemplateErrors({}); }}
                className="text-xs text-navy-500 dark:text-ivory-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Reset to defaults
              </button>
            </div>
            <p className="text-xs text-navy-500 dark:text-ivory-400 mb-4">
              Use <code className="bg-teal-500/10 px-1 py-0.5 rounded text-teal-700 dark:text-teal-300">{'{book}'}</code>{' '}
              <code className="bg-teal-500/10 px-1 py-0.5 rounded text-teal-700 dark:text-teal-300">{'{test}'}</code>{' '}
              <code className="bg-teal-500/10 px-1 py-0.5 rounded text-teal-700 dark:text-teal-300">{'{module}'}</code>{' '}
              <code className="bg-teal-500/10 px-1 py-0.5 rounded text-teal-700 dark:text-teal-300">{'{part}'}</code>{' '}
              as placeholders.
            </p>

            <div className="space-y-4">
              {MODULES.map((m) => {
                const isDefault = urlTemplates[m] === DEFAULT_TEMPLATES[m];
                return (
                  <div key={m}>
                    <label
                      htmlFor={`template-${m}`}
                      className="block text-xs font-semibold text-navy-500 dark:text-ivory-400 uppercase tracking-widest mb-1.5"
                    >
                      {moduleLabel(m)}
                      {!isDefault && (
                        <span className="ml-2 text-amber-500 dark:text-amber-400 normal-case font-normal tracking-normal">
                          (modified)
                        </span>
                      )}
                    </label>
                    <input
                      id={`template-${m}`}
                      type="text"
                      value={urlTemplates[m]}
                      onChange={(e) => handleTemplateChange(m, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono
                        border-navy-900/15 dark:border-white/10
                        bg-ivory-50 dark:bg-navy-900/50
                        text-navy-900 dark:text-ivory-50
                        focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                    {templateErrors[m] && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{templateErrors[m]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-navy-900/8 dark:border-white/8" />

          {/* Current preview */}
          <div>
            <h3 className="text-sm font-bold text-navy-800 dark:text-ivory-100 mb-2">
              Current selection preview
            </h3>
            <div className="rounded-xl bg-ivory-100 dark:bg-navy-900/60 px-4 py-3">
              <code className="text-xs font-mono text-teal-700 dark:text-teal-300 break-all leading-relaxed">
                {previewUrl}
              </code>
            </div>
            {!previewValid.valid && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{previewValid.error}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
