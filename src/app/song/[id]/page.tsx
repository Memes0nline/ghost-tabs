'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getSongById } from '@/lib/sample-data';
import StaticTabView from '@/components/StaticTabView';

interface SongData {
  id: string;
  title: string;
  artist: string;
  tab_text?: string;
  tabText?: string;
  bpm: number | null;
  tuning: string;
  key_of?: string | null;
  keyOf?: string | null;
  time_signature?: string;
  timeSignature?: string;
}

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export default function SongPage({ params }: SongPageProps) {
  const { id } = use(params);
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSong() {
      // Try API first
      try {
        const res = await fetch(`/api/songs/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            setSong(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // API unreachable — fall through to sample data
      }

      // Fall back to local sample data
      const local = getSongById(id);
      if (local) {
        setSong({
          id: local.id,
          title: local.title,
          artist: local.artist,
          tabText: local.tabText,
          bpm: local.bpm,
          tuning: local.tuning,
          keyOf: local.keyOf,
          timeSignature: local.timeSignature,
        });
      }
      setLoading(false);
    }
    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>Loading tab...</p>
      </div>
    );
  }

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

  // Normalize field names (API returns snake_case, local data uses camelCase)
  const tabText = song.tab_text || song.tabText || '';
  const keyOf = song.key_of ?? song.keyOf ?? null;
  const timeSignature = song.time_signature || song.timeSignature || '4/4';

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
        tabText={tabText}
        title={song.title}
        artist={song.artist}
        bpm={song.bpm}
        tuning={song.tuning}
        keyOf={keyOf}
        timeSignature={timeSignature}
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
          Horizontal Playthrough
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
