import { NextResponse } from 'next/server';

// This function handles GET requests to /api/health
export async function GET() {
  // Return a simple, fast JSON response with a 200 OK status
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
