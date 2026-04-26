import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      cause: error.cause ? error.cause.message : null,
      stack: error.stack
    });
  }
}
