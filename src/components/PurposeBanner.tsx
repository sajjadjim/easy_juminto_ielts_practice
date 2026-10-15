export function PurposeBanner() {
  return (
    <div
      aria-label="About IELTS Compass"
      className="relative rounded-2xl overflow-hidden border border-teal-200/70 shadow-lg shadow-teal-500/8"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-white to-amber-50" />
      {/* Left accent bar */}
      <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-teal-400 via-teal-500 to-amber-400 rounded-l-2xl" />

      <div className="relative px-6 sm:px-8 py-4 sm:py-5 pl-7 sm:pl-9 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

        {/* Quote icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          bg-gradient-to-br from-teal-500 to-teal-600 shadow-md shadow-teal-500/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
            className="text-white opacity-90" aria-hidden="true">
            <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.123.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.375c-.271.05-.56.187-.882.312C7.309 4.813 6.987 4.995 6.635 5.19c-.328.157-.68.408-.988.645-.336.220-.656.476-.95.765C4.387 6.85 4.087 7.165 3.816 7.513 3.505 7.819 3.259 8.185 3.039 8.562 2.826 8.93 2.622 9.321 2.479 9.733c-.157.409-.264.839-.341 1.268-.077.472-.107.926-.107 1.392 0 .654.078 1.285.264 1.88.185.598.479 1.13.855 1.57.396.47.875.83 1.413 1.058.542.228 1.13.337 1.717.337.913 0 1.722-.308 2.37-.88.647-.566 1.003-1.35 1.003-2.266 0-.88-.347-1.658-.956-2.245C8.209 10.315 7.405 10 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.123.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.201-.271.05-.56.187-.882.312-.282.126-.604.308-.956.503-.328.157-.68.408-.988.645-.336.220-.656.476-.95.765-.31.306-.61.621-.881.969-.311.306-.557.672-.777 1.049-.213.368-.417.759-.56 1.171-.157.409-.264.839-.341 1.268-.077.472-.107.926-.107 1.392 0 .654.078 1.285.264 1.88.185.598.479 1.13.855 1.57.396.47.875.83 1.413 1.058.542.228 1.13.337 1.717.337.913 0 1.722-.308 2.37-.88.647-.566 1.003-1.35 1.003-2.266 0-.88-.347-1.658-.956-2.245C19.209 10.315 18.405 10 17.5 10z"/>
          </svg>
        </div>

        {/* Text block */}
        <div className="flex-1 min-w-0">
          {/* Bangla */}
          <p className="text-sm sm:text-base font-bold text-navy-800 leading-snug mb-1"
            lang="bn">
            ক্যামব্রিজ বই, টেস্ট, মডিউল ও পার্ট বেছে নিয়ে{' '}
            <span className="text-teal-600">সঠিক IELTS অনুশীলন পৃষ্ঠায়</span>{' '}
            মুহূর্তেই চলে যাও।
          </p>
          {/* English */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed" lang="en">
            Pick your Cambridge book, test, module &amp; part — and jump straight to the right{' '}
            <span className="text-teal-600 font-semibold">IELTS practice page</span> in one click.
          </p>
        </div>

        {/* Right badge */}
        <div className="hidden sm:flex shrink-0 flex-col items-center gap-1
          px-4 py-2.5 rounded-xl bg-teal-500/8 border border-teal-200">
          <span className="text-xl" aria-hidden="true">🎯</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 text-center leading-tight">
            Jump<br/>Into
          </span>
        </div>
      </div>
    </div>
  );
}
