import { z } from "zod";
import { UserList } from "../../../domain/entity/user";
import { User } from "../../../domain/entity/user";
import { numberInString } from "../../../util";

// userに移行する
export const Gender = z.enum(["MALE", "FEMALE", "OTHER"]);
export const UserRole = z.enum(["ADMIN", "USER"]);

export const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  prefecture: z.string(),
  city: z.string(),
  gender: Gender,
  birthday: z.date(),
  email: z.string().email(),
  password: z.string(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean().optional(),
});
export type UserResponse = z.infer<typeof UserResponse>;

export const UserId = z.object({
  id: z.string(),
});
export type UserId = z.infer<typeof UserId>;

export const UserListRequest = z.object({
  q: z.string().optional(),
  birthDayFrom: z.string().datetime().optional(),
  birthDayTo: z.string().datetime().optional(),
  gender: Gender.optional(),
  role: UserRole.optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["birthDay", "name", "createdAt", "updatedAt"]).optional(),
  page: numberInString.optional(),
  limit: numberInString.optional(),
});

export const UserListResponse = z.object({
  users: z.array(UserResponse),
  total: z.number(),
});
export type UserListResponse = z.infer<typeof UserListResponse>;

export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  name: user.name,
  prefecture: user.prefecture,
  city: user.city,
  gender: user.gender,
  birthday: user.birthday,
  email: user.email,
  password: user.password,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  isDeleted: user.isDeleted,
});

export const toUserListResponse = (users: UserList): UserListResponse => ({
  users: users.users.map((user) => {
    console.log("user", user);
    return toUserResponse(user);
  }),
  total: users.total,
});
