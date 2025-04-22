import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { AppType } from "../../../../type";
import {
  toUserListResponse,
  UserId,
  UserListRequest,
  UserListResponse,
} from "../../../schema/admin/user";
import { ErrorResponse } from "../../../schema/error";

export const adminUserRouter = new OpenAPIHono<AppType>();

const listUsersRoute = createRoute({
  operationId: "listUsers",
  tags: ["admin"],
  method: "get",
  path: "/",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    query: UserListRequest,
  },
  responses: {
    200: {
      description: "Get",
      content: {
        "application/json": {
          schema: UserListResponse,
        },
      },
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Bad Request",
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Unauthorized",
    },
    403: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Forbidden",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});
adminUserRouter.openapi(listUsersRoute, async (c) => {
  const input = c.req.valid("query");
  console.log("input", input);
  const uc = c.get("deps").adminUserUseCase;
  const result = await uc.list(input);
  console.log("result", result);
  if (result.isErr()) {
    const error = result.error;
    switch (error.name) {
      case "DBError":
        return c.json({ name: "DB_ERROR", message: "db error" }, 500);
      case "ValidationError":
        return c.json(
          { name: "VALIDATION_ERROR", message: "validation error" },
          400
        );
      case "UnauthorizedError":
        return c.json(
          { name: "UNAUTHORIZED_ERROR", message: "unauthorized error" },
          403
        );
      case "ForbiddenError":
      default:
        return c.json({ name: "UNKNOWN_ERROR", message: "unknown error" }, 500);
    }
  }

  const list = toUserListResponse(result.value);
  const res = UserListResponse.parse(list);
  return c.json(res, 201);
});

const deleteUserRoute = createRoute({
  operationId: "deleteUser",
  tags: ["admin"],
  method: "put",
  path: "/delete/{id}",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: UserId,
  },
  responses: {
    204: {
      description: "Delete",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Bad Request",
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Unauthorized",
    },
    403: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Forbidden",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});
adminUserRouter.openapi(deleteUserRoute, async (c) => {
  const userId = c.req.param("id");
  console.log("userId", userId);
  const uc = c.get("deps").adminUserUseCase;
  const result = await uc.delete(userId);
  console.log("result", result);
  if (result.isErr()) {
    const error = result.error;
    switch (error.name) {
      case "DBError":
        return c.json({ name: "DB_ERROR", message: "db error" }, 500);
      case "ValidationError":
        return c.json(
          { name: "VALIDATION_ERROR", message: "validation error" },
          400
        );
      case "UnauthorizedError":
        return c.json(
          { name: "UNAUTHORIZED_ERROR", message: "unauthorized error" },
          403
        );
      case "ForbiddenError":
      default:
        return c.json({ name: "UNKNOWN_ERROR", message: "unknown error" }, 500);
    }
  }

  return c.body(null, 204);
});
