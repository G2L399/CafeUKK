import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your setup

export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Fetch all users
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
