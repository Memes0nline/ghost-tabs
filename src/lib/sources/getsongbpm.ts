// GetSongBPM API client
// Docs: https://getsongbpm.com/api
// Note: Free tier requires a visible dofollow backlink to getsongbpm.com

export interface BpmResult {
  tempo: number;
  time_sig: string;
  key_of: string;
}

/**
 * Look up BPM for a song by title and artist.
 * Returns tempo/time_sig/key or null if not found.
 */
export async function lookupBpm(
  title: string,
  artist: string
): Promise<BpmResult | null> {
  const apiKey = process.env.GETSONGBPM_API_KEY;

  if (!apiKey || apiKey === 'pending_email') {
    console.warn('GetSongBPM API key not configured, skipping BPM lookup');
    return null;
  }

  try {
    const lookup = encodeURIComponent(`${title} ${artist}`);
    const url = `https://api.getsongbpm.com/search/?api_key=${apiKey}&type=song&lookup=${lookup}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`GetSongBPM API error: ${res.status}`);
      return null;
    }

    const data = await res.json();

    // API returns { search: [ { id, title, artist: { name }, tempo, ... } ] }
    if (!data.search || data.search.length === 0) {
      return null;
    }

    const song = data.search[0];
    const tempo = parseInt(song.tempo, 10);

    if (isNaN(tempo) || tempo <= 0) {
      return null;
    }

    return {
      tempo,
      time_sig: song.time_sig || '4/4',
      key_of: song.key_of || null,
    };
  } catch (err) {
    console.error('GetSongBPM fetch failed:', err);
    return null;
  }
}
