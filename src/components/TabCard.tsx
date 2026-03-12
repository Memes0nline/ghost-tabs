'use client';

import Link from 'next/link';
import { SongCard } from '@/types';

interface TabCardProps {
  song: SongCard;
}

export default function TabCard({ song }: TabCardProps) {
  const typeIcon = song.type === 'bass' ? '🎸' : song.type === 'drums' ? '🥁' : '🎵';

  return (
    <Link
      href={`/song/${song.id}`}
      className="block rounded-xl p-4 transition-all duration-200 no-underline group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-hover)';
        e.currentTarget.style.borderColor = 'var(--accent-dim)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {song.title}
          </h3>
          <p
            className="text-sm mt-0.5 truncate"
            style={{ color: 'var(--text-secondary)' }}
          >
            {song.artist}
          </p>
        </div>
        <span className="text-lg flex-shrink-0" aria-label={song.type}>
          {typeIcon}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span
          className="px-2 py-0.5 rounded-md uppercase font-bold tracking-wider"
          style={{ background: 'var(--bg-hover)', color: 'var(--accent)' }}
        >
          {song.type}
        </span>
        <span>{song.tuning}</span>
        {song.bpm && <span>{song.bpm} BPM</span>}
        <span
          className="ml-auto px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
          style={{
            background: song.isPro ? 'rgba(0,255,136,0.15)' : 'transparent',
            color: song.isPro ? 'var(--accent)' : 'var(--text-muted)',
            border: song.isPro ? 'none' : '1px solid var(--border)',
          }}
        >
          {song.isPro ? 'PRO' : 'FREE'}
        </span>
      </div>
    </Link>
  );
}
