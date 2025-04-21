// adapter/repository/event.ts
import { ResultAsync, fromPromise } from "neverthrow";
import { PrismaClient } from "@prisma/client";
import { IAdminUserRepository } from "../../../../useCase/outputPort/admin/user";
import { DBError } from "../../../../domain/entity/error";
import { UserList, UserSearch } from "../../../../domain/entity/user";

export class AdminUserRepository implements IAdminUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  list(input: UserSearch): ResultAsync<UserList, DBError> {
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
          },
        }),
        () => new DBError("Failed to count users")
      ).map((total) => {
        return {
          users,
          total,
        };
      });
    });
  }
}
