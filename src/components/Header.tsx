import { useApp } from '../AppContext';
import { CompassLogo } from './CompassLogo';

export function Header() {
  const { state, setTheme } = useApp();
  const isDark = state.theme === 'dark';

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Glass surface */}
      <div className={`${isDark ? 'glass-dark' : 'glass-light'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-teal-500/20 blur-md" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-600/10
                dark:from-teal-400/20 dark:to-teal-600/15
                border border-teal-500/20 dark:border-teal-400/20
                flex items-center justify-center">
                <CompassLogo size={24} className="text-navy-800 dark:text-ivory-100" />
              </div>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-navy-900 dark:text-ivory-50 leading-none">
                IELTS{' '}
                <span className="gradient-text">Compass</span>
              </div>
              <div className="text-[10px] font-medium tracking-[0.12em] uppercase
                text-navy-400 dark:text-teal-400/70 mt-0.5">
                Navigate your practice
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-200
                hover:bg-teal-500/10 dark:hover:bg-teal-400/10
                group"
            >
              <span className="absolute inset-0 rounded-xl ring-0 ring-teal-500/30 group-hover:ring-2 transition-all duration-200" />
              {isDark ? (
                /* Sun */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-amber-400 transition-transform duration-300 group-hover:rotate-45"
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-navy-600 transition-transform duration-300 group-hover:-rotate-12"
                  aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
