import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { AppState, Module, PracticeSession, Shortcut, Theme, UserProfile } from './types';
import { DEFAULT_TEMPLATES, MODULE_PARTS, loadState, saveState } from './utils';

// ── Context ────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  // Profile
  updateProfile: (profile: Partial<UserProfile>) => void;
  // Theme
  setTheme: (theme: Theme) => void;
  // Selection
  setBook: (book: number) => void;
  setTest: (test: number) => void;
  setModule: (module: Module) => void;
  setPart: (part: number) => void;
  // URL Templates
  updateUrlTemplate: (module: Module, template: string) => void;
  resetUrlTemplates: () => void;
  // Shortcuts
  addShortcut: (shortcut: Omit<Shortcut, 'id'>) => { success: boolean; message: string };
  removeShortcut: (id: string) => void;
  renameShortcut: (id: string, label: string) => void;
  // History
  addSession: (session: Omit<PracticeSession, 'id'>) => PracticeSession;
  updateSession: (id: string, updates: Partial<PracticeSession>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist on every state change
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setState((s) => ({ ...s, theme }));
  }, []);

  const setBook = useCallback((book: number) => {
    setState((s) => ({ ...s, selection: { ...s.selection, book } }));
  }, []);

  const setTest = useCallback((test: number) => {
    setState((s) => ({ ...s, selection: { ...s.selection, test } }));
  }, []);

  const setModule = useCallback((module: Module) => {
    setState((s) => {
      const maxParts = MODULE_PARTS[module].count;
      const part = Math.min(s.selection.part, maxParts);
      return { ...s, selection: { ...s.selection, module, part } };
    });
  }, []);

  const setPart = useCallback((part: number) => {
    setState((s) => ({ ...s, selection: { ...s.selection, part } }));
  }, []);

  const updateUrlTemplate = useCallback((module: Module, template: string) => {
    setState((s) => ({
      ...s,
      urlTemplates: { ...s.urlTemplates, [module]: template },
    }));
  }, []);

  const resetUrlTemplates = useCallback(() => {
    setState((s) => ({ ...s, urlTemplates: { ...DEFAULT_TEMPLATES } }));
  }, []);

  const addShortcut = useCallback(
    (shortcut: Omit<Shortcut, 'id'>): { success: boolean; message: string } => {
      const existing = stateRef.current.shortcuts.find(
        (sc) =>
          sc.book === shortcut.book &&
          sc.test === shortcut.test &&
          sc.module === shortcut.module &&
          sc.part === shortcut.part,
      );
      if (existing) {
        return { success: false, message: 'This shortcut already exists.' };
      }
      const id = `sc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setState((s) => ({ ...s, shortcuts: [...s.shortcuts, { ...shortcut, id }] }));
      return { success: true, message: 'Shortcut saved.' };
    },
    [],
  );

  const removeShortcut = useCallback((id: string) => {
    setState((s) => ({ ...s, shortcuts: s.shortcuts.filter((sc) => sc.id !== id) }));
  }, []);

  const renameShortcut = useCallback((id: string, label: string) => {
    setState((s) => ({
      ...s,
      shortcuts: s.shortcuts.map((sc) => (sc.id === id ? { ...sc, label } : sc)),
    }));
  }, []);

  const addSession = useCallback((session: Omit<PracticeSession, 'id'>): PracticeSession => {
    const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const full: PracticeSession = { ...session, id };
    setState((s) => ({ ...s, history: [full, ...s.history] }));
    return full;
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<PracticeSession>) => {
    setState((s) => ({
      ...s,
      history: s.history.map((sess) => (sess.id === id ? { ...sess, ...updates } : sess)),
    }));
  }, []);

  const value: AppContextValue = {
    state,
    updateProfile,
    setTheme,
    setBook,
    setTest,
    setModule,
    setPart,
    updateUrlTemplate,
    resetUrlTemplates,
    addShortcut,
    removeShortcut,
    renameShortcut,
    addSession,
    updateSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
