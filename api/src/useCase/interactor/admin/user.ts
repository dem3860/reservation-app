import { ResultAsync } from "neverthrow";
import { IAdminUserUseCase, UserListRequest } from "../../inputPort/admin/user";
import { EventList } from "../../../domain/entity/event";
import { DBError } from "../../../domain/entity/error";
import { IAdminUserRepository } from "../../outputPort/admin/user";
import { UserList } from "../../../domain/entity/user";

export class AdminUserInteractor implements IAdminUserUseCase {
  constructor(private readonly adminUserRepo: IAdminUserRepository) {}
  list(input: UserListRequest): ResultAsync<UserList, DBError> {
    const transformedInput = {
      ...input,
      birthDayFrom: input.birthDayFrom
        ? new Date(input.birthDayFrom)
        : undefined,
      birthDayTo: input.birthDayTo ? new Date(input.birthDayTo) : undefined,
    };
    console.log("transformedInput", transformedInput);
    return this.adminUserRepo.list(transformedInput);
  }
}
