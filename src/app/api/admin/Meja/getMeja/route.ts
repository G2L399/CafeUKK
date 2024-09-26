import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching Tables...");

    const Meja = await prisma.meja.findMany();

    return NextResponse.json({ message: "Table fetched successfully", Meja });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get Tables", message: error },
      { status: 500 }
    );
  }
}
