'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DisplayMode } from '@/types';

interface ModeContextType {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'app',
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DisplayMode>('app');

  // Apply CSS class to body when mode changes
  useEffect(() => {
    document.body.classList.remove('mode-app', 'mode-ar', 'mode-vr');
    document.body.classList.add(`mode-${mode}`);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
