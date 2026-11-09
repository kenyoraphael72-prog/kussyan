import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get('brand') || 'doja';

    const supabase = createServerClient();
    const { data, error } = await supabase.from('settings').select('*').eq('brand', brand);

    if (error) throw error;

    // Convert array of {key, value} to key-value map
    const settingsMap: Record<string, string> = {};
    data?.forEach((item) => {
      settingsMap[item.key] = item.value || '';
    });

    return NextResponse.json(settingsMap);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServerClient();

    // Support both single {key, value, brand} and multiple settings object { site_name: "...", brand: "..." }
    if (body.key && body.value !== undefined) {
      const brand = body.brand || 'doja';
      const { data, error } = await supabase
        .from('settings')
        .upsert({ key: body.key, value: String(body.value), brand }, { onConflict: 'key,brand' })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const brand = body.brand || 'doja';
      const updates = Object.entries(body)
        .filter(([k]) => k !== 'brand')
        .map(([key, value]) => ({
          key,
          value: value === null || value === undefined ? '' : String(value),
          brand,
        }));

      const { data, error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'key,brand' })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, updated: data?.length || 0 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

