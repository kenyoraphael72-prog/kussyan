import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { cart, total, brand } = await req.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          cart,
          total: total || 0,
          status: 'pending',
          brand: brand || 'doja',
        },
      ])
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Order creation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

