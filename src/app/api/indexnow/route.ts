import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls مطلوب كمصفوفة' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
    const key = process.env.INDEXNOW_KEY || 'aldeyarksa-indexnow-key-2024';
    const keyLocation = `${baseUrl}/${key}.txt`;

    const payload = {
      host: baseUrl.replace(/^https?:\/\//, ''),
      key,
      keyLocation,
      urlList: urls
    };

    // Official IndexNow endpoint proxies to supported search engines
    const indexNowEndpoint = 'https://api.indexnow.org/indexnow';

    const res = await fetch(indexNowEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'AlDeyar-SEO-Bot/1.0' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    const ok = res.ok;

    return NextResponse.json({
      success: ok,
      submitted: urls,
      endpoint: indexNowEndpoint,
      status: res.status,
      timestamp: new Date().toISOString()
    }, { status: ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'unknown' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST /api/indexnow { urls: string[] }'
  });
}
