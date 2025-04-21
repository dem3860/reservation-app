import { ResultAsync } from "neverthrow";
import { z } from "zod";
import { LoginResponse } from "../../adapter/schema/auth";
import { Login } from "../../domain/entity/auth";
import { DBError, ValidationError } from "../../domain/entity/error";

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.infer<typeof LoginRequest>;
export interface IAuthUseCase {
  login(input: LoginRequest): ResultAsync<Login, DBError | ValidationError>;
}
