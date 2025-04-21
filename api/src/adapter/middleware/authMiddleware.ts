import { Context } from "hono";
import { verify } from "hono/jwt";
import { env } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token provided");
    return c.json({ message: "No token provided" }, 401);
  }

  try {
    const decoded: CustomJwtPayload = (await verify(
      token,
      env.JWT_SECRET
    )) as CustomJwtPayload;
    c.set("user", decoded);
    console.log("Decoded JWT:", decoded);
    return next();
  } catch (err) {
    return c.json({ message: "Invalid token" }, 401);
  }
};

export const adminMiddleware = async (
  c: Context,
  next: () => Promise<void>
) => {
  const user = c.get("user");
  if (user.role !== "ADMIN") {
    return c.json({ message: "Forbidden: Admin access required" }, 403);
  }
  console.log("Admin access granted");
  return next();
};

// ユーザー向けのアクセス制御
export const userMiddleware = async (c: Context, next: () => Promise<void>) => {
  const user = c.get("user"); // contextからユーザー情報を取得
  if (user.role !== "USER" && user.role !== "ADMIN") {
    return c.json({ message: "Forbidden: User access required" }, 403);
  }
  return next();
};
