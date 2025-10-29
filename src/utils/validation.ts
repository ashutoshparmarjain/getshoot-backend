import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const settingsSchema = z.object({
  displayName: z.string().min(1).max(100)
});

export const productCreateSchema = z.object({
  name: z.string().min(1)
});

export const generateSchema = z.object({
  prompt: z.string().min(1).max(500)
});

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type GenerateInput = z.infer<typeof generateSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

