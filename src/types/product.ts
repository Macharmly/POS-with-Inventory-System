export interface Product {

  id: number;

  business_id: number;

  name: string;

  sku_barcode: string;

  category: string;

  cost_price: number;

  selling_price: number;

  stock_quantity: number;

  low_stock_threshold: number;

}

export interface CartItem
  extends Product {

  quantity: number;

}