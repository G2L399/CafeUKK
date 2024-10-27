"use server"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";
import { CustomJWTPayload, Role } from "@/lib/types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
type RolePaths = {
  [key in CustomJWTPayload["user"]["role"]]: string[];
};
export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");

  const token = request.cookies.get("token")?.value;
  console.log(token);

  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    console.log("No token found, redirecting to login");
    console.log(request.nextUrl.pathname);

    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  if (!token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  if (!token) throw new Error("Token is undefined or empty");
  try {
    const { payload }: JWTVerifyResult = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as CustomJWTPayload;
    const userRole = typedPayload.user.role;
    const roleURL = userRole.toLowerCase();
    const pathname = request.nextUrl.pathname;

    console.log(`User Role: ${userRole}, Pathname: ${pathname}`);

    const rolePaths: RolePaths = {
      Admin: ["/api/admin", "/admin/"],
      Cashier: ["/api/cashier", "/cashier/"],
      Manager: ["/api/manager", "/manager/"],
    };

    const isPathRestricted = (role: Role) => {
      return rolePaths[role].some((path) => pathname.startsWith(path));
    };
    if (
      pathname.startsWith("/login") &&
      Boolean(
        userRole === "Admin" || userRole === "Cashier" || userRole === "Manager"
      )
    ) {
      console.log(
        "You've Already Logged In, Redirecting To Your Dashboard... [" +
          roleURL +
          "]"
      );

      const response = NextResponse.redirect(
        new URL(`/${roleURL}/dashboard`, request.url)
      );
      return response;
    }
    if (!isPathRestricted(userRole as Role)) {
      console.log(
        "Access denied, redirecting to your dashboard [" + roleURL + "]"
      );
      return NextResponse.redirect(
        new URL(`/${roleURL}/dashboard`, request.url)
      );
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
