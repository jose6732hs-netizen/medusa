/**
 * Serviços de API do Cliente
 * Centraliza todas as chamadas HTTP para a API
 */

import type {
  ApiResponse,
  Store,
  Product,
  Order,
  Cart,
  CreateStoreInput,
  CreateProductInput,
  AddToCartInput,
} from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API Error')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Store Services
export const storeService = {
  async getAll(): Promise<ApiResponse<Store[]>> {
    return apiCall<Store[]>('/stores')
  },

  async getById(id: string): Promise<ApiResponse<Store>> {
    return apiCall<Store>(`/stores/${id}`)
  },

  async create(data: CreateStoreInput): Promise<ApiResponse<Store>> {
    return apiCall<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<CreateStoreInput>): Promise<ApiResponse<Store>> {
    return apiCall<Store>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiCall<void>(`/stores/${id}`, {
      method: 'DELETE',
    })
  },
}

// Product Services
export const productService = {
  async getByStore(storeId: string): Promise<ApiResponse<Product[]>> {
    return apiCall<Product[]>(`/products?store_id=${storeId}`)
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    return apiCall<Product>(`/products/${id}`)
  },

  async create(data: CreateProductInput): Promise<ApiResponse<Product>> {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<CreateProductInput>): Promise<ApiResponse<Product>> {
    return apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiCall<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  },
}

// Cart Services
export const cartService = {
  async getCart(storeId: string): Promise<ApiResponse<Cart>> {
    return apiCall<Cart>(`/cart?store_id=${storeId}`)
  },

  async addItem(data: AddToCartInput & { store_id: string }): Promise<ApiResponse<Cart>> {
    return apiCall<Cart>('/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return apiCall<Cart>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  async removeItem(itemId: string): Promise<ApiResponse<void>> {
    return apiCall<void>(`/cart/${itemId}`, {
      method: 'DELETE',
    })
  },
}

// Order Services
export const orderService = {
  async getByStore(storeId: string): Promise<ApiResponse<Order[]>> {
    return apiCall<Order[]>(`/orders?store_id=${storeId}`)
  },

  async getById(id: string): Promise<ApiResponse<Order>> {
    return apiCall<Order>(`/orders/${id}`)
  },

  async create(data: any): Promise<ApiResponse<Order>> {
    return apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: any): Promise<ApiResponse<Order>> {
    return apiCall<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
