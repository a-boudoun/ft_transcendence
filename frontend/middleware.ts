import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('access_token');
  const firstTime = request.cookies.get('firstTime');

  if (pathname !== '/' && !accessToken && !firstTime) {
    return NextResponse.redirect(new URL('/', request.url));
  } 
  else if (pathname !== '/signIn' && firstTime) {
    return NextResponse.redirect(new URL('/signIn', request.url));
  }
  else if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|img|icons|favicon.ico).*)',
      ],
}