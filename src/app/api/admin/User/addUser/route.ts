import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  
  const { nama_user, role, username, password } = await req.json();

  try {
    // Check if username or name already exists
    const userByUsername = await prisma.user.findFirst({
      where: { username: username },
    });

    const userByName = await prisma.user.findFirst({
      where: { nama_user: nama_user },
    });
    console.log("path:",req.nextUrl.pathname);

    if (userByUsername && userByName) {
      return NextResponse.json(
        { message: "Username and name already taken" },
        { status: 409 }
      );
    } else if (userByUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    } else if (userByName) {
      return NextResponse.json(
        { message: "Name already taken" },
        { status: 409 }
      );
    } else {
      const user = await prisma.user.create({
        data: {
          nama_user,
          role,
          username,
          password, // Store the hashed password from the front-end
        },
      });
      return NextResponse.json({ message: "User added successfully", user });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
