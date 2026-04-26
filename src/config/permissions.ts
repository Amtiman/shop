export interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

export const PERMISSIONS = {
  // Admin Management
  MANAGE_ADMINS: 'manage_admins',
  VIEW_ADMINS: 'view_admins',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  EDIT_USER_PERMISSIONS: 'edit_user_permissions',
  
  // Product Management
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_PRODUCTS: 'view_products',
  EDIT_PRODUCTS: 'edit_products',
  
  // Category Management
  MANAGE_CATEGORIES: 'manage_categories',
  
  // Orders
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ORDERS: 'view_orders',
  
  // Content
  MANAGE_CONTENT: 'manage_content',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  
  // Superuser
  ALL_ACCESS: 'all',
} as const;

export type PermissionId = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const PERMISSIONS_LIST: Permission[] = [
  { id: PERMISSIONS.MANAGE_ADMINS, label: 'Manage Admins', description: 'Create, edit, and remove admin accounts', category: 'Admin' },
  { id: PERMISSIONS.VIEW_ADMINS, label: 'View Admins', description: 'View admin accounts list', category: 'Admin' },
  { id: PERMISSIONS.MANAGE_USERS, label: 'Manage Users', description: 'Create, edit, and remove user accounts', category: 'Users' },
  { id: PERMISSIONS.VIEW_USERS, label: 'View Users', description: 'View user accounts list', category: 'Users' },
  { id: PERMISSIONS.EDIT_USER_PERMISSIONS, label: 'Edit User Permissions', description: 'Grant or revoke user permissions', category: 'Users' },
  { id: PERMISSIONS.MANAGE_PRODUCTS, label: 'Manage Products', description: 'Create, edit, and remove products', category: 'Products' },
  { id: PERMISSIONS.VIEW_PRODUCTS, label: 'View Products', description: 'View product catalog', category: 'Products' },
  { id: PERMISSIONS.EDIT_PRODUCTS, label: 'Edit Products', description: 'Edit existing products', category: 'Products' },
  { id: PERMISSIONS.MANAGE_CATEGORIES, label: 'Manage Categories', description: 'Create and manage product categories', category: 'Products' },
  { id: PERMISSIONS.MANAGE_ORDERS, label: 'Manage Orders', description: 'View, process, and manage orders', category: 'Orders' },
  { id: PERMISSIONS.VIEW_ORDERS, label: 'View Orders', description: 'View order history', category: 'Orders' },
  { id: PERMISSIONS.MANAGE_CONTENT, label: 'Manage Content', description: 'Manage site content and pages', category: 'Content' },
  { id: PERMISSIONS.VIEW_ANALYTICS, label: 'View Analytics', description: 'Access analytics and reports', category: 'Analytics' },
  { id: PERMISSIONS.ALL_ACCESS, label: 'Full Access', description: 'Unrestricted access to all features', category: 'Superuser' },
];

export const getPermissionsByCategory = (t: (key: string) => string) => {
  const categories: Record<string, Permission[]> = {};
  
  PERMISSIONS_LIST.forEach(perm => {
    if (!categories[perm.category]) {
      categories[perm.category] = [];
    }
    categories[perm.category].push({
      ...perm,
      label: t(`permissions.${perm.id}`),
    });
  });
  
  return categories;
};

export const getAvailablePermissions = (t: (key: string) => string) => {
  return PERMISSIONS_LIST.map(p => ({
    ...p,
    label: t(`permissions.${p.id}`),
  }));
};

export const DEFAULT_ADMIN_PERMISSIONS: PermissionId[] = [
  PERMISSIONS.ALL_ACCESS,
];

export const DEFAULT_USER_PERMISSIONS: PermissionId[] = [
  PERMISSIONS.VIEW_PRODUCTS,
  PERMISSIONS.VIEW_ORDERS,
];