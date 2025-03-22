import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, last } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { SupCartsService } from './sup.carts.service';
import { SupCustomerService } from './sup.customer.service';
import { so_mstInterface } from '../interfaces/somaster.interface';
import { so_detailsInterface } from '../interfaces/sodetails.interface';

@Injectable({
  providedIn: 'root',
})
export class SupOrderService {
  private readonly supabase: SupabaseClient;

  gymcode = 'fm';

  // to hold existing cartdata from db
  orderDetails$ = new BehaviorSubject<any>(null);
  soMst$ = new BehaviorSubject<so_mstInterface[]>([]);
  soMstObj$ = new BehaviorSubject<so_mstInterface[]>([]);

  orderInsSubject$ = new BehaviorSubject<any>(null);

  ordDetailsInsSubject$ = new BehaviorSubject<any>(null);

  OrderDetailItems: any[] = [];
  ordItemArray: any;
  orderMstArray: any;

  custsoMstList$ = new BehaviorSubject<any>(null);
  custsoDetailList$ = new BehaviorSubject<any>(null);
  custAllsoDetails: any[] = [];
  custLastOrdNo$ = new BehaviorSubject<any>(null);
  newOrderId$ = new BehaviorSubject<string>('');

  pmtMethod$ = new BehaviorSubject<any>(null);
  // totalOrderAmt = this.

