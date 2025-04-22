// adapter/repository/event.ts
import { ResultAsync, err, fromPromise, ok } from "neverthrow";
import { PrismaClient } from "@prisma/client";
import { IAdminUserRepository } from "../../../../useCase/outputPort/admin/user";
import {
  DBError,
  NotFoundError,
  ValidationError,
} from "../../../../domain/entity/error";
import { User, UserList, UserSearch } from "../../../../domain/entity/user";

export class AdminUserRepository implements IAdminUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  list(input: UserSearch): ResultAsync<UserList, ValidationError | DBError> {
    const skip = (input.limit ?? 10) * ((input.page ?? 1) - 1);
    return fromPromise(
      this.prisma.user.findMany({
        where: {
          name: {
            contains: input.q,
            mode: "insensitive",
          },
          birthday: {
            gte: input.birthDayFrom,
            lte: input.birthDayTo,
          },
          isDeleted: false,
        },
        orderBy: {
          [input.orderBy || "createdAt"]: input.order || "asc",
        },
        skip,
        take: input.limit,
      }),
      (e) => new DBError("Failed to list users")
    ).andThen((users) => {
      return fromPromise(
        this.prisma.user.count({
          where: {
            name: {
              contains: input.q,
              mode: "insensitive",
            },
            birthday: {
              gte: input.birthDayFrom,
              lte: input.birthDayTo,
            },
            isDeleted: false,
          },
        }),
        () => new DBError("Failed to count users")
      ).andThen((total) => {
        const userListResult = User.array().safeParse(users);
        if (!userListResult.success) {
          console.error(userListResult.error);
          return err(new ValidationError("Failed to parse user list"));
        }
        return ok({ total, users: userListResult.data });
      });
    });
  }
  findById(userId: string): ResultAsync<User, NotFoundError | DBError> {
    return ResultAsync.fromPromise(
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      (e) => {
        console.error(e);
        return new DBError("DB error");
      }
    )
      .andThen((user) =>
        user == null ? err(new NotFoundError("User not found")) : ok(user)
      )
      .andThen((user) => {
        console.log("user", user);
        const userResult = User.safeParse(user);
        if (!userResult.success) {
          console.error(userResult.error);
          return err(new DBError("Failed to parse user"));
        }
        return ok(userResult.data);
      });
  }
  delete(userId: string): ResultAsync<void, DBError> {
    return fromPromise(
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isDeleted: true,
        },
      }),
      (e) => new DBError("Failed to delete user")
    ).map(() => {});
  }
}
