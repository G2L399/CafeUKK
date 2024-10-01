import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching Transaksi...");

    const Transaksi = await prisma.transaksi.findMany({
      include: {
        Detail_Transaksi: true,
      }
    });
    // const DetailTransaksi = await Promise.all(
    //   Transaksi.map(async (item) => {
    //     const details = await prisma.detail_Transaksi.findMany({
    //       where: {
    //         id_transaksi: item.id_transaksi,
    //       },
    //     });
    //     return details;
    //   })
    // );
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
