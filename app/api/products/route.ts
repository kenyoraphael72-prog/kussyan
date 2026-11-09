import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServerClient();

    const handle =
      body.handle ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const productPayload = {
      name: body.name,
      handle,
      description: body.description || '',
      price: typeof body.price === 'number' ? body.price : Math.round(parseFloat(body.price || '0') * 100),
      status: body.status || 'active',
      has_variants: Boolean(body.has_variants),
      images: Array.isArray(body.images) ? body.images : body.image_url ? [body.image_url] : [],
      product_type: body.product_type || 'INDOOR',
      tags: Array.isArray(body.tags) ? body.tags : ['indoor'],
      sku: body.sku || null,
      metadata: body.metadata || {
        retail_price: body.retail_price ? parseFloat(body.retail_price) : 0,
        wholesale_price: body.wholesale_price ? parseFloat(body.wholesale_price) : 0,
        bulk_price: body.bulk_price ? parseFloat(body.bulk_price) : 0,
        video_url: body.video_url || null,
      },
    };

    const { data, error } = await supabase.from('products').insert([productPayload]).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

