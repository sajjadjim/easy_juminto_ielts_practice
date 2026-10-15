import { CompassLogo } from './CompassLogo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        {/* Logo container */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-teal-500/20 blur-md" />
          <div className="relative w-9 h-9 rounded-xl
            bg-gradient-to-br from-teal-500/15 to-teal-600/10
            border border-teal-500/20 flex items-center justify-center">
            <CompassLogo size={22} className="text-navy-800" />
          </div>
        </div>

        {/* Brand text */}
        <div>
          <div className="text-base font-black tracking-tight text-navy-900 leading-none">
            IELTS <span className="gradient-text">Compass</span>
          </div>
          <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-navy-400 mt-0.5">
            Navigate your practice
          </div>
        </div>
      </div>
    </header>
  );
}
