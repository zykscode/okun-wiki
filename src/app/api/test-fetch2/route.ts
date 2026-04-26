import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res1 = await fetch('https://accounts.google.com/.well-known/openid-configuration');
    const data1 = await res1.json();
    
    if (!data1.jwks_uri) throw new Error("No jwks_uri");

    const res2 = await fetch(data1.jwks_uri);
    const data2 = await res2.json();

    return NextResponse.json({ success: true, jwks: !!data2 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      cause: error.cause ? error.cause.message : null,
      stack: error.stack
    });
  }
}
