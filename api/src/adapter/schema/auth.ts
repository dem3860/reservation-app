import { z } from "zod";
export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const LoginResponse = z.object({
  accessToken: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number(),
});
export type LoginResponse = z.infer<typeof LoginResponse>;
