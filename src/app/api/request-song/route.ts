import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query?.trim()?.toLowerCase();

    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      );
    }

    const serviceClient = getServiceClient();

    // Check if this query already exists
    const { data: existing } = await serviceClient
      .from('song_requests')
      .select('id, request_count')
      .eq('query', query)
      .single();

    if (existing) {
      // Increment request_count and update timestamp
      await serviceClient
        .from('song_requests')
        .update({
          request_count: existing.request_count + 1,
          last_requested_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      return NextResponse.json({
        message: 'Request updated',
        request_count: existing.request_count + 1,
      });
    }

    // Insert new request
    const { error: insertError } = await serviceClient
      .from('song_requests')
      .insert({ query });

    if (insertError) {
      console.error('Failed to insert song request:', insertError);
      return NextResponse.json(
        { error: 'Failed to log request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Request logged',
      request_count: 1,
    });
  } catch (err) {
    console.error('request-song error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
