import { createClient } from './server'

export type UserRole = 'default' | 'health_admin' | 'superadmin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * Get the current user's role from the database
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile.role as UserRole
}

/**
 * Get the current user's full profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile as UserProfile
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole === role
}

/**
 * Check if the current user has at least one of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const userRole = await getUserRole()
  if (!userRole) return false
  return roles.includes(userRole)
}

/**
 * Check if the current user is a superadmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('superadmin')
}

/**
 * Check if the current user is a health admin or superadmin
 */
export async function isHealthAdminOrAbove(): Promise<boolean> {
  return hasAnyRole(['health_admin', 'superadmin'])
}

/**
 * Get the default redirect path based on user role
 */
export function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case 'superadmin':
      return '/superadmin/dashboard'
    case 'health_admin':
      return '/health-admin/dashboard'
    case 'default':
    default:
      return '/dashboard'
  }
}

/**
 * Check if a user can access a specific path based on their role
 */
export function canAccessPath(role: UserRole, path: string): boolean {
  // Superadmins can access everything
  if (role === 'superadmin') {
    return true
  }

  // Health admins can access their routes and default user routes
  if (role === 'health_admin') {
    return !path.startsWith('/superadmin')
  }

  // Default users can only access their own routes
  if (role === 'default') {
    return !path.startsWith('/health-admin') && !path.startsWith('/superadmin')
  }

  return false
}
