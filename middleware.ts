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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    request.nextUrl.pathname === "/auth" ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      c.name.includes("-auth-token") ||
      c.name.startsWith("sb-") ||
      c.name === "supabase-auth-token"
  );

  const isNetworkError = Boolean(
    error &&
      (error.name === "AuthRetryableFetchError" ||
        error.message?.toLowerCase().includes("fetch") ||
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("failed to fetch") ||
        (error as any).status === 0 ||
        (error as any).status === 500)
  );

  const isAccountDeleted = Boolean(
    hasAuthCookie &&
      error &&
      !isNetworkError &&
      (error.message?.toLowerCase().includes("user not found") ||
        error.message?.toLowerCase().includes("does not exist") ||
        error.message?.toLowerCase().includes("sub claim") ||
        (error as any).code === "user_not_found" ||
        (error as any).status === 403 ||
        (error as any).status === 404)
  );

  if (isDashboardRoute) {
    if (isNetworkError) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/not-found";
      redirectUrl.searchParams.set("reason", "offline");
      return NextResponse.redirect(redirectUrl);
    }

    if (isAccountDeleted) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/not-found";
      redirectUrl.searchParams.set("reason", "deleted");
      const res = NextResponse.redirect(redirectUrl);
      allCookies.forEach((c) => {
        if (c.name.includes("auth-token") || c.name.startsWith("sb-")) {
          res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
        }
      });
      return res;
    }

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth";
      redirectUrl.searchParams.set("mode", "signin");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isAuthRoute && user && !error) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard/overview";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
