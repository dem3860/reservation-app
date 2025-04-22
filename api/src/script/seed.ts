import { PrismaClient, Gender, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const addUsers = async () => {
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10);

  // 管理者ユーザー（1人）
  await prisma.user.create({
    data: {
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
      isDeleted: false,
    },
  });

  // 一般ユーザー（49人）
  for (let i = 0; i < 99; i++) {
    const index = String(i + 2).padStart(4, "0"); // "0002"〜"0050"
    console.log(`Creating user ${index}`);

    await prisma.user.create({
      data: {
        id: `22222222-2222-2222-2222-44665544${index}`,
        name: `山田 太郎${index}`,
        prefecture: "兵庫県",
        city: "神戸市中央区",
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        birthday: new Date("1995-04-01"),
        email: `taro${index}@example.com`,
        password: hashedPassword,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    });
  }
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
