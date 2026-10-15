import './App.css';
import { AppProvider } from './AppContext';
import { CustomCursor } from './components/CustomCursor';
import { PurposeBanner } from './components/PurposeBanner';
import { Header } from './components/Header';
import { HistoryPanel } from './components/HistoryPanel';
import { PracticeCard } from './components/PracticeCard';
import { ProgressPanel } from './components/ProgressPanel';
import { ShortcutsPanel } from './components/ShortcutsPanel';
import { WelcomeCard } from './components/WelcomeCard';

function Dashboard() {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ cursor: 'none' }}
    >
      {/* ── Background ─────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-ivory-100" />

      {/* Decorative orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30
          bg-gradient-radial from-teal-200/60 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-48 w-80 h-80 rounded-full opacity-25
          bg-gradient-radial from-amber-200/60 to-transparent blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full opacity-15
          bg-gradient-radial from-violet-200/50 to-transparent blur-3xl" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      {/* ── Custom cursor ───────────────────────────────── */}
      <CustomCursor />

      {/* ── Layout ─────────────────────────────────────── */}
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-5 sm:space-y-6 animate-fade-up">
        <PurposeBanner />
        <WelcomeCard />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 items-start">
          <div className="space-y-6">
            <PracticeCard />
            <ProgressPanel />
            <HistoryPanel />
          </div>
          <div className="lg:sticky lg:top-24 space-y-6">
            <ShortcutsPanel />
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="mt-12 border-t border-slate-200/70 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600
                flex items-center justify-center shadow-md shadow-teal-500/25">
                <span className="text-white text-sm font-black">IC</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">
                  IELTS <span className="gradient-text">Compass</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Navigate your practice
                </p>
              </div>
            </div>

            {/* Developer credit */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-slate-500 font-medium">
                Designed & built by
              </p>
              <p className="text-sm font-black text-slate-800 tracking-tight">
                Sajjad Hossain Jim
              </p>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/sajjadjim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sajjad Hossain Jim's GitHub profile"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                bg-slate-900 hover:bg-slate-700
                text-white text-sm font-semibold
                shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30
                transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              {/* GitHub icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              @GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 tracking-wide">
              All practice data stored locally in your browser · No account required ·{' '}
              <span className="text-teal-500 font-medium">Open source</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
