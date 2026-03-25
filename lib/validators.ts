import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1),
});

// Shipment schemas
export const createShipmentSchema = z.object({
  senderName: z.string().min(1, 'Sender name required').max(100),
  senderEmail: z.string().email('Invalid sender email'),
  senderPhone: z.string().regex(/^\+?[0-9]{10,}/, 'Invalid phone number'),
  senderAddress: z.string().min(1).max(255),
  senderCity: z.string().min(1).max(100),

  receiverName: z.string().min(1).max(100),
  receiverEmail: z.string().email('Invalid receiver email'),
  receiverPhone: z.string().regex(/^\+?[0-9]{10,}/, 'Invalid phone number'),
  receiverAddress: z.string().min(1).max(255),
  receiverCity: z.string().min(1).max(100),

  description: z.string().min(1).max(500),
  weight: z.number().positive('Weight must be greater than 0'),
  dimensions: z.string().max(100).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED']),
  notes: z.string().max(500).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
