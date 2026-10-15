import './App.css';
import { AppProvider } from './AppContext';
import { Header } from './components/Header';
import { HistoryPanel } from './components/HistoryPanel';
import { PracticeCard } from './components/PracticeCard';
import { ProgressPanel } from './components/ProgressPanel';
import { ShortcutsPanel } from './components/ShortcutsPanel';
import { WelcomeCard } from './components/WelcomeCard';

function Dashboard() {
  return (
    <div className="min-h-screen transition-colors duration-500
      bg-gradient-to-br from-ivory-50 via-ivory-100 to-ivory-200
      dark:from-navy-950 dark:via-navy-900 dark:to-navy-800
      relative overflow-x-hidden">

      {/* Decorative background orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        {/* Light mode orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 dark:opacity-0
          bg-gradient-radial from-teal-300/40 to-transparent blur-3xl transition-opacity duration-700" />
        <div className="absolute top-1/3 -left-48 w-80 h-80 rounded-full opacity-20 dark:opacity-0
          bg-gradient-radial from-amber-300/50 to-transparent blur-3xl transition-opacity duration-700" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-15 dark:opacity-0
          bg-gradient-radial from-violet-400/30 to-transparent blur-3xl transition-opacity duration-700" />

        {/* Dark mode orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-0 dark:opacity-20
          bg-gradient-radial from-teal-500/30 to-transparent blur-3xl transition-opacity duration-700" />
        <div className="absolute top-1/2 -left-60 w-96 h-96 rounded-full opacity-0 dark:opacity-15
          bg-gradient-radial from-violet-500/25 to-transparent blur-3xl transition-opacity duration-700" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-0 dark:opacity-10
          bg-gradient-radial from-amber-500/20 to-transparent blur-3xl transition-opacity duration-700" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.018] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #14b8a6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-fade-up">

        {/* Welcome area */}
        <WelcomeCard />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 items-start">

          {/* Left column */}
          <div className="space-y-6">
            <PracticeCard />
            <ProgressPanel />
            <HistoryPanel />
          </div>

          {/* Right column */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <ShortcutsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 mt-4 border-t
        border-navy-900/6 dark:border-white/5">
        <p className="text-xs text-navy-400 dark:text-navy-200/40 text-center tracking-wide">
          IELTS Compass · Personal practice organiser · All data stored locally in your browser
        </p>
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
