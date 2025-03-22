import { Timestamp } from 'rxjs';

export interface cartinterface {
  member_id: string;
  cart_productid: string;
  cart_product_qty: number;
  cart_product_unit_price: number;
  cart_item_expiry_dt: Date;
  cart_product_mrp: number;
  cart_line_total: number;
  updated_at: Date;
  update_by: string;
}
