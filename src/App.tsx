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
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-ivory-100 to-ivory-200 relative overflow-x-hidden">

      {/* Decorative background orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40
          bg-gradient-radial from-teal-300/40 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-48 w-80 h-80 rounded-full opacity-25
          bg-gradient-radial from-amber-300/50 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-20
          bg-gradient-radial from-violet-400/30 to-transparent blur-3xl" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, #14b8a6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-fade-up">
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

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 mt-4 border-t border-navy-900/6">
        <p className="text-xs text-navy-400 text-center tracking-wide">
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
