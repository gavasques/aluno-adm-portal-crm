
import { vi } from 'vitest';

export const createMockSupabaseClient = () => ({
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  }),
  rpc: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
});

export const mockPermissionGroups = [
  {
    id: '1',
    name: 'Admin Group',
    description: 'Administrative permissions',
    is_admin: true,
    allow_admin_access: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Student Group',
    description: 'Student permissions',
    is_admin: false,
    allow_admin_access: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockSystemMenus = [
  {
    id: '1',
    menu_key: 'dashboard',
    display_name: 'Dashboard',
    description: 'Main dashboard',
    icon: 'dashboard-icon',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    menu_key: 'users',
    display_name: 'Users',
    description: 'User management',
    icon: 'users-icon',
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const mockSystemModules = [
  {
    id: '1',
    module_key: 'suppliers',
    module_name: 'Suppliers Management',
    description: 'Manage suppliers',
    category: 'management',
    icon: 'suppliers-icon',
    is_premium: false,
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    actions: [
      {
        id: '1',
        action_key: 'create',
        action_name: 'Create',
        description: 'Create suppliers',
        module_id: '1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
];
