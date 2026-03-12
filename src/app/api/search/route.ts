import { NextRequest, NextResponse } from 'next/server';
import { supabase, getServiceClient } from '@/lib/supabase';
import { searchSongsterr, mapSongsterrToSong } from '@/lib/sources/songsterr';
import { lookupBpm } from '@/lib/sources/getsongbpm';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ found: false, songs: [], message: 'No query provided' });
  }

  // 1. Check Supabase songs table for cached results
  const { data: cachedSongs, error: cacheError } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
    .order('search_count', { ascending: false })
    .limit(20);

  if (!cacheError && cachedSongs && cachedSongs.length > 0) {
    // Increment search_count for each returned song
    for (const song of cachedSongs) {
      await supabase
        .from('songs')
        .update({ search_count: (song.search_count || 0) + 1 })
        .eq('id', song.id);
    }

    return NextResponse.json({
      found: true,
      songs: cachedSongs.map(mapDbSongToCard),
      source: 'cache',
    });
  }

  // 2. Query Songsterr API
  const songsterrResults = await searchSongsterr(q);

  if (songsterrResults.length > 0) {
    const serviceClient = getServiceClient();
    const savedSongs = [];

    for (const sr of songsterrResults.slice(0, 10)) {
      const mapped = mapSongsterrToSong(sr);

      // 3. Fetch BPM in parallel for each song
      const bpmResult = await lookupBpm(mapped.title, mapped.artist);

      if (bpmResult) {
        mapped.bpm = bpmResult.tempo;
        mapped.time_signature = bpmResult.time_sig;
        mapped.key_of = bpmResult.key_of;
        mapped.bpm_source = 'getsongbpm';
        mapped.bpm_verified = true;
      }

      // 4. Save to Supabase songs table (upsert by source + source_id)
      const { data: upserted, error: upsertError } = await serviceClient
        .from('songs')
        .upsert(mapped, { onConflict: 'source,source_id', ignoreDuplicates: false })
        .select()
        .single();

      if (!upsertError && upserted) {
        savedSongs.push(upserted);
      } else {
        // If upsert fails (e.g., no unique constraint yet), still return data
        savedSongs.push({ ...mapped, id: sr.id.toString() });
      }
    }

    return NextResponse.json({
      found: true,
      songs: savedSongs.map(mapDbSongToCard),
      source: 'songsterr',
    });
  }

  // 5. Nothing found — log the request
  try {
    const serviceClient = getServiceClient();
    const { data: existing } = await serviceClient
      .from('song_requests')
      .select('id, request_count')
      .eq('query', q.toLowerCase())
      .single();

    if (existing) {
      await serviceClient
        .from('song_requests')
        .update({
          request_count: existing.request_count + 1,
          last_requested_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await serviceClient
        .from('song_requests')
        .insert({ query: q.toLowerCase() });
    }
  } catch (err) {
    console.error('Failed to log song request:', err);
  }

  return NextResponse.json({
    found: false,
    songs: [],
    message:
      'Not available yet. Your search has been logged and helps us prioritize new songs. Thank you!',
  });
}

// Helper to map a DB row to the card shape the frontend expects
function mapDbSongToCard(song: Record<string, unknown>) {
  return {
    id: String(song.id),
    title: song.title as string,
    artist: song.artist as string,
    type: (song.type as string) || 'guitar',
    tuning: (song.tuning as string) || 'Standard',
    bpm: song.bpm as number | null,
    isPro: false, // all fetched songs are free tier for now
  };
}
