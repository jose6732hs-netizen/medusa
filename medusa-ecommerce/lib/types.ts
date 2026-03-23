/**
 * Tipos e Interfaces do Projeto
 * Todos os tipos são definidos aqui para melhor manutenibilidade
 */

// User Types
export type UserRole = 'admin' | 'vendor' | 'customer'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface UserSession {
  user: User
  token: string
}

// Store Types
export interface Store {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  currency: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateStoreInput {
  name: string
  description?: string
  currency?: string
}

export interface UpdateStoreInput {
  name?: string
  description?: string
  logo_url?: string
  currency?: string
  is_active?: boolean
}

// Product Types
export type ProductStatus = 'draft' | 'active' | 'archived'

export interface Product {
  id: string
  store_id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  cost_price: number | null
  image_url: string | null
  stock_quantity: number
  status: ProductStatus
  created_at: Date
  updated_at: Date
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  cost_price?: number
  image_url?: string
  stock_quantity: number
  status?: ProductStatus
  category_id?: string
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  cost_price?: number
  image_url?: string
  stock_quantity?: number
  status?: ProductStatus
  category_id?: string
}

// Cart Types
export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  price: number
  created_at: Date
  updated_at: Date
}

export interface Cart {
  id: string
  user_id: string | null
  store_id: string
  session_id: string | null
  items?: CartItem[]
  created_at: Date
  updated_at: Date
}

export interface AddToCartInput {
  product_id: string
  quantity: number
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  created_at: Date
}

export interface Order {
  id: string
  store_id: string
  customer_email: string
  customer_name: string
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string | null
  shipping_address: string | null
  billing_address: string | null
  notes: string | null
  items?: OrderItem[]
  created_at: Date
  updated_at: Date
}

export interface CreateOrderInput {
  customer_email: string
  customer_name: string
  shipping_address: string
  billing_address?: string
  notes?: string
}

export interface UpdateOrderInput {
  status?: OrderStatus
  payment_status?: PaymentStatus
  notes?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Analytics Types
export interface StoreAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  totalCustomers: number
  lowStockProducts: Product[]
  revenueByMonth: { month: string; revenue: number }[]
}

// Checkout Types
export interface CheckoutFormData {
  customer_name: string
  customer_email: string
  shipping_address: string
  billing_address: string
  payment_method: 'card' | 'transfer' | 'cash'
}
