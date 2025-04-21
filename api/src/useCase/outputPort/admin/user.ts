import { ResultAsync } from "neverthrow";
import { DBError } from "../../../domain/entity/error.js";
import { UserList, UserSearch } from "../../../domain/entity/user.js";

export interface IAdminUserRepository {
  list(input: UserSearch): ResultAsync<UserList, DBError>;
}
