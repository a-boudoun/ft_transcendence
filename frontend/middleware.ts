import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('access_token');
  const signInToken = request.cookies.get('signin_token');
  const twoFactorToken = request.cookies.get('tow_fact_token');

  if (pathname !== '/' && !accessToken && !signInToken && !twoFactorToken) {
    return NextResponse.redirect(new URL('/', request.url));
  } 
  else if (pathname !== '/signIn' && signInToken) {
    return NextResponse.redirect(new URL('/signIn', request.url));
  }
  else if (pathname !== '/fact2auth' && twoFactorToken) {
    return NextResponse.redirect(new URL('/fact2auth', request.url));
  }
  else if ((pathname === '/signIN' || pathname ==='/fact2auth' || pathname === '/' ) && accessToken) {
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