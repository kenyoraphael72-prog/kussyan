import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Create unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      // If bucket doesn't exist yet, return a helpful error
      if (error.message.includes('not found') || error.message.includes('Bucket')) {
        return NextResponse.json(
          { error: 'Storage bucket "product-images" not found. Please create it in your Supabase dashboard.' },
          { status: 500 }
        );
      }
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

