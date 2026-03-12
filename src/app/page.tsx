'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import TabCard from '@/components/TabCard';
import { searchSongs, sampleSongCards } from '@/lib/sample-data';
import { SongCard } from '@/types';

export default function HomePage() {
  const [results, setResults] = useState<SongCard[]>(sampleSongCards);
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setResults(searchSongs(q));
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
      <SearchBar onSearch={handleSearch} />

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
            Your search has been logged and helps us prioritize new songs. Thank you!
          </p>
        </div>
      )}
    </div>
  );
}
