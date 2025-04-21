// adapter/repository/event.ts
import { ResultAsync, fromPromise } from "neverthrow";
import { PrismaClient } from "@prisma/client";
import { DBError } from "../../../domain/entity/error.js";
import { User } from "../../../domain/entity/user.js";
import { IAuthRepository } from "../../../useCase/outputPort/auth.js";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaClient) {}
  findUserByEmail(email: string): ResultAsync<User, DBError> {
    return fromPromise(
      this.prisma.user.findUnique({ where: { email } }),
      () => new DBError("Failed to find event")
    ).andThen((result) => {
      if (!result) {
        return ResultAsync.fromSafePromise(
          Promise.reject(new DBError(`Event not found: ${email}`))
        );
      }
      return ResultAsync.fromPromise(
        Promise.resolve(result),
        () => new DBError("Mapping error")
      );
    });
  }
}
