// pages/api/admin/menu/addMenu/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { nama_menu, jenis, deskripsi, gambar, harga } = await req.json();

  try {
    const newMenu = await prisma.menu.create({
      data: {
        nama_menu,
        jenis,
        deskripsi,
        gambar,
        harga,
      },
    });

    return NextResponse.json({ message: "Menu added successfully", newMenu }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add menu" }, { status: 500 });
  }
}
