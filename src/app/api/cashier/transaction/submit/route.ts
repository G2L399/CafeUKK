import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { customerName } = body;

  const { total_harga } = body;

  const { cart } = body;

  const { idmeja } = body;

  const { cashiername } = body;
  console.log("name:",cashiername);

  // Validate the request body
  if (!cart || !customerName || !idmeja || !total_harga) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const token = req.cookies.get("token")?.value; // Use the correct method to get the cookie

  // Decode the token to get the user ID
  let userId;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as Secret
      ) as JwtPayload;
      userId = decoded.user.id_user; // Extract id_user from the decoded token
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  // Create a new transaction
  const transaction = await prisma.transaksi.create({
    data: {
      tgl_transaksi: new Date(),
      cashiername: cashiername,
      id_user: userId,
      id_meja: idmeja,
      nama_pelanggan: customerName,
      status: "Unpaid",
      total_harga: total_harga,
    },
  });

  // Create detail transactions for each item in the cart
  interface Item {
    id_menu: number;
    quantity: number;
    total_harga: number;
  }
  await Promise.all(
    cart.map((item: Item) => {
      console.log(item.total_harga);
      return prisma.detail_Transaksi.create({
        data: {
          id_transaksi: transaction.id_transaksi,
          id_menu: item.id_menu,
          jumlah: item.quantity,
          total_harga: item.total_harga,
        },
      });
    })
  );

  // Return a success response
  return NextResponse.json(
    { message: "Transaction submitted successfully" },
    { status: 201 }
  );
}
