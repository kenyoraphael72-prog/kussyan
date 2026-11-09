import { NextResponse } from 'next/server';

// A simple endpoint that returns the hosting budget adjustment value.
// This is used by the admin dashboard's budget widget.
export async function GET() {
  return NextResponse.json({ adjustment: 0 });
}

