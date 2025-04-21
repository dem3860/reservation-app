import { errAsync, ResultAsync } from "neverthrow";
import { Login } from "../../domain/entity/auth";
import { DBError, ValidationError } from "../../domain/entity/error";
import { IAuthUseCase, LoginRequest } from "../inputPort/auth";
import { NewAuth } from "../../domain/constructor/auth";
import { IAuthRepository } from "../outputPort/auth";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { env } from "../../config/env";

export class AuthInteractor implements IAuthUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  login(input: LoginRequest): ResultAsync<Login, DBError | ValidationError> {
    const result = NewAuth({
      email: input.email,
      password: input.password,
    });
    if (result.isErr()) {
      return errAsync(result.error);
    }

    const auth = result.value;

    return this.authRepo.findUserByEmail(auth.email).andThen((userData) => {
      return ResultAsync.fromPromise(
        bcrypt.compare(auth.password, userData.password),
        () => new DBError("Failed to verify password")
      ).andThen((isMatch) => {
        if (!isMatch) {
          return errAsync(new ValidationError("Invalid password"));
        }

        const expiresIn = 60 * 60 * 24 * 3;
        const payload = {
          sub: userData.id,
          role: userData.role,
          exp: Math.floor(Date.now() / 1000) + expiresIn,
        };

        return ResultAsync.fromPromise(
          sign(payload, env.JWT_SECRET),
          () => new DBError("JWT signing failed")
        ).map((accessToken) => ({
          accessToken: accessToken,
          expiresIn: expiresIn,
          tokenType: "Bearer" as const,
        }));
      });
    });
  }
}
