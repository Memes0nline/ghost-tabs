'use client';

import { useState, useCallback, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import TabCard from '@/components/TabCard';
import { sampleSongCards } from '@/lib/sample-data';
import { SongCard } from '@/types';

export default function HomePage() {
  const [results, setResults] = useState<SongCard[]>(sampleSongCards);
  const [query, setQuery] = useState('');
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);

  // On initial load, try fetching popular songs from Supabase
  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch('/api/search?q=');
        const data = await res.json();
        if (data.found && data.songs?.length > 0) {
          setResults(data.songs);
        }
        // If Supabase returns empty, keep sample data (already set as default)
      } catch {
        // API unavailable — keep sample data
      }
    }
    fetchPopular();
  }, []);

  const handleResults = useCallback((songs: SongCard[], q: string) => {
    setQuery(q);
    setResults(songs);
    setNotFoundMsg(null);
  }, []);

  const handleNotFound = useCallback((message: string, _q: string) => {
    setNotFoundMsg(message);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Find your <span style={{ color: 'var(--accent)' }}>tabs</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Guitar &amp; bass tabs — search, view, and play
        </p>
      </div>

      {/* Search */}
      <SearchBar onResults={handleResults} onNotFound={handleNotFound} />

      {/* Results info */}
      <div className="mt-6 mb-4 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>
          {query
            ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : `${results.length} songs available`}
        </span>
      </div>

      {/* Song list */}
      {results.length > 0 ? (
        <div className="grid gap-3">
          {results.map((song) => (
            <TabCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            No tabs found for &quot;{query}&quot;
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {notFoundMsg ||
              'Your search has been logged and helps us prioritize new songs. Thank you!'}
          </p>
        </div>
      )}
    </div>
  );
}
