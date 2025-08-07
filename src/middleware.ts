// import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    const isPublicPath = pathname === "/signin" || pathname === "/signup"
    
    const sessionToken = request.cookies.get("next-auth.session-token")?.value || 
                        request.cookies.get("__Secure-next-auth.session-token")?.value || ''

        if(isPublicPath && sessionToken) {
          return NextResponse.redirect(new URL('/', request.nextUrl))
        }

        if (!isPublicPath && !sessionToken) {
          return NextResponse.redirect(new URL('/signin', request.nextUrl))
        }
  }

export const config = {
  matcher: ["/", "/profile", "/chat", "/signin", "/signup"],
};
