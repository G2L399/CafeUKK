// pages/api/admin/deleteUser/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, JWTVerifyResult } from "jose";
import { CustomJWTPayload } from "@/lib/types";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  console.log(params);
  const { id } = params; // Extract id from params

  console.log(`Deleting user with ID: ${id}`);

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Token is undefined or empty");
    const { payload }: JWTVerifyResult = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as CustomJWTPayload;
    console.log(typedPayload);

    const userID = typedPayload.user.id_user;
    console.log(userID);
    if (userID !== id) {
      const user = await prisma.user.delete({
        where: { id_user: id },
      });
      return NextResponse.json({ message: "User deleted successfully", user });
    } else {
      return NextResponse.json(
        { error: "You cannot delete yourself" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
