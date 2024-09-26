// pages/api/admin/menu/editMenu/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { nama_menu, jenis, deskripsi, gambar, harga } = await req.json();

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id_menu: Number(id) }, // Ensure id_menu is the correct field
      data: {
        nama_menu,
        jenis,
        deskripsi,
        gambar,
        harga,
      },
    });

    return NextResponse.json({ message: "Menu updated successfully", updatedMenu });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu" }, { status: 500 });
  }
}
