import { z } from "zod";
import { UserList } from "../../../domain/entity/user";
import { DBError } from "../../../domain/entity/error";
import { ResultAsync } from "neverthrow";

export const UserListRequest = z.object({
  q: z.string().optional(),
  birthDayFrom: z.string().datetime().optional(),
  birthDayTo: z.string().datetime().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["birthDay", "name", "createdAt", "updatedAt"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type UserListRequest = z.infer<typeof UserListRequest>;

export interface IAdminUserUseCase {
  list(input: UserListRequest): ResultAsync<UserList, DBError>;
  delete(userId: string): ResultAsync<void, DBError>;
}
