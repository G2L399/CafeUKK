import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching Transaksi...");

    const Transaksi = await prisma.transaksi.findMany({
      include: {
        Detail_Transaksi: {
          include: {
            Menu: true, // This will include the Menu details
          },
        },
      },
    });
    
    return NextResponse.json({
      message: "Transaksi fetched successfully",
      Transaksi,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get menu", message: error },
      { status: 500 }
    );
  }
}
