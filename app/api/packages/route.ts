import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get('brand') || 'doja';

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('brand', brand)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Packages fetch failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

