import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { productinterface } from '../interfaces/product.interface';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SupSaveditemsService {
  private readonly supabase: SupabaseClient;

  customerkey!: string | null;
  saveitemSubject = new Subject();

  // to hold cartdata
  savedItemsDetails = new BehaviorSubject<any>(null);

  savedItemsData$ = new BehaviorSubject<any>(null);
  deletedItem$ = new BehaviorSubject<any>(null);

  constructor(private readonly auth: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getMsgFromSavedItemsSubject() {
    return this.saveitemSubject.asObservable();
  }

  async getSavedItemsBycustomer(customerkey: any) {
    const { value } = await Preferences.get({ key: 'ecustomerkey' });

    console.log('saveitem list=', customerkey);

    // select details value from view
    const DATA_TABLE = `fm_saved_for_later_detail_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', customerkey)
      .throwOnError();

    if (data?.length) {
      console.log(' saveItem data in service=', data);
      console.log('saveItem status in service=', status);
      return data || [];
    } else {
      console.log(' saveItem error from service=', error);
      console.log('saveItem status in service=', status);
      return error;
    }
  }

  async sendMsgToSaveItemSuject(item: any[]): Promise<any> {
    //Triggering event
    this.saveitemSubject.next(item);
    this.insSavedItem(item).then((resp: any) => {
      if (resp) {
        console.log('Insert Success');
      } else {
        console.log('Error Found!');
      }
    });
    this.remSavedItemFromCart(item);
  }

  async insSavedItem(item2save: productinterface[]) {
    this.customerkey = await this.auth.getLocalcustomerKey();

    console.log('from service=', this.customerkey);

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_saved_for_later`;

    const itemArray = item2save['map']((element: any) => {
      return {
        customer_id: this.customerkey,
        productid: element.productid,
        product_qty: element.cart_product_qty,
        product_unit_price: element.currentprice,
        product_mrp: element.mrp,
      };
    });

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .insert(itemArray)
      .select()
      .throwOnError();

    if (data?.length) {
      console.log(' saveItem data in service=', data);
      console.log('saveItem status in service=', status);
      return data || [];
    } else {
      console.log(' saveItem error from service=', error);
      console.log('saveItem status in service=', status);
      return error;
    }
  }

  async remSavedItemFromCart(item2rem: productinterface[]) {
    // console.log('from service=', item2rem);
    let resp = await this.auth.getLocalcustomerKey();
    this.customerkey = resp;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_cart_mst`;

    item2rem.forEach(async (element: any) => {
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
        return data || [];
      } else {
        console.log(' cartItem error from service=', error);
        console.log('cartItem status in service=', status);
        return error;
      }
    });
  }

  async remSavedItem(item2rem: any) {
    let custkey = await this.auth.getLocalcustomerKey();
    this.customerkey = custkey;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_saved_for_later`;

    item2rem.forEach(async (element: any) => {
      const { data, error, status } = await this.supabase
        .from(DATA_TABLE)
        .delete()
        .match({
          customer_id: this.customerkey,
          productid: element.productid,
        })
        .select()
        .throwOnError();

      if (data?.length) {
        console.log(' saveItem data in service=', data);

        this.deletedItem$.next(data);

        return data || [];
      } else {
        console.log(' saveItem error from service=', error);
        console.log('saveItem status in service=', status);

        return error;
      }
    });
  }
}
