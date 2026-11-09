import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gteCreatedAt = searchParams.get('gte_created_at');
    const brand = searchParams.get('brand') || 'doja';

    const supabase = createServerClient();
    let query = supabase.from('analytics').select('*').eq('brand', brand);

    if (gteCreatedAt) {
      query = query.gte('created_at', gteCreatedAt);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(500);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analytics fetch failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { error } = await supabase.from('analytics').insert([
      {
        brand: body.brand || 'doja',
        event_type: body.event_type,
        event_data: body.event_data || {},
        page: body.page || null,
        session_id: body.session_id || null,
        user_agent: body.user_agent || null,
        country: body.country || null,
      },
    ]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analytics insert failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

