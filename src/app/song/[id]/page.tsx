'use client';

import { use } from 'react';
import Link from 'next/link';
import { getSongById } from '@/lib/sample-data';
import StaticTabView from '@/components/StaticTabView';

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export default function SongPage({ params }: SongPageProps) {
  const { id } = use(params);
  const song = getSongById(id);

  if (!song) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Song not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          This tab doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg font-medium text-sm transition-colors"
          style={{ background: 'var(--accent)', color: '#000' }}
        >
          ← Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors no-underline"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        ← Back to Library
      </Link>

      {/* Static tab viewer */}
      <StaticTabView
        tabText={song.tabText}
        title={song.title}
        artist={song.artist}
        bpm={song.bpm}
        tuning={song.tuning}
        keyOf={song.keyOf}
        timeSignature={song.timeSignature}
      />

      {/* Pro teaser — placeholder for Phase 5 */}
      <div
        className="mt-8 rounded-xl p-6 text-center"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          🎸 Horizontal Playthrough
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Watch the tab scroll in real-time at {song.bpm || 120} BPM — coming in Pro
        </p>
        <button
          className="px-6 py-2 rounded-lg font-medium text-sm cursor-not-allowed opacity-60"
          style={{ background: 'var(--accent)', color: '#000' }}
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}
