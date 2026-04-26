// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Sample fallback data
const SAMPLE_PRODUCTS = [
  {
    id: 'sample_1',
    name: 'Silk Evening Gown',
    name_ar: 'فستان سهرة حريري',
    price: 299.99,
    discount: 15,
    category: "Women's Clothing",
    category_ar: 'ملابس نسائية',
    category_id: 'sample_women',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
    balance: 10,
    quantity: 10,
    created_at: new Date().toISOString()
  },
  {
    id: 'sample_2',
    name: 'Classic Suspenders',
    name_ar: 'مشدات كلاسيكية',
    price: 45.00,
    discount: 0,
    category: "Men's Clothing",
    category_ar: 'ملابس رجالية',
    category_id: 'sample_men',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    balance: 15,
    quantity: 15,
    created_at: new Date().toISOString()
  }
];

const SAMPLE_CATEGORIES = [
  { id: 'sample_women', name: "Women's Clothing", name_ar: 'ملابس نسائية' },
  { id: 'sample_men', name: "Men's Clothing", name_ar: 'ملابس رجالية' },
  { id: 'sample_children', name: "Children's Clothing", name_ar: 'ملابس أطفال' },
  { id: 'sample_home', name: "Home & Living", name_ar: 'المنزل والمعيشة' }
];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // Start as false
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');


  // Load fallback data
  const loadFallbackData = useCallback(() => {
    console.log('⚠️ Loading fallback sample data...');
    setProducts(SAMPLE_PRODUCTS);
    setCategories(SAMPLE_CATEGORIES);
    setItems([]);
    setIsUsingFallback(true);
    setError('Using sample data. Database connection failed. You can still use admin panel to manage data.');
    setLoading(false);
  }, []);

  // Fetch categories - SIMPLIFIED
  const fetchCategories = useCallback(async () => {
    try {
      console.log('📋 Fetching categories...');
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('cat', 'ecom')
        .order('name');

      if (error) {
        console.warn('Error fetching categories:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} categories`);
      return data || [];
    } catch (err) {
      console.error('Exception fetching categories:', err);
      return [];
    }
  }, []);

  // Fetch items - SIMPLIFIED (no join)
  const fetchItems = useCallback(async () => {
    try {
      console.log('📦 Fetching items...');
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (error) {
        console.warn('Error fetching items:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} items`);
      return data || [];
    } catch (err) {
      console.error('Exception fetching items:', err);
      return [];
    }
  }, []);

  // Fetch products - SIMPLIFIED query
  const fetchProducts = useCallback(async () => {
    try {
      console.log('🛍️ Fetching products...');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching products:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} raw products`);
      return data || [];
    } catch (err) {
      console.error('Exception fetching products:', err);
      return [];
    }
  }, []);

  // Initialize all data - single parallel round trip, no separate connection test
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // All three queries fire in parallel; errors detected from results
      const [catResult, itemResult, prodResult] = await Promise.all([
        supabase.from('product_categories').select('*').eq('cat', 'ecom').order('name'),
        supabase.from('items').select('*').order('name'),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ]);

      if (prodResult.error) {
        console.warn('❌ Database connection failed:', prodResult.error.message);
        setConnectionStatus('failed');
        loadFallbackData();
        return;
      }

      const categoriesData = catResult.data || [];
      const itemsData = itemResult.data || [];
      const productsData = prodResult.data || [];

      setConnectionStatus('connected');
      setCategories(categoriesData);
      setItems(itemsData);

      const transformedProducts = productsData.map(product => {
        const category = categoriesData.find(c => c.id === product.category_id);
        const item = itemsData.find(i => i.id === product.item_id);
        return {
          id: product.id,
          price: parseFloat(product.price) || 0,
          discount: parseFloat(product.discount) || 0,
          quantity: product.quantity || 0,
          balance: product.balance || 0,
          image: product.image || '',
          created_at: product.created_at,
          updated_at: product.updated_at,
          category_id: product.category_id,
          category: category?.name || '',
          category_ar: category?.name_ar || '',
          category_fr: category?.name_fr || '',
          item_id: product.item_id,
          name: item?.name || 'Unnamed Product',
          name_ar: item?.name_ar || '',
          name_fr: item?.name_fr || '',
          item_type: item?.name || '',
        };
      });

      setProducts(transformedProducts);

      if (transformedProducts.length === 0) {
        setError('No products found. Add products using admin panel.');
      }
    } catch (err) {
      console.error('❌ Error initializing data:', err);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, [loadFallbackData]);

  // Add a new product - FIXED: Now creates item if needed
  const addProduct = useCallback(async (productData) => {
    console.log('➕ Adding product:', productData);

    try {
      // If using fallback data, simulate adding
      if (isUsingFallback) {
        const newProduct = {
          ...productData,
          id: `prod_${Date.now()}`,
          category: categories.find(c => c.id === productData.category_id)?.name || 'Uncategorized',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }

      // REAL DATABASE OPERATION
      let itemId = productData.item_id;

      // If no item is selected but we have a name, create a new item first
      if (!itemId && productData.name) {
        console.log('📦 Creating new item for product:', productData.name);

        const { data: newItemData, error: itemError } = await supabase
          .from('items')
          .insert({
            name: productData.name,
            name_ar: productData.name_ar || null,
            category_id: productData.category_id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (itemError) {
          console.error('❌ Error creating item:', itemError);
          throw new Error(`Failed to create item: ${itemError.message}`);
        }

        console.log('✅ Item created successfully:', newItemData);
        itemId = newItemData.id;

        // Update local items state
        setItems(prev => [...prev, newItemData]);
      }

      // Prepare product data
      const productToInsert = {
        price: parseFloat(productData.price) || 0,
        discount: parseFloat(productData.discount) || 0,
        quantity: parseInt(productData.quantity) || 0,
        balance: parseInt(productData.balance) || parseInt(productData.quantity) || 0,
        image: productData.image || null,
        category_id: productData.category_id,
        item_id: itemId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📤 Inserting product:', productToInsert);

      const { data, error } = await supabase
        .from('products')
        .insert(productToInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ Error inserting product:', error);
        throw error;
      }

      console.log('✅ Product added successfully:', data);

      // Transform for local state
      const category = categories.find(c => c.id === data.category_id);
      const item = items.find(i => i.id === data.item_id) || { name: productData.name, name_ar: productData.name_ar };

      const newProduct = {
        id: data.id,
        price: parseFloat(data.price) || 0,
        discount: parseFloat(data.discount) || 0,
        quantity: data.quantity || 0,
        balance: data.balance || 0,
        image: data.image || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        category_id: data.category_id,
        category: category?.name || '',
        category_ar: category?.name_ar || '',
        item_id: data.item_id,
        name: item?.name || productData.name || 'Unnamed Product',
        name_ar: item?.name_ar || productData.name_ar || '',
        item_type: item?.name || '',
      };

      // Update local state
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;

    } catch (err) {
      console.error('❌ Error adding product:', err);
      throw err; // Re-throw to show error in UI
    }
  }, [isUsingFallback, categories, items]);

  // Update a product - SIMPLIFIED
  const updateProduct = useCallback(async (id, productData) => {
    console.log('✏️ Updating product:', id, productData);

    try {
      // If using fallback data, simulate update
      if (isUsingFallback) {
        setProducts(prev => prev.map(p =>
          p.id === id ? { ...p, ...productData, updated_at: new Date().toISOString() } : p
        ));
        return { id, ...productData };
      }

      // REAL DATABASE OPERATION
      const updateData = {
        price: parseFloat(productData.price) || 0,
        discount: parseFloat(productData.discount) || 0,
        quantity: parseInt(productData.quantity) || 0,
        balance: parseInt(productData.balance) || parseInt(productData.quantity) || 0,
        image: productData.image || null,
        category_id: productData.category_id,
        item_id: productData.item_id || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating product:', error);
        throw error;
      }

      console.log('✅ Product updated successfully:', data);

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === id ? {
          ...p,
          ...productData,
          updated_at: data.updated_at
        } : p
      ));

      return data;

    } catch (err) {
      console.error('❌ Error updating product:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Delete a product - SIMPLIFIED
  const deleteProduct = useCallback(async (id) => {
    console.log('🗑️ Deleting product:', id);

    try {
      // If using fallback data, simulate delete
      if (isUsingFallback) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }

      // REAL DATABASE OPERATION
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting product:', error);
        throw error;
      }

      console.log('✅ Product deleted successfully');

      // Update local state
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;

    } catch (err) {
      console.error('❌ Error deleting product:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Add a new category - SIMPLIFIED
  const addCategory = useCallback(async (categoryData) => {
    console.log('➕ Adding category:', categoryData);

    try {
      // If using fallback, simulate add
      if (isUsingFallback) {
        const newCategory = {
          ...categoryData,
          id: `cat_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
      }

      // REAL DATABASE OPERATION
      const { data, error } = await supabase
        .from('product_categories')
        .insert({
          name: categoryData.name,
          name_ar: categoryData.name_ar || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding category:', error);
        throw error;
      }

      console.log('✅ Category added successfully:', data);

      // Update local state
      setCategories(prev => [...prev, data]);
      return data;

    } catch (err) {
      console.error('❌ Error adding category:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Update a category
  const updateCategory = useCallback(async (id, categoryData) => {
    console.log('✏️ Updating category:', id, categoryData);

    try {
      if (isUsingFallback) {
        setCategories(prev => prev.map(c =>
          c.id === id ? { ...c, ...categoryData, updated_at: new Date().toISOString() } : c
        ));
        return { id, ...categoryData };
      }

      const { data, error } = await supabase
        .from('product_categories')
        .update({
          name: categoryData.name,
          name_ar: categoryData.name_ar || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating category:', error);
        throw error;
      }

      console.log('✅ Category updated successfully:', data);
      setCategories(prev => prev.map(c => c.id === id ? data : c));
      return data;

    } catch (err) {
      console.error('❌ Error updating category:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Delete a category
  const deleteCategory = useCallback(async (id) => {
    console.log('🗑️ Deleting category:', id);

    try {
      if (isUsingFallback) {
        setCategories(prev => prev.filter(c => c.id !== id));
        return true;
      }

      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting category:', error);
        throw error;
      }

      console.log('✅ Category deleted successfully');
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;

    } catch (err) {
      console.error('❌ Error deleting category:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Add a new item - SIMPLIFIED
  const addItem = useCallback(async (itemData) => {
    console.log('➕ Adding item:', itemData);

    try {
      // If using fallback, simulate add
      if (isUsingFallback) {
        const newItem = {
          ...itemData,
          id: `item_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        setItems(prev => [...prev, newItem]);
        return newItem;
      }

      // REAL DATABASE OPERATION
      const { data, error } = await supabase
        .from('items')
        .insert({
          name: itemData.name,
          name_ar: itemData.name_ar || null,
          category_id: itemData.category_id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding item:', error);
        throw error;
      }

      console.log('✅ Item added successfully:', data);

      // Update local state
      setItems(prev => [...prev, data]);
      return data;

    } catch (err) {
      console.error('❌ Error adding item:', err);
      throw err;
    }
  }, [isUsingFallback]);

  // Get items by category
  const getItemsByCategory = useCallback((categoryId) => {
    return items.filter(item => item.category_id === categoryId);
  }, [items]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    await initializeData();
  }, [initializeData]);

  // Initial fetch - only once
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted) {
        await initializeData();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [initializeData]);

  // Realtime subscription - only if connected
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    console.log('🔔 Setting up realtime subscription...');

    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          console.log('🔄 Product change detected, refreshing...');
          const [newProducts, categoriesData, itemsData] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchItems(),
          ]);

          const transformed = newProducts.map(product => {
            const category = categoriesData.find(c => c.id === product.category_id);
            const item = itemsData.find(i => i.id === product.item_id);

            return {
              id: product.id,
              price: parseFloat(product.price) || 0,
              discount: parseFloat(product.discount) || 0,
              quantity: product.quantity || 0,
              balance: product.balance || 0,
              image: product.image || '',
              created_at: product.created_at,
              updated_at: product.updated_at,
              category_id: product.category_id,
              category: category?.name || '',
              category_ar: category?.name_ar || '',
              category_fr: category?.name_fr || '',
              item_id: product.item_id,
              name: item?.name || 'Unnamed Product',
              name_ar: item?.name_ar || '',
              name_fr: item?.name_fr || '',
              item_type: item?.name || '',
            };
          });

          if (transformed.length > 0) {
            setProducts(transformed);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔕 Unsubscribing from realtime');
      subscription.unsubscribe();
    };
  }, [connectionStatus, fetchProducts, fetchCategories, fetchItems]);

  return {
    // Data
    products,
    categories,
    items,
    loading,
    error,
    isUsingFallback,
    connectionStatus,

    // Operations
    fetchProducts: initializeData,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchItems,
    addItem,
    getItemsByCategory,
    retryConnection,
  };
};

export default useProducts;