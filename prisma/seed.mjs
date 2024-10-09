import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed users
  const user1 = await prisma.user.create({
    data: {
      nama_user: "Admin",
      role: "admin",
      username: "Admin",
      password: "$2a$10$pvFqVAagDXPHkKHfcfhBYucM/7efsDcdJ9PjmliVAHTYoFFHBHZjW",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nama_user: "Cashier",
      role: "cashier",
      username: "Cashier",
      password: "$2a$10$kEwhxz9Ar.KCXOaMCFtTy./FM8PtaxoD5K1OyGx81O2P6pYPseYam",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      nama_user: "Manager",
      role: "manager",
      username: "Manager",
      password: "$2a$10$zvENvCggKZgNiOj5bq5RfOVDzPUTSBYEzF3B2p.0Y7qZfo1B8Zryi",
    },
  });

  // Seed tables
  const meja1 = await prisma.meja.create({
    data: {
      nomor_meja: "A1",
    },
  });

  const meja2 = await prisma.meja.create({
    data: {
      nomor_meja: "B1",
    },
  });

  // Seed transactions
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
