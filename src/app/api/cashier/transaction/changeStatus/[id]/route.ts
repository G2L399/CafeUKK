import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  //   const berhasil = await req.json();
  const changed = await prisma.transaksi.update({
    where: { id_transaksi: id },
    data: {
      status: "Paid",
    },
  });
  return NextResponse.json({ message: "yay", changed });
}
