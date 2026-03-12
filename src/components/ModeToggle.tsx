'use client';

import { useMode } from '@/lib/mode-context';
import { DisplayMode } from '@/types';

const modes: { value: DisplayMode; label: string; description: string }[] = [
  { value: 'app', label: 'APP', description: 'Standard dark theme' },
  { value: 'ar', label: 'AR', description: 'XREAL / AR glasses' },
  { value: 'vr', label: 'VR', description: 'Meta Quest WebXR' },
];

export default function ModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div className="flex items-center rounded-lg overflow-hidden border"
      style={{ borderColor: 'var(--border)' }}
    >
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          title={m.description}
          className="px-3 py-1.5 text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer"
          style={{
            background: mode === m.value ? 'var(--accent)' : 'transparent',
            color: mode === m.value ? '#000' : 'var(--text-secondary)',
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
