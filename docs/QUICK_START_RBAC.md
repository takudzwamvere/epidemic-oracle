# Quick Start: Role-Based Access Control

## TL;DR - What Was Implemented

Your Next.js app now has a complete role-based access control system with three user types:
- **Default Users** → `/dashboard`
- **Health Admins** → `/health-admin/dashboard` (can also access user routes)
- **Superadmins** → `/superadmin/dashboard` (can access all routes)

## Files Created/Modified

### New Files
1. **`supabase/migrations/20250115000000_add_user_roles.sql`** - Database schema for roles
2. **`lib/roles.ts`** - Role utility functions
3. **`app/dashboard/page.tsx`** - Default user dashboard
4. **`app/health-admin/dashboard/page.tsx`** - Health admin dashboard
5. **`app/superadmin/dashboard/page.tsx`** - Superadmin dashboard
6. **`RBAC_SETUP.md`** - Comprehensive setup guide

### Modified Files
1. **`lib/middleware.ts`** - Added role-based routing protection

## Setup Steps

### 1. Apply Database Migration

**Option A: Using Supabase CLI**
```bash
npx supabase db push
```

**Option B: Manual via Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250115000000_add_user_roles.sql`
3. Run the SQL
4. Verify `user_profiles` table was created in Database → Tables

### 2. Test with a New User

1. **Sign up** a new user through your app
2. Check Supabase Dashboard → Database → `user_profiles`
3. Verify user was created with role = `'default'`
4. User should be automatically redirected to `/dashboard`

### 3. Create a Superadmin

Run this in Supabase SQL Editor (replace email):

```sql
UPDATE user_profiles
SET role = 'superadmin'
WHERE email = 'your-email@example.com';
```

Then log in as that user - you'll be redirected to `/superadmin/dashboard`

### 4. Create a Health Admin

```sql
UPDATE user_profiles
SET role = 'health_admin'
WHERE email = 'admin-email@example.com';
```

## Quick Test Checklist

- [ ] Sign up a new user → Should land on `/dashboard`
- [ ] Try accessing `/health-admin/dashboard` as default user → Should be blocked/redirected
- [ ] Try accessing `/superadmin/dashboard` as default user → Should be blocked/redirected
- [ ] Promote user to health_admin → Should access `/health-admin/dashboard`
- [ ] Health admin tries `/superadmin/dashboard` → Should be blocked
- [ ] Promote user to superadmin → Should access all routes

## How It Works

### Middleware Protection
`lib/middleware.ts` checks every route request:
1. Verifies user is authenticated
2. Fetches user role from database
3. Checks if user can access the requested route
4. Redirects if unauthorized

### Database Security
- Row Level Security (RLS) policies ensure data access is role-appropriate
- Automatic trigger creates user profile on signup
- Only superadmins can modify user roles

### Server-Side Verification
Each protected page double-checks permissions:
```tsx
const profile = await getUserProfile()
if (!profile) redirect('/auth/login')

const hasAccess = await hasAnyRole(['health_admin', 'superadmin'])
if (!hasAccess) redirect('/dashboard')
```

## Using Roles in Your Code

```tsx
import { 
  getUserRole, 
  hasRole, 
  hasAnyRole, 
  isSuperAdmin 
} from '@/lib/roles'

// Check current user's role
const role = await getUserRole() // 'default' | 'health_admin' | 'superadmin'

// Check if user has specific role
if (await hasRole('superadmin')) {
  // Show admin-only content
}

// Check if user has any of multiple roles
if (await hasAnyRole(['health_admin', 'superadmin'])) {
  // Show content for admins
}

// Convenience function
if (await isSuperAdmin()) {
  // Show superadmin features
}
```

## Common Issues

### "Role not found" or redirect loops
- Ensure migration ran successfully
- Check `user_profiles` table has entries
- Verify user has a valid role value

### Changes not taking effect
- Log out and log back in
- Check database directly to confirm role change

### Profile not auto-created
- Trigger might not be working
- Create profile manually or re-run migration

## Next Steps

1. **Customize Dashboards**: Update the dashboard pages with your actual features
2. **Add Role Management UI**: Build interface for superadmins to manage roles
3. **Protect API Routes**: Apply role checks to API endpoints
4. **Add More Routes**: Create additional role-specific pages as needed

## Need Help?

See `RBAC_SETUP.md` for detailed documentation.
