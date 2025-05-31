import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const signUpFormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  first_name: z.string().min(1, { message: 'Enter a valid first name' }),
  last_name: z.string().min(1, { message: 'Enter a valid last name' }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, { message: 'Enter a valid first name' }).optional(),
  last_name: z.string().min(1, { message: 'Enter a valid last name' }).optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>; 