// pages/api/admin/deleteUser/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params; // Extract id from params
  console.log(`Deleting user with ID: ${id}`);

  try {
    const user = await prisma.user.delete({
      where: { id_user: Number(id) },
    });
    return NextResponse.json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
