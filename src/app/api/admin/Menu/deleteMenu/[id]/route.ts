// pages/api/admin/menu/deleteMenu/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedMenu = await prisma.menu.delete({
      where: { id_menu: Number(id) }, // Ensure id_menu is the correct field
    });

    return NextResponse.json({
      message: "Menu deleted successfully",
      deletedMenu,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete menu", message: error },
      { status: 500 }
    );
  }
}
