import { err, ok, Result } from "neverthrow";
import { AuthRequest } from "../entity/auth";
import { ValidationError } from "../entity/error";

export type AuthArgs = {
  email: string;
  password: string;
};
export const NewAuth = (
  input: AuthArgs
): Result<AuthRequest, ValidationError> => {
  if (!input.email.trim()) {
    return err(new ValidationError("email must not be empty"));
  }
  if (!input.password.trim()) {
    return err(new ValidationError("password must not be empty"));
  }

  const parsed = AuthRequest.safeParse({
    ...input,
  });
  if (!parsed.success) {
    return err(new ValidationError("Invalid event data"));
  }
  return ok(parsed.data);
};
