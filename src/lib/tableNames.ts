export const tbl = (tableName: string): string => tableName;

export const TABLES = {
  USERS: tbl('users'),
  PRODUCTS: tbl('products'),
  CATEGORIES: tbl('categories'),
  ORDERS: tbl('orders'),
  ORDER_ITEMS: tbl('order_items'),
  CART_ITEMS: tbl('cart_items'),
  REVIEWS: tbl('reviews'),
  WISHLIST: tbl('wishlist'),
} as const;

export const getTableName = (key: keyof typeof TABLES): string => {
  return TABLES[key];
};