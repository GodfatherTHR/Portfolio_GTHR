
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase URL or anonymous key is missing in environment variables."
    );
    // Return an error response to make debugging easier.
    return new NextResponse(
      "Internal Server Error: Missing Supabase configuration. Please check environment variables.",
      { status: 500 }
    );
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the response cookies.
          // The request cookies are read-only in this context.
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the response cookies.
          // The request cookies are read-only in this context.
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // This call is what refreshes the session and handles cookie updates.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect the /admin route
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Redirect logged-in users from /login to /admin
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Return the response object, which may have new cookies set.
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
