import { ResultAsync } from "neverthrow";
import {
  DBError,
  NotFoundError,
  ValidationError,
} from "../../../domain/entity/error.js";
import { User, UserList, UserSearch } from "../../../domain/entity/user.js";

export interface IAdminUserRepository {
  list(input: UserSearch): ResultAsync<UserList, ValidationError | DBError>;
  findById(userId: string): ResultAsync<User, NotFoundError | DBError>;
  delete(userId: string): ResultAsync<void, DBError>;
}
