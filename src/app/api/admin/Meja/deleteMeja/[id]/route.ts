import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedMeja = await prisma.meja.delete({
      where: { id_meja: Number(id) },
    });

    return NextResponse.json({
      message: "Meja deleted successfully",
      deletedMeja,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Meja" },
      { status: 500 }
    );
  }
}
