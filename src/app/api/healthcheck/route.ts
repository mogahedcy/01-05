import { NextResponse } from 'next/server'

const STATIC_PATHS = [
  '/',
  '/home',
  '/about',
  '/services/mazallat',
  '/services/pergolas',
  '/services/sandwich-panel',
  '/services/sawater',
  '/services/khayyam',
  '/services/byoot-shaar',
  '/services/renovation',
  '/services/landscaping',
  '/portfolio',
  '/portfolio/reviews',
  '/articles',
  '/articles/complete-car-shades-guide-jeddah-2024',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/quote',
  '/search',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-articles.xml',
  '/sitemap-images.xml',
]

async function checkPath(path: string) {
  const url = new URL(path, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000')
  const start = Date.now()
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })
    const textSnippet = await res.text().then(t => t.slice(0, 120)).catch(() => '')
    return { path, status: res.status, ok: res.ok, ms: Date.now() - start, snippet: textSnippet }
  } catch (err: any) {
    return { path, status: 0, ok: false, ms: Date.now() - start, error: String(err && err.message || err) }
  }
}

export async function GET() {
  const results = await Promise.all(STATIC_PATHS.map(checkPath))

  // Try dynamic example for portfolio project if available
  let dynamic: any = null
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'
    const apiRes = await fetch(`${base}/api/projects?limit=1&sort=newest`, { cache: 'no-store' })
    if (apiRes.ok) {
      const data = await apiRes.json()
      const first = (data?.projects && data.projects[0]) || (Array.isArray(data) ? data[0] : null)
      if (first?.id) {
        dynamic = await checkPath(`/portfolio/${first.id}`)
      }
    } else {
      dynamic = { path: '/portfolio/[id]', status: apiRes.status, ok: false }
    }
  } catch (e: any) {
    dynamic = { path: '/portfolio/[id]', status: 0, ok: false, error: String(e?.message || e) }
  }

  const body = { timestamp: new Date().toISOString(), results, dynamic }
  const allOk = results.every(r => r.ok) && (dynamic ? dynamic.ok !== false : true)
  return NextResponse.json(body, { status: allOk ? 200 : 207 })
}
