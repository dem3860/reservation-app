// adapter/handler/auth.ts
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { AppType } from "../../../type.js";
import { LoginRequest, LoginResponse } from "../../schema/auth.js";

export const authRouter = new OpenAPIHono<AppType>();

const loginRoute = createRoute({
  operationId: "login",
  tags: ["auth"],
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login success",
      content: {
        "application/json": {
          schema: LoginResponse,
        },
      },
    },
    400: {
      description: "Invalid input",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

authRouter.openapi(loginRoute, async (c) => {
  const input = c.req.valid("json");
  console.log(input);
  const uc = c.get("deps").authUseCase;
  const result = await uc.login(input);

  console.log(result);

  if (result.isErr()) {
    const error = result.error;
    switch (error.name) {
      case "InvalidCredentials":
        return c.json(
          { name: "INVALID_CREDENTIALS", message: "Invalid email or password" },
          401
        );
      case "ValidationError":
        return c.json(
          { name: "VALIDATION_ERROR", message: "validation error" },
          400
        );
      default:
        return c.json({ name: "UNKNOWN_ERROR", message: "unknown error" }, 500);
    }
  }

  const res = LoginResponse.parse(result.value);
  return c.json(res, 200);
});
