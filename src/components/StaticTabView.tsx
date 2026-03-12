'use client';

import { useMode } from '@/lib/mode-context';

interface StaticTabViewProps {
  tabText: string;
  title: string;
  artist: string;
  bpm: number | null;
  tuning: string;
  keyOf: string | null;
  timeSignature: string;
}

export default function StaticTabView({
  tabText,
  title,
  artist,
  bpm,
  tuning,
  keyOf,
  timeSignature,
}: StaticTabViewProps) {
  const { mode } = useMode();

  return (
    <div className="w-full">
      {/* Song meta */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold ${mode === 'ar' ? 'glow' : ''}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        <p className="text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
          {artist}
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {bpm && (
            <span className="px-2 py-1 rounded-md" style={{ background: 'var(--bg-card)' }}>
              ♩ {bpm} BPM
            </span>
          )}
          <span className="px-2 py-1 rounded-md" style={{ background: 'var(--bg-card)' }}>
            {tuning} tuning
          </span>
          {keyOf && (
            <span className="px-2 py-1 rounded-md" style={{ background: 'var(--bg-card)' }}>
              Key: {keyOf}
            </span>
          )}
          <span className="px-2 py-1 rounded-md" style={{ background: 'var(--bg-card)' }}>
            {timeSignature}
          </span>
        </div>
      </div>

      {/* Tab content */}
      <div
        className="rounded-xl p-6 overflow-x-auto"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <pre
          className={`tab-text ${mode === 'ar' ? 'glow' : ''}`}
          style={{
            color: mode === 'ar' ? 'var(--accent)' : 'var(--text-primary)',
          }}
        >
          {tabText}
        </pre>
      </div>

      {/* BPM credit */}
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
        <a
          href="https://getsongbpm.com"
          target="_blank"
          rel="noopener"
          style={{ color: 'var(--accent-dim)' }}
        >
          BPM data provided by GetSongBPM
        </a>
      </p>
    </div>
  );
}
