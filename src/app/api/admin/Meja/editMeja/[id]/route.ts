import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const { nomor_meja } = await req.json();

  try {
    const updatedMeja = await prisma.meja.update({
      where: { id_meja: Number(id) },
      data: {
        nomor_meja,
      },
    });

    return NextResponse.json({
      message: "Meja updated successfully",
      updatedMeja,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Meja", message: error },
      { status: 500 }
    );
  }
}
