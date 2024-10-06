import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
//   const berhasil = await req.json();
  const changed = await prisma.transaksi.update({
    where: { id_transaksi: Number(id) },
    data: {
      status: "lunas",
    },
  });
//   console.log(berhasil);

  console.log(changed);
  return NextResponse.json({ message: "yay", changed });
}
