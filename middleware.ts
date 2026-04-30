import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const hostname = host.split(':')[0];

  if (
    (hostname === 'taxidriver-beginner.com' || hostname === 'www.taxidriver-beginner.com') &&
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.redirect(new URL('/taxi', request.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
