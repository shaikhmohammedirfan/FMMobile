import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupCartsService {
  private readonly supabase: SupabaseClient;

  cartSubject = new Subject();

  cartInsSubject$ = new BehaviorSubject<any>(null);

  delCartItem$ = new BehaviorSubject<any>(null);

  timestamp = new Date().toISOString();

  // to hold existing cartdata in db
  cartDetails = new BehaviorSubject<any>(null);

  currProdQty = new BehaviorSubject<any>(null);

  myCartList: any[] = [];

  cartmrptotal = new BehaviorSubject<number>(0);

  cartdiscounttotal = new BehaviorSubject<number>(0);

  cartsavingtotal = new BehaviorSubject<number>(0);

  cartdeliveryfee = new BehaviorSubject<number>(0);

  cartcurrtotal = new BehaviorSubject<number>(0);

  cartnettotal = new BehaviorSubject<number>(0);

  // to hold curr order data
  orderDetails = new BehaviorSubject<any>(null);

  customerkey: any;
  cartData$ = new BehaviorSubject<any>(null);

  allCartTotals$ = new BehaviorSubject<any>({});

  constructor(private readonly auth: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // sendMsgToCartSubject(product: any) {
  //   //Triggering event
  //   this.cartSubject.next(product);
  //   // this.insCartItem(product);
  // }

  // getMsgFromCartSubject() {
  //   return this.cartSubject.asObservable();
  // }

  // get cart data by customer from DB and store it on cartData observable
  async loadCardDataFromDb(): Promise<any> {
    let resp = await this.auth.getLocalcustomerKey();
    this.customerkey = resp;

    const gymcode = 'fm';
    // select details value from view
    const DATA_TABLE = `${gymcode}_cart_detail_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', this.customerkey)
      .throwOnError();

    if (data?.length) {
      // console.log('cart data in service=', data);
      // console.log('cart status in service=', status);
      // return data || [];
      this.cartData$.next(data);
      console.log('CURR CART DATA IN SERVICE=', this.cartData$);
    } else {
      console.log('cart error from service=', error);
      console.log('cart status in service=', status);
      this.cartData$.next(error);
    }
  }

  // async getCartData() {
  //   try {
  //     // Get existing Cart details from db
  //     this.getCartDetails();

  //     // Add current cart item to
  //     // this.cartSubject.subscribe((product: any) => {
  //     //   // this.cartItems.push({
  //     //   //   ...product[0],
  //     //   // });
  //     //   // console.log(
  //     //   //   'cartItems from db plus curr add2cart item value=',
  //     //   //   this.cartItems
  //     //   // );
  //     //   // this.getCartTotals();
  //     // });
  //   } catch (error) {
  //     console.log('error message from cartdata', error);
  //   }
  // }

  // async getCartDetails(): Promise<any> {
  //   try {
  //     let resp = await this.loadCardDataFromDb();

  //     // store extracted cartdata from db to cartDetails subject variable
  //     this.cartDetails.next([...resp]);

  //     // Save above cartdata on local cartdata variable cartItems
  //     this.cartItems$.next(this.cartDetails.value);

  //     console.log(
  //       'cartItem length rcvd from db=',
  //       this.cartItems$.value.length
  //     );

  //     // if ((resp = 0 || resp == null || undefined)) {
  //     //   this.emptycontainer = true;
  //     // }

  //     this.getCartTotals();
  //   } catch (error) {}
  // }

  // myfunc(): BehaviorSubject<any> {
  //   this.testSubject$.next({
  //     name: 'Irfan',
  //     age: 50,
  //   });

  //   return this.testSubject$.value;
  // }

  getCartTotals(cartitem: any): BehaviorSubject<any> {
    // Convert all previous value to zero
    let mrptotal = 0;
    let currtotal = 0;
    let discounttotal = 0;
    let deleveryfee = 0;
    let savingtotal = 0;
    let netamount = 0;

    // this.cartItems$.forEach((product: any) => {
    cartitem.forEach((product: any) => {
      // console.log('carttotal', product[0].mrp);

      // cart totals
      mrptotal = mrptotal + product[0].mrp * product[0].cart_product_qty;
      this.cartmrptotal.next(mrptotal);

      currtotal =
        currtotal + product[0].currentprice * product[0].cart_product_qty;
      this.cartcurrtotal.next(currtotal);

      discounttotal = mrptotal - currtotal;
      this.cartdiscounttotal.next(discounttotal);

      savingtotal = discounttotal;
      this.cartsavingtotal.next(savingtotal);
    });

    // Delivery Fee Calculation
    if (currtotal >= 1000) {
      deleveryfee = 0;
      this.cartdeliveryfee.next(deleveryfee);
      netamount = currtotal + deleveryfee;
      this.cartnettotal.next(netamount);
    } else {
      deleveryfee = 50;
      this.cartdeliveryfee.next(deleveryfee);
      netamount = currtotal + deleveryfee;
      this.cartnettotal.next(netamount);
    }
    this.allCartTotals$.next({
      mrptotal: mrptotal,
      currtotal: currtotal,
      discounttotal: discounttotal,
      savingtotal: savingtotal,
    });
    console.log('alltotals in service=', this.allCartTotals$.value);
    return this.allCartTotals$.value;
    //   // console.log(
    //   //   `totals= ${this.mrptotal},  ${this.supservice.cartsavingtotal.value}`
    //   // );
  }

  async insSavedItem(cartitem: any) {}
  async insCartItem(cartitem: any) {
    // this.sendMsgToCartSubject(cartitem);
    // console.log('product from cartservice=', cartitem);
    this.auth.getLocalcustomerKey().then(async (resp: any) => {
      // console.log('local customer key=', this.auth.localcustomerkey.value);
      this.customerkey = resp;

      const gymcode = 'fm';
      // select details value from view
      const DATA_TABLE = `${gymcode}_cart_mst`;

      // updated_at, update_by cart_item_expiry_dt will be inserted by default in database, set while creating table

      const cartItemArray = cartitem.map((cartitem: any) => {
        return {
          customer_id: this.customerkey,
          cart_productid: cartitem.productid,
          cart_product_qty: 1,
          cart_product_unit_price: cartitem.currentprice,
          cart_product_mrp: cartitem.mrp,
        };
      });

      const { data, error, status } = await this.supabase
        .from(DATA_TABLE)
        .insert(cartItemArray)
        .select()
        .throwOnError();

      if (data?.length) {
        // console.log('cart data inserted success msg from service=', data);
        //  console.log('cart status in service=', status);
        // return data || [];
        this.cartInsSubject$.next(data);
      } else {
        console.log('cart error from service=', error);
        // console.log('cart status in service=', status);
        // return error;
        this.cartInsSubject$.next(error);
      }
    });

    // this.cartDetails;
  }

  async decreaseQty(cartitem: any) {
    console.log('under decreaseQty=', cartitem);
    console.log('customer code=', this.auth.localcustomerkey.value);

    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_cart_mst`;
    let cartprodid = '';

    const cartitemArray = cartitem.map((cartitem: any) => {
      cartprodid = cartitem.cart_productid;
      return {
        cart_product_unit_price: cartitem.currentprice,
        cart_product_qty: cartitem.cart_product_qty - 1,
        updated_at: new Date().toISOString(),
      };
    });

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .update(cartitemArray)
      .match({
        customer_id: this.auth.localcustomerkey.value,
        cart_productid: cartprodid,
      })
      .select()
      .throwOnError();

    if (data?.length) {
      console.log('cart data in service=', data);
      //    console.log('cart status in service=', status);
      return data || [];
    } else {
      console.log('cart error from service=', error);
      // console.log('cart status in service=', status);
      return error;
    }
  }

  async addQty(cartitem: any) {
    // console.log('under addqty=', cartitem);
    // console.log('customer code=', this.auth.localcustomerkey.value);

    let cartprodid = '';

    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_cart_mst`;

    const cartitemArray = cartitem.map((cartitem: any) => {
      cartprodid = cartitem.cart_productid;
      return {
        cart_product_unit_price: cartitem.currentprice,
        cart_product_qty: cartitem.cart_product_qty + 1,
        updated_at: new Date().toISOString(),
      };
    });
    // console.log(cartitemArray);
    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .update(cartitemArray)
      .match({
        customer_id: this.auth.localcustomerkey.value,
        cart_productid: cartprodid,
      })
      .select()
      .throwOnError();

    if (data?.length) {
      console.log('cart data in service=', data);
      //    console.log('cart status in service=', status);
      return data || [];
    } else {
      console.log('cart error from service=', error);
      // console.log('cart status in service=', status);
      return error;
    }
  }

  async removeCartItem(cartitem: any) {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_cart_mst`;

    let resp = await this.auth.getLocalcustomerKey();
    this.customerkey = resp;
    console.log('b4 delete=', cartitem);

    cartitem.forEach(async (element: any) => {
      const { data, error, status } = await this.supabase
        .from(DATA_TABLE)
        .delete()
        .match({
          customer_id: this.customerkey,
          cart_productid: element.cart_productid,
        })
        .select()
        .throwOnError();

      if (data?.length) {
        console.log(' saveItem data in service=', data);
        console.log('saveItem status in service=', status);
        // return data || [];
        this.delCartItem$.next(data);
      } else {
        console.log(' saveItem error from service=', error);
        console.log('saveItem status in service=', status);
        // return error;
        this.delCartItem$.next(data);
      }
    });
  }
  // .update({
  //   subjectname: formval.subjectname,
  //   stream: formval.stream,
  //   last_modified: this.timestamp,
  //   modified_by: loggedinuser,
  // })
  // .eq('subjectname', formval.subjectname);
}
