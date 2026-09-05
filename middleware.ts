import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Retrieve authenticated user from Supabase Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    request.nextUrl.pathname === "/auth" ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  // If user is deleted or session is invalid, deny access to dashboard and route to 404 page
  if (isDashboardRoute && (!user || error)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/not-found";
    redirectUrl.searchParams.set("reason", "deleted");
    return NextResponse.redirect(redirectUrl);
  }

  // If user is already authenticated, redirect auth pages to dashboard
  if (isAuthRoute && user && !error) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard/overview";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
