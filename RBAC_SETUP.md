# Role-Based Access Control (RBAC) Setup Guide

This guide explains how to set up and use the role-based access control system for your Next.js + Supabase application.

## Overview

The system supports three user roles:
- **Default User**: Regular users with basic access
- **Health Admin**: Administrators who can manage health-related data
- **Superadmin**: Full system administrators with unrestricted access

## Database Setup

### 1. Run the Migration

Apply the database migration to create the necessary tables and triggers:

```bash
# If using Supabase CLI
npx supabase migration up

# Or apply manually through Supabase Dashboard
# Copy the contents of supabase/migrations/20250115000000_add_user_roles.sql
# and run it in the SQL Editor
```

The migration creates:
- `user_role` enum type with values: 'default', 'health_admin', 'superadmin'
- `user_profiles` table to store user role information
- Row Level Security (RLS) policies
- Automatic trigger to create a profile when a user signs up (default role: 'default')

### 2. Verify the Setup

After running the migration, verify in Supabase Dashboard:
1. Go to **Database** > **Tables**
2. Check that `user_profiles` table exists
3. Go to **Authentication** > **Users**
4. Sign up a test user
5. Check that a profile was automatically created in `user_profiles`

## Route Structure

The application has three protected route groups:

```
/dashboard                    → Default users
/health-admin/dashboard       → Health admins (+ superadmins)
/superadmin/dashboard         → Superadmins only
```

### Access Rules

- **Default users** can only access `/dashboard` routes
- **Health admins** can access `/dashboard` and `/health-admin` routes
- **Superadmins** can access all routes

The middleware automatically:
- Redirects unauthenticated users to `/auth/login`
- Redirects authenticated users to their role-specific dashboard
- Blocks users from accessing routes above their permission level

## Managing User Roles

### Option 1: Through Supabase Dashboard (Recommended for initial setup)

1. Go to **Database** > **Table Editor**
2. Select `user_profiles` table
3. Find the user you want to promote
4. Click the row to edit
5. Change the `role` field to 'health_admin' or 'superadmin'
6. Save changes

### Option 2: Create a Superadmin Manually (SQL)

Run this SQL in the Supabase SQL Editor to promote a user to superadmin:

```sql
-- Replace 'user@example.com' with the actual user's email
UPDATE user_profiles
SET role = 'superadmin'
WHERE email = 'user@example.com';
```

### Option 3: Build an Admin UI (Future Enhancement)

You can create a user management page for superadmins:

```tsx
// app/superadmin/users/page.tsx
import { createClient } from '@/lib/server'

export default async function UsersManagementPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Display users in a table with role update functionality
  return (
    <div>
      {/* User management UI here */}
    </div>
  )
}
```

## Using Role Utilities

The `lib/roles.ts` file provides helper functions:

```tsx
import { 
  getUserRole, 
  getUserProfile, 
  hasRole, 
  hasAnyRole,
  isSuperAdmin,
  isHealthAdminOrAbove 
} from '@/lib/roles'

// Get current user's role
const role = await getUserRole()

// Get full user profile
const profile = await getUserProfile()

// Check specific role
const isAdmin = await hasRole('superadmin')

// Check multiple roles
const canManageHealth = await hasAnyRole(['health_admin', 'superadmin'])

// Convenience functions
const isSuper = await isSuperAdmin()
const canManage = await isHealthAdminOrAbove()
```

## Testing the Setup

### 1. Test Default User

1. Sign up a new user
2. You should be redirected to `/dashboard`
3. Try accessing `/health-admin/dashboard` - should be blocked
4. Try accessing `/superadmin/dashboard` - should be blocked

### 2. Test Health Admin

1. Promote a user to 'health_admin' in the database
2. Log in with that user
3. You should be redirected to `/health-admin/dashboard`
4. Try accessing `/dashboard` - should work
5. Try accessing `/superadmin/dashboard` - should be blocked

### 3. Test Superadmin

1. Promote a user to 'superadmin' in the database
2. Log in with that user
3. You should be redirected to `/superadmin/dashboard`
4. Try accessing all routes - all should work

## Security Considerations

### Row Level Security (RLS)

The migration includes RLS policies that ensure:
- Users can only view their own profile
- Health admins can view default users and other health admins
- Superadmins can view all profiles
- Only superadmins can update user roles

### Middleware Protection

The middleware (`lib/middleware.ts`) enforces role-based routing at the edge:
- Checks authentication before route access
- Verifies role permissions for protected routes
- Automatically redirects unauthorized access attempts

### Server-Side Verification

Each protected page performs server-side role verification:
```tsx
const profile = await getUserProfile()
if (!profile) redirect('/auth/login')

const hasAccess = await hasAnyRole(['health_admin', 'superadmin'])
if (!hasAccess) redirect('/dashboard')
```

## Troubleshooting

### User profile not created after signup

**Cause**: The trigger might not have been created properly.

**Solution**: Re-run the migration or manually create the trigger:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'default');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Infinite redirect loops

**Cause**: User profile might not exist or role might be NULL.

**Solution**: Check the user_profiles table and ensure the user has a valid role.

### Role changes not taking effect

**Cause**: Session might be cached.

**Solution**: Log out and log back in to refresh the session.

## Next Steps

Consider implementing:

1. **User Management UI**: Build an interface for superadmins to manage user roles
2. **Audit Logging**: Track role changes and sensitive actions
3. **Email Notifications**: Notify users when their role changes
4. **Role-based Components**: Create reusable components that show/hide based on roles
5. **API Routes**: Add role-based protection to API routes
6. **Granular Permissions**: Extend the system with specific permissions within roles

## Example: Role-Based Component

```tsx
// components/role-gate.tsx
import { getUserRole, type UserRole } from '@/lib/roles'

interface RoleGateProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export async function RoleGate({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleGateProps) {
  const role = await getUserRole()
  
  if (!role || !allowedRoles.includes(role)) {
    return fallback
  }
  
  return <>{children}</>
}

// Usage
<RoleGate allowedRoles={['superadmin', 'health_admin']}>
  <AdminOnlyFeature />
</RoleGate>
```

## Support

For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Project repository issues
