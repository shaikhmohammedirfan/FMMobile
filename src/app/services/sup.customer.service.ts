import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { customerProfileInterface } from '../interfaces/customer.interface';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupCustomerService {
  private readonly supabase: SupabaseClient;
  // to hold selected product details
  allCustomerView$ = new BehaviorSubject<customerProfileInterface[]>([]);
  customermst$ = new BehaviorSubject<any>(null);
  custbillingaddress$ = new BehaviorSubject<any>(null);
  custdeliveryaddresses$ = new BehaviorSubject<any>(null);

  loclCustomerDetails$ = new BehaviorSubject<any>(null);

  constructor(private readonly auth: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getCustomerMstData(): Promise<any> {
    const gymcode = this.auth.currgymid.value;

    const DATA_TABLE = `${gymcode}_customer_mst`;
    // console.log('gymcode', DATA_TABLE);
    const { data, status, error } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', this.auth.localcustomerkey.value)
      .throwOnError();

    if (data?.length) {
      // console.log('status in service=', status);
      // return data || [];
      this.customermst$.next(data);
      console.log('data in serviceee=', this.customermst$.value);
    } else {
      console.log('customer master error from service=', error);
      // console.log('cart status in service=', status);
      // return error;
      console.log('Error Fount!', error);
    }
  }
  async getCustomerProfile(): Promise<any> {
    // async getCustomerProfile(): Promise<Observable<customerProfileInterface[]>> {
    const gymcode = this.auth.currgymid.value;
    console.log('custome info in service=', gymcode);
    const DATA_TABLE = `${gymcode}_customer_profile_view`;
    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: this.auth.localcustomerkey.value,
      });

    // return customerprofile.data || [];

    if (data?.length) {
      this.allCustomerView$.next(data);
      console.log('custmst data in service=', this.allCustomerView$.value);
    }

    return this.allCustomerView$.value;
  }

  async getLocalCustomerDetails(): Promise<any> {
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_all_details_view`;
    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', this.auth.localcustomerkey.value);

    if (data?.length) {
      this.loclCustomerDetails$.next(data);
      console.log(
        'local customer data in service',
        this.loclCustomerDetails$.value
      );
    } else {
      this.loclCustomerDetails$.next(error);
    }
  }
  async getCustomerDeliveryAddresses() {
    const customerkey = this.auth.localcustomerkey.value;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: customerkey,
      })
      // .eq('customer_id', customerkey)
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      //return data || {};
      this.custdeliveryaddresses$.next(data);
      console.log(
        'cust delivery address in service=',
        this.custdeliveryaddresses$.value
      );
    } else {
      console.log('Error from service=', error);
      // console.log('cart status in service=', status);
      // return error;
      this.custdeliveryaddresses$.next(error);
    }
  }
  async getCustomerBillingAddress() {
    const customerkey = this.auth.localcustomerkey.value;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_billing_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: customerkey,
      })
      .eq('customer_id', customerkey)
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      //return data || {};
      this.custbillingaddress$.next(data);
      // console.log(
      //   'cust bill address from service=',
      //   this.custbillingaddress$.value
      // );
    } else {
      console.log('Error from service=', error);
      console.log('cart status in service=', status);
      return console.log('Error Found!', error);
      // this.custbillingaddress$.next(error);
    }
  }

  async insCustomerMst(custmstItemArray: any) {
    console.log('insert succes=', custmstItemArray);
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_mst`;
  }

  async insCustomerDeliveryAddress(deliveryaddress: any) {
    console.log('from inscustdeliveryaddr in service=', deliveryaddress);
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .insert(deliveryaddress)
      .select()
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      return data || [];
    } else {
      console.log('Error from service=', error);
      // console.log('cart status in service=', status);
      return error;
    }
  }
  async insCustomerBillingAddress(addressItemArray: any) {
    // console.log('insert succes=', addressItemArray);
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_billing_address`;

    // let propertyNames = Object.values(formval);

    // const addressItemArray = {
    //   customer_id: '629e3e64-adf4-4165-9b4f-6acff1967dfe',
    //   customer_panno: 'Irfan',
    //   customer_name: 'Irfan',
    //   area_street: 'Irfan',
    //   landmark: 'Irfan',
    //   city_dist: 'Irfan',
    //   state: 'Irfan',
    //   pincode: 'Irfan',
    //   country: 'Irfan',
    //   reg_mobileno: '1234567899',
    //   reg_email: 'test@test.com',
    // };

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .insert(addressItemArray)
      .select()
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      return data || [];
    } else {
      console.log('Error from service=', error);
      // console.log('cart status in service=', status);
      return error;
    }
  }

  async editCustomerDeliveryAddress(formval: any) {
    console.log('EDIT FORM VALUE IN SERVICE=', formval);
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    let { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .update([
        {
          area_street: formval.area_street,
          address_type: formval.address_type,
          landmark: formval.landmark,
          city_dist: formval.city_dist,
          state: formval.state,
          pincode: formval.pincode,
          country: formval.country,
          default_del_address: formval.default_del_address,
        },
      ])
      .match({
        customer_id: formval.customer_id,
        address_id: formval.address_id,
      })
      .select();

    return data || [];
  }
  async editCustomerBillingAddress(formval: any) {
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_billing_address`;

    console.log('BILL FORM VALUE in service', formval);
    let { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .update([
        {
          area_street: formval.area_street,
          landmark: formval.landmark,
          city_dist: formval.city_dist,
          state: formval.state,
          pincode: formval.pincode,
          country: formval.country,
        },
      ])
      .match({ customer_id: formval.customer_id })
      .select();

    return data || [];
  }
  async editCustomerMst(formval: any) {
    console.log('custmst edit from service=', formval);
    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_mst`;

    let { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .update([
        {
          customer_name: formval.customer_name,
          reg_mobileno: formval.reg_mobileno,
          reg_email: formval.reg_email,
          mobile_verified: formval.mobile_verified,
          email_verified: formval.email_verified,
          curr_gymid: formval.curr_gymid,
          account_status: formval.account_status,
          shortname: formval.shortname,
          customer_panno: formval.customer_panno,
          alternatephone: formval.alternatephone,
        },
      ])
      .match({ customer_id: formval.customer_id })
      .select();

    return data || [];
  }
}
