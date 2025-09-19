import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'google_tokens';

interface StoredTokens {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export async function GET(req: NextRequest) {
  const raw = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!raw) {
    return NextResponse.json({ authorized: false });
  }
  try {
    const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) as StoredTokens;
    const now = Date.now();
    const expired = decoded.expiry_date ? decoded.expiry_date < now - 60_000 : true;
    return NextResponse.json({ authorized: !!decoded.refresh_token, expired });
  } catch {
    return NextResponse.json({ authorized: false });
  }
}
