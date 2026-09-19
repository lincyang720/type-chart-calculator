import { NextRequest, NextResponse } from 'next/server';

/**
 * Markdown content negotiation ("Markdown for Agents").
 *
 * When a client explicitly asks for `text/markdown` via the Accept header, the
 * canonical HTML URL is rewritten to its Markdown twin under /md/* — the URL in
 * the address bar never changes, and human visitors (who send text/html) are
 * untouched. `Vary: Accept` is set so caches do not mix the two representations.
 */

const ACCEPTS_MARKDOWN = /(^|[\s,])text\/markdown\s*(;|$|,)/i;
const REJECTS_MARKDOWN = /text\/markdown\s*;\s*q\s*=\s*0(\.0+)?\s*(,|$)/i;

const SUPPORTED = [
  /^\/$/,
  /^\/types\/[a-z]+$/,
  /^\/combo\/[a-z-]+$/,
  /^\/dual-type-chart$/,
];

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  if (!ACCEPTS_MARKDOWN.test(accept)) return NextResponse.next();
  if (REJECTS_MARKDOWN.test(accept)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (!SUPPORTED.some((re) => re.test(pathname))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/md/index' : `/md${pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set('Vary', 'Accept');
  return response;
}

export const config = {
  matcher: ['/', '/types/:path*', '/combo/:path*', '/dual-type-chart'],
};
