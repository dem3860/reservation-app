import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";
import { AppType } from "../../type.js";
import { authRouter } from "./auth/routes.js";
import { AuthRepository } from "../database/repository/auth.js";
import { AuthInteractor } from "../../useCase/interactor/auth.js";
import {
  authMiddleware,
  adminMiddleware,
  userMiddleware,
} from "../middleware/authMiddleware.js";
import { AdminUserInteractor } from "../../useCase/interactor/admin/user.js";
import { AdminUserRepository } from "../database/repository/admin/user.js";
import { adminUserRouter } from "./admin/user/routes.js";

const app = new OpenAPIHono<AppType>();
const prisma = new PrismaClient();

// CORS設定
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

app.use("*", async (c, next) => {
  c.set("deps", {
    authUseCase: new AuthInteractor(new AuthRepository(prisma)),
    adminUserUseCase: new AdminUserInteractor(new AdminUserRepository(prisma)),
  });
  await next();
});

app.use("/admin/*", authMiddleware, adminMiddleware);
app.use("/user/*", authMiddleware, userMiddleware);

app.get("/", (c) => c.text("Hello Hono!"));
app.route("/auth/", authRouter);
app.route("/admin/user", adminUserRouter);

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
});

export { app };
