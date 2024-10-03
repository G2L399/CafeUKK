import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Delete cookies
  response.cookies.delete("token");
  response.cookies.delete("username");
  response.cookies.delete("name");

  // Set the redirect URL
  response.headers.set("Location", "/login");

  return response;
}
