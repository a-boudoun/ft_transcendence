import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('access_token');
  const signinToken = request.cookies.get('signin_token');

  if (pathname != '/' && !accessToken && !signinToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname == '/' && accessToken && !signinToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  if (pathname != '/signIn' && signinToken) {
    return NextResponse.redirect(new URL('/signIn', request.url));
  }

}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|img|icons|favicon.ico).*)',
      ],
}