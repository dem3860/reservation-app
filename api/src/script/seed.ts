import { PrismaClient, Gender, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const addUsers = async () => {
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.createMany({
    data: [
      {
        id: "22222222-2222-2222-2222-446655440000",
        name: "山田 太郎",
        prefecture: "兵庫県",
        city: "神戸市中央区",
        gender: Gender.MALE,
        birthday: new Date("1995-04-01"),
        email: "taro@example.com",
        password: hashedPassword,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "22222222-2222-2222-2222-446655440001",
        name: "admin山田 太郎",
        prefecture: "兵庫県",
        city: "神戸市中央区",
        gender: Gender.FEMALE,
        birthday: new Date("1995-04-01"),
        email: "admin_taro@example.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
};

const main = async () => {
  try {
    await addUsers();
    console.log("Users inserted successfully.");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
