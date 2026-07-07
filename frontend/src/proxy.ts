import { NextRequest, NextResponse } from "next/server";
import { hexclaveServerApp } from "@/hexclave/server";

export async function proxy(request: NextRequest) {
  const user = await hexclaveServerApp.getUser({ tokenStore: request });

  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    if (request.nextUrl.pathname !== "/sign-in") {
      signInUrl.searchParams.set(
        "after_auth_return_to",
        request.nextUrl.pathname + request.nextUrl.search,
      );
    }
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
