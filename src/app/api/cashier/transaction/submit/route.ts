import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  console.log("indian button");
  const { cart, customerName, idmeja, total_harga } = await req.json();

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
      const decoded = jwt.decode(token, JWT_SECRET); // Replace with your JWT secret

      userId = decoded?.user.id_user; // Extract id_user from the decoded token
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
      id_user: userId,
      id_meja: idmeja,
      nama_pelanggan: customerName,
      status: "belum_bayar",
      total_harga: total_harga,
    },
  });

  // Create detail transactions for each item in the cart
  await Promise.all(
    cart.map((item: any) => {
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