// pages/api/admin/menu/addMenu/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { nomor_meja } = await req.json();

  try {
    const newMeja = await prisma.meja.create({
      data: {
        nomor_meja,
      },
    });

    return NextResponse.json(
      { message: "Table added successfully", newMeja },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to add Table" }, { status: 500 });
  }
}
