import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify, JWTVerifyResult } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface CustomJWTPayload extends JWTPayload {
  user: {
    role: "admin" | "cashier" | "manager";
  };
}

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");

  const token = request.cookies.get("token")?.value;

  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    console.log("No token found, redirecting to login");
    console.log(request.nextUrl.pathname);

    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  if (!token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  try {
    const { payload }: JWTVerifyResult = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as CustomJWTPayload;
    const userRole = typedPayload.user.role;
    const pathname = request.nextUrl.pathname;

    console.log(`User Role: ${userRole}, Pathname: ${pathname}`);

    if (
      (pathname.startsWith("/api/admin") && userRole !== "admin") ||
      (pathname.startsWith("/api/cashier") && userRole !== "cashier") ||
      (pathname.startsWith("/api/manager") && userRole !== "manager")
    ) {
      console.log("Access denied, redirecting to login");
      const response = NextResponse.redirect(new URL(`/login`, request.url));
      response.cookies.set("token", "", { maxAge: -1 });
      response.cookies.set("name", "", { maxAge: -1 });
      response.cookies.set("username", "", { maxAge: -1 });
      return response;
    }
    if (
      pathname.startsWith("/login") &&
      Boolean(
        userRole === "admin" || userRole === "cashier" || userRole === "manager"
      )
    ) {
      const response = NextResponse.redirect(
        new URL(`/${userRole}/dashboard`, request.url)
      );
      return response;
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear cookies and redirect to login on error
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { maxAge: -1 });
    response.cookies.set("name", "", { maxAge: -1 });
    response.cookies.set("username", "", { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/cashier/:path*",
    "/api/manager/:path*",
    "/manager/:path*",
    "/admin/:path*",  
    "/cashier/:path*",
    "/login",
  ],
};
