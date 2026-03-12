// Songsterr API client
// Docs: https://www.songsterr.com/a/wa/api

export interface SongsterrResult {
  id: number;
  title: string;
  artist: { name: string };
  defaultTrack?: number;
  tracks?: Array<{
    instrumentId: number; // 0 = guitar-like, 1 = bass-like
    tuning?: { strings: number[] };
  }>;
}

/**
 * Search Songsterr for songs matching a query.
 * Returns raw Songsterr results or an empty array on failure.
 */
export async function searchSongsterr(query: string): Promise<SongsterrResult[]> {
  try {
    const url = `https://www.songsterr.com/api/songs?search=${encodeURIComponent(query)}`;
    console.log('[Songsterr] Fetching URL:', url);

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
    console.log('[Songsterr] Response status:', res.status);

    if (!res.ok) {
      console.error(`[Songsterr] API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: SongsterrResult[] = await res.json();
    console.log('[Songsterr] Raw response data:', JSON.stringify(data.slice(0, 3), null, 2));
    console.log('[Songsterr] Total results:', data.length);
    return data;
  } catch (err) {
    console.error('[Songsterr] Fetch failed:', err);
    return [];
  }
}

/**
 * Map a Songsterr result to our internal song shape (partial, for inserting).
 */
export function mapSongsterrToSong(sr: SongsterrResult) {
  // Determine instrument type from default track
  let type: 'guitar' | 'bass' = 'guitar';
  if (sr.tracks && sr.defaultTrack !== undefined) {
    const track = sr.tracks[sr.defaultTrack];
    if (track && track.instrumentId === 1) {
      type = 'bass';
    }
  }

  return {
    title: sr.title,
    artist: sr.artist.name,
    source: 'songsterr' as const,
    source_id: String(sr.id),
    type,
    tuning: 'Standard',
    bpm: null as number | null,
    time_signature: '4/4',
    key_of: null as string | null,
    tab_text: null as string | null,
    gp_file_url: `https://www.songsterr.com/a/ra/player/song/${sr.id}.json`,
    bpm_source: null as string | null,
    bpm_verified: false,
    search_count: 1,
  };
}
