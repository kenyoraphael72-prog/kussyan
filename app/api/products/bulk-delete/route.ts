import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs must be a non-empty array' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error, count } = await supabase.from('products').delete({ count: 'exact' }).in('id', ids);

    if (error) throw error;
    return NextResponse.json({ success: true, deleted: count });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Bulk delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

