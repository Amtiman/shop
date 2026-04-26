import { supabase } from '@/lib/supabase';
import { tbl } from '@/lib/tableNames';

export const apiService = {
  getProducts: async () => {
    const { data, error } = await supabase
      .from(tbl('products'))
      .select(`
        id,
        price,
        discount,
        quantity,
        balance,
        image,
        created_at,
        item_id,
        category_id,
        items (name, name_ar),
        product_categories (name, name_ar)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(p => ({
      ...p,
      name: p.items?.name,
      name_ar: p.items?.name_ar,
      category: p.product_categories?.name,
      category_ar: p.product_categories?.name_ar
    }));
  },

  addProduct: async (formData: any) => {
    let itemId = formData.item_id;

    if (!itemId) {
      const { data: newItem, error: itemError } = await supabase
        .from('items')
        .insert({
          name: formData.name,
          name_ar: formData.name_ar,
          category_id: formData.category_id
        })
        .select()
        .single();
      
      if (itemError) throw itemError;
      itemId = newItem.id;
    }

    const { data: product, error: productError } = await supabase
      .from(tbl('products'))
      .insert({
        item_id: itemId,
        category_id: formData.category_id,
        price: formData.price,
        discount: formData.discount || 0,
        quantity: formData.quantity || 0,
        balance: formData.quantity || 0,
        image: formData.image
      })
      .select()
      .single();

    if (productError) throw productError;
    return product;
  },

  updateProduct: async (id: string, formData: any) => {
    const { error: prodError } = await supabase
      .from(tbl('products'))
      .update({
        price: formData.price,
        discount: formData.discount,
        quantity: formData.quantity,
        image: formData.image,
        category_id: formData.category_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (prodError) throw prodError;

    if (formData.item_id) {
      await supabase
        .from('items')
        .update({
          name: formData.name,
          name_ar: formData.name_ar
        })
        .eq('id', formData.item_id);
    }

    return { success: true };
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from(tbl('products')).delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  getCategories: async () => {
    const { data, error } = await supabase.from(tbl('categories')).select('*');
    if (error) throw error;
    return data;
  },

  submitOrder: async (orderData: any) => {
    const { data, error } = await supabase
      .from(tbl('orders'))
      .insert({
        customer_name: orderData.fullName,
        phone: orderData.phone,
        address: orderData.address,
        payment_method: orderData.paymentMethod,
        items: orderData.items,
        total: orderData.total,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default apiService;