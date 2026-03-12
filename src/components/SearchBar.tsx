'use client';

import { useState, useEffect, useCallback } from 'react';
import { SongCard } from '@/types';
import { searchSongs } from '@/lib/sample-data';

interface SearchBarProps {
  onResults: (songs: SongCard[], query: string) => void;
  onNotFound?: (message: string, query: string) => void;
}

export default function SearchBar({ onResults, onNotFound }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced search — hits /api/search, falls back to local sample data
  useEffect(() => {
    if (!query.trim()) {
      onResults(searchSongs(''), '');
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();

        if (data.found && data.songs?.length > 0) {
          onResults(data.songs, query);
        } else {
          // Try local sample data as fallback
          const local = searchSongs(query);
          if (local.length > 0) {
            onResults(local, query);
          } else {
            onResults([], query);
            onNotFound?.(
              data.message ||
                'Not available yet. Your search has been logged and helps us prioritize new songs. Thank you!',
              query
            );
          }
        }
      } catch {
        // API unreachable — fall back to local sample data
        const local = searchSongs(query);
        onResults(local, query);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, onResults, onNotFound]);

  const handleClear = useCallback(() => {
    setQuery('');
    onResults(searchSongs(''), '');
  }, [onResults]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search icon or loading spinner */}
      {loading ? (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5">
          <svg
            className="animate-spin w-5 h-5"
            style={{ color: 'var(--accent)' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: 'var(--text-muted)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs, artists, or tabs..."
        className="w-full pl-12 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:opacity-50"
        style={{
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,255,136,0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
        >
          ×
        </button>
      )}
    </div>
  );
}
