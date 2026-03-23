import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface SuperAdminPayload {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface TenantUserPayload {
  id: string
  tenant_id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createToken(payload: SuperAdminPayload | TenantUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): SuperAdminPayload | TenantUserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SuperAdminPayload | TenantUserPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function getTokenFromCookie(cookieString?: string): string | null {
  if (!cookieString) return null

  const cookies = cookieString.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'auth_token') {
      return decodeURIComponent(value)
    }
  }

  return null
}

export async function authenticateSuperAdmin(
  email: string,
  password: string
): Promise<SuperAdminPayload | null> {
  try {
    const result = await query(
      'SELECT * FROM super_admins WHERE email = $1 AND status = $2',
      [email, 'active']
    )

    if (result.rows.length === 0) {
      return null
    }

    const admin = result.rows[0]
    const passwordMatch = await comparePasswords(password, admin.password_hash)

    if (!passwordMatch) {
      return null
    }

    // Update last login
    await query(
      'UPDATE super_admins SET last_login_at = NOW() WHERE id = $1',
      [admin.id]
    )

    return {
      id: admin.id,
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
    }
  } catch (error) {
    console.error('Super admin authentication error:', error)
    return null
  }
}

export async function authenticateTenantUser(
  tenant_id: string,
  email: string,
  password: string
): Promise<TenantUserPayload | null> {
  try {
    const result = await query(
      'SELECT * FROM tenant_users WHERE tenant_id = $1 AND email = $2 AND status = $3',
      [tenant_id, email, 'active']
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    const passwordMatch = await comparePasswords(password, user.password_hash)

    if (!passwordMatch) {
      return null
    }

    // Update last login
    await query(
      'UPDATE tenant_users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    )

    return {
      id: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    }
  } catch (error) {
    console.error('Tenant user authentication error:', error)
    return null
  }
}
