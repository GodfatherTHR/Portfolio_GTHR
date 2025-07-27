
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // This `response` will be passed to the Supabase client below.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Create a Supabase client that can be used to authenticated the user.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // If the cookie is set, delete it from the request cookies.
        request.cookies.set({
          name,
          value,
          ...options,
        })
        // And set the cookie on the response.
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        // If the cookie is removed, delete it from the request cookies.
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        // And set the cookie on the response.
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  // Refresh the session if the user is logged in.
  // This is essential for keeping the user's session active.
  const { data: { user } } = await supabase.auth.getUser()

  // Protect the /admin route.
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users from /login to /admin.
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Return the response, which will have the updated session cookie.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
