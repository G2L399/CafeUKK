import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching menu...");
    
    const Menu = await prisma.menu.findMany()

    return NextResponse.json({ message: "Menu fetched successfully", Menu });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get menu",message: error }, { status: 500 });
  }
}