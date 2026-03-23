import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    role: z.enum(['vendor', 'customer']).default('customer'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não correspondem',
    path: ['confirmPassword'],
  });

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Nome da loja deve ter no mínimo 2 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras, números e hífens'),
  description: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Nome do produto obrigatório'),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), 'Preço inválido'),
  cost: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(parseInt(val)), 'Estoque inválido'),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
});

export const createOrderSchema = z.object({
  customerEmail: z.string().email('Email inválido'),
  customerName: z.string().min(2, 'Nome obrigatório'),
  shippingAddress: z.string().min(5, 'Endereço obrigatório'),
  billingAddress: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
