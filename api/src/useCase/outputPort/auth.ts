import { ResultAsync } from "neverthrow";
import { DBError } from "../../domain/entity/error.js";
import { User } from "../../domain/entity/user.js";

export interface IAuthRepository {
  findUserByEmail(email: string): ResultAsync<User, DBError>;
}
