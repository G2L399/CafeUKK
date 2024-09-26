import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { HttpStatusCode } from "axios";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest,response:NextResponse) {
  console.log("Middleware triggered");

  const token = request.cookies.get("token")?.value;
  console.log(`Token found: ${token}`);

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.json({message: "Access Deniedtigas"}, {status: 305});

  }

  try {
    const { payload }: any = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.user.role;
    const pathname = request.nextUrl.pathname;

    console.log(`User Role: ${userRole}, Pathname: ${pathname}`);

    if (
      (pathname.startsWith("/api/admin") && userRole !== "admin") ||
      (pathname.startsWith("/api/Cashier") && userRole !== "Cashier") ||
      (pathname.startsWith("/api/manajer") && userRole !== "manajer")
    ) {
      console.log("Access denied, redirecting to login");
      
      return NextResponse.json({message: "Access Deniedff"}, {status: 300});
      
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/Cashier/:path*", "/api/manajer/:path*"],
};
