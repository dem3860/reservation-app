import { z } from "zod";

export const Gender = z.enum(["MALE", "FEMALE", "OTHER"]);
export const UserRole = z.enum(["ADMIN", "USER"]);

export const User = z.object({
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
});

export type User = z.infer<typeof User>;

export const UserList = z.object({
  users: z.array(User),
  total: z.number(),
});
export type UserList = z.infer<typeof UserList>;

export const UserSearch = z.object({
  q: z.string().optional(),
  birthDayFrom: z.date().optional(),
  birthDayTo: z.date().optional(),
  gender: Gender.optional(),
  role: UserRole.optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["birthDay", "name", "createdAt", "updatedAt"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type UserSearch = z.infer<typeof UserSearch>;
