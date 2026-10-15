import type { AppState, Module, UrlTemplates } from './types';

// ── Constants ──────────────────────────────────────────────────────────────

export const MODULE_PARTS: Record<Module, { label: string; count: number; prefix: string }> = {
  reading:   { label: 'Reading',   count: 3, prefix: 'Part' },
  listening: { label: 'Listening', count: 4, prefix: 'Part' },
  writing:   { label: 'Writing',   count: 2, prefix: 'Task' },
  speaking:  { label: 'Speaking',  count: 3, prefix: 'Part' },
};

export const MODULES: Module[] = ['reading', 'listening', 'writing', 'speaking'];

export const DEFAULT_TEMPLATES: UrlTemplates = {
  reading:   'https://jumpinto.com/ielts/practice/academic/{book}/{test}/{module}/{part}',
  listening: 'https://jumpinto.com/ielts/practice/academic/{book}/{test}/{module}/{part}',
  writing:   'https://jumpinto.com/ielts/practice/academic/{book}/{test}/{module}/{part}',
  speaking:  'https://jumpinto.com/ielts/practice/academic/{book}/{test}/{module}/{part}',
};

export const VERIFIED_MODULES: Module[] = ['reading'];

export const DEFAULT_STATE: AppState = {
  profile:   { name: '', targetBand: '', examDate: '' },
  selection: { book: 18, test: 1, module: 'reading', part: 1 },
  urlTemplates: { ...DEFAULT_TEMPLATES },
  shortcuts: [],
  history:   [],
};

export const DAILY_MESSAGES = [
  'Small steps today. Greater confidence tomorrow.',
  'Every practice session brings you closer to your goal.',
  'Consistency is the foundation of excellence.',
  'Your effort today is your success tomorrow.',
  'Focus, practice, achieve. You have got this.',
  'The journey of a thousand miles begins with a single step.',
  'Progress is progress, no matter how small.',
];

// ── URL Utilities ──────────────────────────────────────────────────────────

export function buildUrl(template: string, book: number, test: number, module: Module, part: number): string {
  return template
    .replace('{book}', String(book))
    .replace('{test}', String(test))
    .replace('{module}', module)
    .replace('{part}', String(part));
}

export function isValidUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol))
      return { valid: false, error: 'Only http and https URLs are allowed.' };
    return { valid: true };
  } catch {
    return { valid: false, error: 'The URL is not valid.' };
  }
}

export function parseJumpIntoUrl(url: string): { book: number; test: number; module: Module; part: number } | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 7) return null;
    if (parts[0] !== 'ielts' || parts[1] !== 'practice') return null;
    const book = parseInt(parts[3], 10);
    const test = parseInt(parts[4], 10);
    const moduleStr = parts[5] as Module;
    const part = parseInt(parts[6], 10);
    if (isNaN(book) || isNaN(test) || isNaN(part)) return null;
    if (!MODULES.includes(moduleStr)) return null;
    const maxParts = MODULE_PARTS[moduleStr].count;
    if (part < 1 || part > maxParts) return null;
    if (test < 1 || test > 4) return null;
    return { book, test, module: moduleStr, part };
  } catch {
    return null;
  }
}

// ── Date Utilities ─────────────────────────────────────────────────────────

export function getDailyMessage(): string {
  const day = new Date().getDay();
  return DAILY_MESSAGES[day % DAILY_MESSAGES.length];
}

export function getDaysRemaining(examDate: string): number | null {
  if (!examDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate); exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const uniqueDays = [...new Set(completedDates.map((d) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }))].sort((a, b) => b.localeCompare(a));
  if (uniqueDays.length === 0) return 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
  if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yStr) return 0;
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    if (Math.round((prev.getTime() - curr.getTime()) / (1000*60*60*24)) === 1) streak++;
    else break;
  }
  return streak;
}

// ── LocalStorage ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'ielts-compass-v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      profile:      { ...DEFAULT_STATE.profile,      ...parsed.profile },
      selection:    { ...DEFAULT_STATE.selection,    ...parsed.selection },
      urlTemplates: { ...DEFAULT_TEMPLATES,          ...parsed.urlTemplates },
      shortcuts:    parsed.shortcuts ?? [],
      history:      parsed.history   ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
export function moduleLabel(m: Module): string { return MODULE_PARTS[m].label; }
export function partLabel(m: Module, part: number): string {
  return `${MODULE_PARTS[m].prefix} ${part}`;
}
export function sessionLabel(s: { book: number; test: number; module: Module; part: number }): string {
  return `Cambridge ${s.book} · Test ${s.test} · ${moduleLabel(s.module)} · ${partLabel(s.module, s.part)}`;
}
