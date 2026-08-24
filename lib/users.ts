/**
 * In-memory user management and mock repository.
 * Replaces database/Prisma dependencies for a pure Next.js frontend deployment.
 */

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  province: string;
  is_active: boolean;
  role: 'ADMIN' | 'SUPERADMIN' | 'USER';
  created_at: string;
  updated_at: string;
}

export const ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || 'admin@epidemic-oracle.org',
  password: process.env.ADMIN_PASSWORD || 'Admin123!',
  username: process.env.ADMIN_USERNAME || 'Health Administrator',
  province: process.env.ADMIN_PROVINCE || 'Harare',
  role: 'ADMIN' as const,
};

export const SUPERADMIN_CONFIG = {
  email: process.env.SUPERADMIN_EMAIL || 'superadmin@epidemic-oracle.org',
  password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!',
  username: process.env.SUPERADMIN_USERNAME || 'Chief Epidemiologist',
  province: process.env.SUPERADMIN_PROVINCE || 'National',
  role: 'SUPERADMIN' as const,
};

export const GUEST_CONFIG = {
  email: 'guest@epidemic-oracle.org',
  password: 'guest',
  username: 'Guest Epidemiologist',
  province: 'National',
  role: 'ADMIN' as const,
};

// In-memory user database initialized with defaults
let usersStore: User[] = [
  {
    id: 'user-admin-01',
    username: ADMIN_CONFIG.username,
    email: ADMIN_CONFIG.email,
    province: ADMIN_CONFIG.province,
    is_active: true,
    role: 'ADMIN',
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'user-superadmin-01',
    username: SUPERADMIN_CONFIG.username,
    email: SUPERADMIN_CONFIG.email,
    province: SUPERADMIN_CONFIG.province,
    is_active: true,
    role: 'SUPERADMIN',
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'user-guest-01',
    username: GUEST_CONFIG.username,
    email: GUEST_CONFIG.email,
    province: GUEST_CONFIG.province,
    is_active: true,
    role: 'ADMIN',
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'user-dr-01',
    username: 'Dr. John Doe',
    email: 'jdoe@moh.gov.cd',
    province: 'Kinshasa',
    is_active: true,
    role: 'USER',
    created_at: new Date('2026-02-10').toISOString(),
    updated_at: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'user-dr-02',
    username: 'Dr. Sarah Ndlovu',
    email: 'sndlovu@health.gov.zw',
    province: 'Bulawayo',
    is_active: true,
    role: 'USER',
    created_at: new Date('2026-02-15').toISOString(),
    updated_at: new Date('2026-02-15').toISOString(),
  },
];

export function getAllUsers(): User[] {
  return [...usersStore];
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.toLowerCase().trim();
  // Check runtime configs first
  if (normalized === ADMIN_CONFIG.email.toLowerCase().trim()) {
    return {
      id: 'user-admin-01',
      username: ADMIN_CONFIG.username,
      email: ADMIN_CONFIG.email,
      province: ADMIN_CONFIG.province,
      is_active: true,
      role: 'ADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  if (normalized === SUPERADMIN_CONFIG.email.toLowerCase().trim()) {
    return {
      id: 'user-superadmin-01',
      username: SUPERADMIN_CONFIG.username,
      email: SUPERADMIN_CONFIG.email,
      province: SUPERADMIN_CONFIG.province,
      is_active: true,
      role: 'SUPERADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  if (normalized === GUEST_CONFIG.email.toLowerCase().trim()) {
    return {
      id: 'user-guest-01',
      username: GUEST_CONFIG.username,
      email: GUEST_CONFIG.email,
      province: GUEST_CONFIG.province,
      is_active: true,
      role: 'ADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  return usersStore.find((u) => u.email.toLowerCase().trim() === normalized);
}

export function findUserById(id: string): User | undefined {
  return usersStore.find((u) => u.id === id);
}

export function createUser(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
  const newUser: User = {
    ...data,
    id: `user-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  usersStore.unshift(newUser);
  return newUser;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) return null;
  usersStore[index] = {
    ...usersStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return usersStore[index];
}

export function deleteUser(id: string): boolean {
  const initialLength = usersStore.length;
  usersStore = usersStore.filter((u) => u.id !== id);
  return usersStore.length < initialLength;
}
