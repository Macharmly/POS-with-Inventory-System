export interface Product {

  id: number;

  business_id: number;

  name: string;

  sku_barcode: string;

  category?: string;

  brand?: string;

  supplier?: string;

  unit_type?: string;

  description?: string;

  status?: 'active' | 'inactive';

  cost_price: number;

  selling_price: number;

  stock_quantity: number;

  low_stock_threshold: number;

}

export interface Service {

  id: number;

  name: string;

  description: string;

  service_price: number;

  linked_products?: Product[];

}

export interface CartItem {

  id: number;

  name: string;

  quantity: number;

  item_type:
    | 'product'
    | 'service';

  selling_price?: number;

  service_price?: number;

  stock_quantity?: number;

  business_id?: number;

  sku_barcode?: string;

  category?: string;

  brand?: string;

  supplier?: string;

  unit_type?: string;

  description?: string;

  status?: 'active' | 'inactive';

  cost_price?: number;

  low_stock_threshold?: number;

}