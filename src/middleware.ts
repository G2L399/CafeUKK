import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify, JWTVerifyResult } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface CustomJWTPayload extends JWTPayload {
  user: {
    role: "admin" | "cashier" | "manajer";
  };
}

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");

  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.json(
      { message: "Access Denied", redirectUrl: "login" },
      { status: 305 }
    );
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
      (pathname.startsWith("/api/manajer") && userRole !== "manajer")
    ) {
      console.log("Access denied, redirecting to login cashier");

      return NextResponse.json(
        { message: "Access Denied", redirectUrl: "login" },
        { status: 302 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      { message: "Access Denied", redirectUrl: "login" },
      { status: 301 }
    );
  }
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/cashier/:path*", "/api/manajer/:path*"],
};
