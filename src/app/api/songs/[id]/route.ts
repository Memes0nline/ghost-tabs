import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: song, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !song) {
    return NextResponse.json(
      { error: 'Song not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(song);
}
