// ── Types ──────────────────────────────────────────────────────────────────

export type Module = 'reading' | 'listening' | 'writing' | 'speaking';
export type Theme = 'light' | 'dark';

export interface PracticeSession {
  id: string;
  book: number;
  test: number;
  module: Module;
  part: number;
  url: string;
  openedAt: string; // ISO date string
  status: 'opened' | 'completed';
  completedAt?: string;
  confidenceRating?: number; // 1-5
  notes?: string;
  score?: string;
}

export interface Shortcut {
  id: string;
  label: string;
  book: number;
  test: number;
  module: Module;
  part: number;
  url: string;
}

export interface UrlTemplates {
  reading: string;
  listening: string;
  writing: string;
  speaking: string;
}

export interface UserProfile {
  name: string;
  targetBand: string;
  examDate: string; // ISO date string or ''
}

export interface AppState {
  profile: UserProfile;
  theme: Theme;
  selection: {
    book: number;
    test: number;
    module: Module;
    part: number;
  };
  urlTemplates: UrlTemplates;
  shortcuts: Shortcut[];
  history: PracticeSession[];
}