  constructor(
    private readonly auth: AuthService,
    private readonly custservice: SupCustomerService,
    private readonly cartservice: SupCartsService
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  //   customer_id uuid not null,
  //   order_amount numeric not null,
  //   order_status text not null default 'pending'::text,
  //   payment_method text not null default 'COD'::text,
  // del_add_id text null,
  //   del_add_type text null,
  //   del_add_name text not null,
  //   del_add_area_street text not null,
  //   del_add_landmark text null,
  //   del_add_city_dist text not null,
  //   del_add_state text not null,
  //   del_add_pincode text not null,
  //   del_add_country text not null default 'India'::text,
  //   del_add_mobileno text not null,
  //   del_add_alternatephone text null,
  //   del_add_email text null,
  //   bill_add_type text null,
  //   bill_add_name text not null,
  //   bill_add_area_street text not null,
  //   bill_add_landmark text null,
  //   bill_add_city_dist text not null,
  //   bill_add_state text not null,
  //   bill_add_pincode text not null,
  //   bill_add_country text not null default 'India'::text,
  //   bill_add_mobileno text not null,
  //   bill_add_alternatephone text null,
  //   bill_add_email text null,
  //   inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
  //   updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  //   update_by text not null,
  //   constraint fm_so_mst_pkey primary key (order_id),
  //   constraint fm_so_mst_customer_id_fkey foreign key (customer_id) references fm_customer_mst (customer_id)
  // ) tablespace pg_default;

  // myfunc(): BehaviorSubject<any> {
  //   this.testSubject$.next({
  //     name: 'Irfan',
  //     age: 50,
  //   });

  //   return this.testSubject$.value;
  // }

  async custsoMstList(custid: string): Promise<Observable<so_mstInterface>> {
    const DATA_TABLE = `${this.gymcode}_so_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', custid)
      .throwOnError();

    if (data?.length) {
      this.custsoMstList$.next(data);
    } else {
      this.custsoMstList$.next([]);
      // console.log('customer last order no=', this.custLastOrdNo$.value);
    }

    return this.custsoMstList$.value;
  }

  async custsoDetailList(
    orderid: string
  ): Promise<Observable<so_detailsInterface>> {
    const DATA_TABLE = `${this.gymcode}_so_detail_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('order_id', orderid)
      .throwOnError();

    if (data?.length) {
      this.custsoDetailList$.next(data);

      data.forEach((element: any) => {
        this.custAllsoDetails.push([{ ...element }]);
      });
      console.log('all soDetails=', this.custAllsoDetails);
    } else {
      this.custsoDetailList$.next([]);
      // console.log('customer last order no=', this.custLastOrdNo$.value);
    }

    return this.custsoDetailList$.value;
  }

  async custLastOrdNo(custid: any): Promise<Observable<any>> {
    // console.log('CUstid from service=', custid);

    const DATA_TABLE = `${this.gymcode}_so_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select('cust_order_no')
      .order('cust_order_no', { ascending: false })
      .limit(1)
      .throwOnError();

    if (data?.length) {
      this.custLastOrdNo$.next(data);
      // console.log('customer last order no=', this.custLastOrdNo$.value);
    } else {
      this.custLastOrdNo$.next(1);
      // console.log('customer last order no=', this.custLastOrdNo$.value);
    }

    return this.custLastOrdNo$.value;
  }

  async insOrderMst() {
    const orderMst = this.soMst$.value;
    const orderDetails = this.orderDetails$.value;
    const custkey = this.auth.localcustomerkey.value;

    const lastorderno = this.custLastOrdNo$.value;
    // console.log('LAST ORDER NO-', lastorderno);

    // this.custLastOrdNo(this.auth.localcustomerkey.value).then((resp: any) => {
    //   lastrderno = resp;
    //   console.log('order Master Data', lastrderno);
    // });

    // console.log('ordeDeta9psData', this.orderDetails$.value);

    // console.log(
    //   'delivery address selecte4d=',
    //   this.auth.selectedDelAddType$.value
    // );

    orderMst.forEach((element: any) => {
      if ((element.default_del_address = this.auth.selectedDelAddType$.value)) {
        this.soMstObj$.next([{ ...element }]);
      }
    });

    this.soMstObj$.value.forEach(async (ordmstdata: any) => {
      console.log('selecte4d soMst=', lastorderno);

      this.orderMstArray = {
        customer_id: this.auth.localcustomerkey.value,
        // cust_order_no: `${this.auth.localcustomerkey.value}-lastrderno`,
        // to display leading zeros with order no use padStart
        cust_order_no: `${lastorderno}`,
        reg_mobileno: ordmstdata.reg_mobileno,
        // reg_alternatephone: ordmstdata.reg_alternatephone,
        reg_email: ordmstdata.reg_email,
        order_amount: this.cartservice.cartnettotal.value,
        order_status: 'Confirmed',
        payment_method: this.pmtMethod$.value,
        del_add_id: ordmstdata.del_addr_id,
        del_add_type: ordmstdata.del_addr_type,
        del_add_name: ordmstdata.customer_name,
        del_add_area_street: ordmstdata.del_addr_area_street,
        del_add_landmark: ordmstdata.del_addr_landmark,
        del_add_city_dist: ordmstdata.del_addr_city_dist,
        del_add_state: ordmstdata.del_addr_state,
        del_add_pincode: ordmstdata.del_addr_pincode,
        del_add_country: ordmstdata.del_addr_country,
        del_add_mobileno: ordmstdata.reg_mobileno,
        bill_add_type: ordmstdata.bill_addr_type,
        bill_add_name: ordmstdata.customer_name,
        bill_add_area_street: ordmstdata.bill_addr_area_street,
        bill_add_landmark: ordmstdata.bill_addr_landmark,
        bill_add_city_dist: ordmstdata.bill_addr_city_dist,
        bill_add_state: ordmstdata.bill_addr_state,
        bill_add_pincode: ordmstdata.bill_addr_pincode,
        bill_add_country: ordmstdata.bill_addr_country,
        bill_add_mobileno: ordmstdata.reg_mobileno,
      };
      console.log('orderMstData', this.orderMstArray);

      // const gymcode = 'fm';

      const DATA_TABLE = `${this.gymcode}_so_mst`;
      const { data, error, status } = await this.supabase
        .from(DATA_TABLE)
        .insert(this.orderMstArray)
        .select()
        .throwOnError();

      if (data?.length) {
        console.log('cart data inserted success msg from service=', data);
        console.log('cart status in service=', status);
        this.insOrdDetails(data);
        return data || [];
      } else {
        console.log('cart error from service=', error);
        console.log('cart status in service=', status);
        return error;
      }
    });

    // this.custservice.getCustomerBillingAddress();
    // this.auth.getCustomerDeliveryAddress(this.auth.selectedDelAddType$.value);

    // console.log('custmst details=', this.custservice.customermst$.value);

    // console.log('customer mst data', this.custservice.customermst$.value);

    // this.auth.custdeliveryaddress$.value.forEach((element: any) => {

    // console.log('OrderMst array', OrderMst);

    // this.auth.getLocalcustomerKey().then(async (resp: any) => {
    //   const customerkey = resp;

    //   this.getCustomerBillingAddress().then((billaddress: any) => {
    //     console.log('cust billing addres=', billaddress);
    //     this.custbilladdress = billaddress;
    //   });

    //   const gymcode = 'fm';

    //   const DATA_TABLE = `${gymcode}_so_mst`;

    //   // this.custaddress = this.getCustomerBillingAddress(resp);

    //   // del_add_type text null,
    //   // del_add_name text not null,
    //   // del_add_area_street text not null,
    //   // del_add_landmark text null,
    //   // del_add_city_dist text not null,
    //   // del_add_state text not null,
    //   // del_add_pincode text not null,
    //   // del_add_country text not null default 'India'::text,
    //   // del_add_mobileno text not null,
    //   // del_add_alternatephone text null,
    //   // del_add_email text null,
    //   // bill_add_type text null,
    //   // bill_add_name text not null,
    //   // bill_add_area_street text not null,
    //   // bill_add_landmark text null,
    //   // bill_add_city_dist text not null,
    //   // bill_add_state text not null,
    //   // bill_add_pincode text not null,
    //   // bill_add_country text not null default 'India'::text,
    //   // bill_add_mobileno text not null,
    //   // bill_add_alternatephone text null,
    //   // bill_add_email text null,

    //   const OrderMst = {
    //     customer_id: customerkey,
    //     order_amount: this.cartservice.cartnettotal.value,
    //   };

    //   const { data, error, status } = await this.supabase
    //     .from(DATA_TABLE)
    //     .insert(OrderMst)
    //     .select()
    //     .throwOnError();

    //   if (data?.length) {
    //     // console.log('cart data inserted success msg from service=', data);
    //     //  console.log('cart status in service=', status);
    //     // return data || [];
    //     this.orderInsSubject$.next(data);
    //   } else {
    //     console.log('cart error from service=', error);
    //     // console.log('cart status in service=', status);
    //     // return error;
    //     this.orderInsSubject$.next(error);
    //   }
    // });
  }
  async insOrdDetails(orderitems: any) {
    // console.log('order details items', this.orderDetails$.value);
    console.log('selecte4d soMst in ord detail=', this.soMstObj$.value);

    //get new order id generated for so_mst table
    orderitems.forEach((element: any) => {
      this.newOrderId$.next(element.order_id);
    });

    this.auth.getLocalcustomerKey().then(async (resp: any) => {
      const customerkey = resp;

      // const gymcode = 'fm';

      const DATA_TABLE = `${this.gymcode}_so_details`;

      this.orderDetails$.value.forEach((element: any) => {
        this.OrderDetailItems.push(...element);
      });

      // console.log('order details items', this.OrderDetailItems);

      // To convert array to array of objects
      this.OrderDetailItems.forEach(async (orderdata: any, index) => {
        // console.log('order Detail Data', orderdata.cart_productid);
        // console.log('NEW ORDER ID IN ORD_DETAILS', this.newOrderId$.value);
        this.ordItemArray = {
          order_id: this.newOrderId$.value,
          productid: orderdata.cart_productid,
          product_qty: orderdata.cart_product_qty,
          product_mrp: orderdata.cart_product_mrp,
          product_unit_price_applied: orderdata.cart_product_unit_price,
          product_coupon_code_applied: orderdata.product_unit_price_applied,
          customer_id: orderdata.customer_id,
          customer_order_id: this.custLastOrdNo$.value,
          order_line_no: `${index + 1}`,
          product_discount_code_applied:
            orderdata.product_discount_code_applied,
        };

        const { data, error, status } = await this.supabase
          .from(DATA_TABLE)
          .insert(this.ordItemArray)
          .select()
          .throwOnError();

        if (data?.length) {
          // console.log('cart data inserted success msg from service=', data);
          //  console.log('cart status in service=', status);
          // return data || [];
          this.ordDetailsInsSubject$.next(data);
        } else {
          console.log('cart error from service=', error);
          // console.log('cart status in service=', status);
          // return error;
          this.ordDetailsInsSubject$.next(data);
        }
      });
      // this.orderDetails$.subscribe((resp: any) => {
      //   if (resp) {
      //     resp.forEach((element: any) => {
      //       console.log('orderMstData', element);
      //     });
      //     console.log(this.OrderDetailItems.cart_productid);
      //   }
      // });

      // orderDetailItems.forEach((orderdata: any) => {
      //   console.log('orderitems=', orderdata.cart_product_mrp);
      // return {
      //   order_id: orderitems,
      //   productid: orderdata.cart_productid,
      //   product_qty: orderdata.cart_product_qty,
      //   product_mrp: orderdata.cart_product_mrp,
      //   product_unit_price_applied: orderdata.cart_product_unit_price,
      // };
      // return {
      //   order_id: orderid,
      //   productid:,
      //   product_qty:,
      //   product_mrp:,
      //   product_unit:,
      //   product_coupon_code_applied:,
      //   product_discount_code_applied:,
      // };
      // });
    });
  }
}
