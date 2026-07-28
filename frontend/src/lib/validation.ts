import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password is too long'),
});

export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password is too long'),
  fullName: z.string().min(1, 'Name is required').max(80, 'Name is too long'),
  role: z.enum(['admin', 'user']),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required').max(60),
  model: z.string().min(1, 'Model is required').max(60),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  year: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z
      .number()
      .int()
      .min(1900, 'Enter a valid year')
      .max(new Date().getFullYear() + 1, 'Year cannot be in the future')
      .nullable()
  ),
  description: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : String(v)),
    z.string().max(500).nullable()
  ),
  image_url: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : String(v)),
    z.string().url('Enter a valid image URL').nullable()
  ),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VehicleFormValues = z.infer<typeof vehicleSchema>;
