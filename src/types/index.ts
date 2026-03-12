// Ghost Tabs - TypeScript Interfaces

export type InstrumentType = 'guitar' | 'bass' | 'drums';
export type DisplayMode = 'app' | 'ar' | 'vr';
export type UserTier = 'free' | 'pro';
export type TabSource = 'songsterr' | 'ultimate_guitar' | 'manual';
export type BpmSource = 'getsongbpm' | 'musicbrainz' | 'manual';

export interface Song {
  id: string;
  title: string;
  artist: string;
  source: TabSource;
  sourceId?: string;
  type: InstrumentType;
  tier: UserTier;
  tuning: string;
  tabText: string;
  bpm: number | null;
  timeSignature: string;
  keyOf: string | null;
  gpFileUrl: string | null;
  timelineJson: TimedNoteEvent[] | null;
  bpmSource: BpmSource | null;
  bpmVerified: boolean;
  searchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SongCard {
  id: string;
  title: string;
  artist: string;
  type: InstrumentType;
  tuning: string;
  bpm: number | null;
  isPro: boolean;
}

export interface TimedNoteEvent {
  string: number;   // 1-6 for guitar, 1-4 for bass
  fret: number;
  timestampMs: number;
}

export interface SearchResult {
  songs: SongCard[];
  query: string;
  total: number;
}

export interface SongRequest {
  id: string;
  query: string;
  requestCount: number;
  lastRequestedAt: string;
  status: 'pending' | 'added' | 'unavailable';
  createdAt: string;
}
