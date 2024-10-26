import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; // Store this in environment variables

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  console.log("Username:", username, "Password:", password);

  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT Secret is not defined in environment variables" },
      { status: 500 }
    );
  }
  try {
    // Find the user by username
    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    // Successful login
    const token = jwt.sign(
      { user },
      JWT_SECRET,
      { expiresIn: "1y" } // Token expires in 1 day
    );
    const response = NextResponse.redirect(
      new URL(`/${user.role}/dashboard`, req.url)
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to secure only in production
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "strict", // Protect against CSRF
      path: "/", // Ensure the cookie is available across the app
    });
    response.cookies.set("name", user.nama_user, {
      httpOnly: false, // Set to false if you want to access it on the client side
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });
    response.cookies.set("username", user.username, {
      httpOnly: false, // Set to false if you want to access it on the client side
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
