import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { HttpParams, HttpClient } from '@angular/common/http';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { customerProfileInterface } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  testSubject$ = new BehaviorSubject<any>({});
  //gym
  currgymname = new BehaviorSubject<any>(null);
  currgymid = new BehaviorSubject<any>(null);
  localgymkey = new BehaviorSubject<any>(null);

  localgymname = new BehaviorSubject<any>(null);

  //customer

  // allCustomerView$ = new BehaviorSubject<any[]>([]);
  allCustomerView$ = new BehaviorSubject<any>(null);

  currcustomerid = new BehaviorSubject<any>(null);
  localcustomerkey = new BehaviorSubject<any>(null);
  localcustomername = new BehaviorSubject<any>(null);

  totalcartitems = new BehaviorSubject<any>(null);

  totalsaveditems = new BehaviorSubject<any>(null);

  customerInfo$ = new BehaviorSubject<any>(null);
  selectedCustDetails$ = new BehaviorSubject<any>(null);

  custdeliveryaddress$ = new BehaviorSubject<any>(null);
  selectedDelAddType$ = new BehaviorSubject<any>(null);

  billFormMode$ = new BehaviorSubject<string>('');
  custFormMode$ = new BehaviorSubject<string>('');
  deliveryFormMode$ = new BehaviorSubject<string>('');

  // Date variables
  d = new Date();
  currMonth = this.d.getMonth() + 1;
  currYear = this.d.getFullYear();
  // AcademicYear: any = this.getAcademicYear();

  supURL = 'https://krkaevxowysjoxjeecdk.supabase.co';
  custcd = '4ca0462a-b63a-4d37-9166-fa813eb1630d';

  private readonly supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  //testing simple observable returns object with multiple values
  // called in app.components
  myfunc(): BehaviorSubject<any> {
    this.testSubject$.next({
      name: 'Irfan',
      age: 50,
    });

    return this.testSubject$.value;
  }

  getAcademicYear() {
    if (this.currMonth > 3) {
      const academicyear = `${this.currYear}-${this.currYear + 1}`;
      return academicyear;
    } else {
      const academicyear = `${this.currYear - 1}-${this.currYear}`;
      return academicyear;
    }
  }

  // Following functions are written using javascript function expression method
  // Function expression and regular function are almost similler except that function expression
  // support anonymos function (function without any name)

  // LocalGymKey code
  getLocalGymkey = async () => {
    const { value } = await Preferences.get({ key: 'egymkey' });
    this.localgymkey.next(`${value}`);
    return value;
  };

  setLocalGymkey = async (gymkey: any) => {
    await Preferences.set({
      key: 'egymkey',
      value: gymkey,
    });
  };

  removeLocalGymkey = async () => {
    await Preferences.remove({ key: 'egymkey' });
  };

  //Local GymName code
  getLocalGymName = async () => {
    const { value } = await Preferences.get({ key: 'egymname' });
    this.localgymname.next(`${value}`);
    // return this.localgymname.value;
    return value;
  };

  setLocalGymname = async (gymname: any) => {
    await Preferences.set({
      key: 'egymname',
      value: gymname,
    });
  };

  removeLocalGymname = async () => {
    await Preferences.remove({ key: 'egymname' });
  };

  // Localcustomerkey
  getLocalcustomerKey = async () => {
    const { value } = await Preferences.get({ key: 'ecustomerkey' });
    this.localcustomerkey.next(`${value}`);
    return value;
  };

  setLocalcustomerkey = async (customerkey: any) => {
    await Preferences.set({
      key: 'ecustomerkey',
      value: customerkey,
    });
  };

  removeLocalcustomerkey = async () => {
    await Preferences.remove({ key: 'ecustomerkey' });
  };

  // Local customerShortName
  getLocalcustomername = async () => {
    const { value } = await Preferences.get({ key: 'ecustomername' });
    this.localcustomername.next(`${value}`);
    return value;
  };

  setLocalcustomername = async (customername: any) => {
    console.log('customername=', customername);
    await Preferences.set({
      key: 'ecustomername',
      value: customername,
    });
  };

  removeLocalcustomername = async () => {
    await Preferences.remove({ key: 'ecustomername' });
  };

  // Using supabase query
  async getcustomerInfo(): Promise<Observable<any>> {
    const { value } = await Preferences.get({ key: 'ecustomerkey' });
    this.localcustomerkey.next(`${value}`);

    // async getCustomerProfile(): Promise<Observable<customerProfileInterface[]>> {
    const gymcode = this.currgymid.value;

    const DATA_TABLE = 'fm_customer_profile_view';
    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: this.localcustomerkey.value,
      });

    // return customerprofile.data || [];

    if (data?.length) {
      this.allCustomerView$.next(data);
      // console.log('custmst data in service=', this.allCustomerView$.value);
    } else {
      console.log('Error found', error);
      // console.log('cart status in service=', status);
      // return error;
      this.allCustomerView$.next(error);
    }

    return this.allCustomerView$.value;
  }

  // Using httpclient
  // getcustomerInfo() {
  //   // let custid = '629e3e64-adf4-4165-9b4f-6acff1967dfe';
  //   // const myvariable = '629e3e64-adf4 - 4165 - 9b4f - 6acff1967dfe';

  //   let params = new HttpParams().set(
  //     'apikey',
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya2Fldnhvd3lzam94amVlY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUzMTM3ODIsImV4cCI6MTk4MDg4OTc4Mn0.2UcxrIdRtj0JctkTf8F7UD_4sMRwqk2dW3PnEeaNOFY'
  //   );

  //   let url = this.supURL + '/rest/v1/fm_customer_profile_view?select=*';
  //   // let url = this.supURL + '/rest/v1/fm_allcustomers_details_view?select=*';
  //   // '/rest/v1/fm_allcustomers_details_view?customer_id=eq.629e3e64-adf4-4165-9b4f-6acff1967dfe&select=*';
  //   // let url = this.supURL + '/rest/v1/fm_customer_detail_view?select=*';
  //   // let url = this.supURL + '/rest/v1/fm_allcustomers_details_view?select=*';

  //   //      '/rest/v1/fm_customer_detail_view?customer_id=eq.629e3e64-adf4-4165-9b4f-6acff1967dfe&select=*';
  //   // let url = this.supURL + '/rest/v1/fm_customer_detail_view?select=*';
  //   // let url = this.supURL + '/rest/v1/fm_customer_mst?select=*';
  //   // '/rest/v1/fm_customer_mst?id=eq.1&select=*'
  //   return this.http.get(url, { params });
  // }

  // async getSeletedCustomerInfo() {
  //   this.getcustomerInfo().subscribe((allcustdata: any) => {
  //     this.selectedCustDetails$.next(allcustdata);
  //     // for (let i = 0; i < allcustdata.length; i++) {
  //     //   customerdata = allcustdata[i].customer_id;
  //     // }
  //     // console.log('selected customer=', this.selectedCustDetails$.value);
  //     return this.selectedCustDetails$.value;
  //   });
  // }

  // async getSeletedCustomerInfo(custid: any) {
  //   this.getcustomerInfo().subscribe((allcustdata: any) => {
  //     console.log('selected custdata=', allcustdata);
  //     return allcustdata;
  //   });
  // }

  // async getcustomerInfo(customerkey: any) {
  //   const gymcode = 'fm';
  //   const DATA_TABLE = `${gymcode}_allcustomers_details_view`;

  //   const { data, error, status } = await this.supabase
  //     .from(DATA_TABLE)
  //     .select()
  //     .match({
  //       customer_id: customerkey,
  //     });
  //   if (data?.length) {
  //     // console.log('cart data in service=', data);
  //     // console.log('cart status in service=', status);
  //     // return data || [];
  //     this.customerInfo$.next(data);
  //   } else {
  //     console.log('cart error from service=', error);
  //     // console.log('cart status in service=', status);
  //     this.customerInfo$.next(error);
  //   }
  // }

  async customerDefaultShippAddress() {
    const customerkey = this.localcustomerkey.value;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: customerkey,
        address_type: 'Home',
      })
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      // return data || {};
      this.custdeliveryaddress$.next(data);
    } else {
      console.log('cart error from service=', error);
      // console.log('cart status in service=', status);
      // return error;
      this.custdeliveryaddress$.next(error);
    }
  }

  async deliveryAddressByCustomer() {
    const customerkey = this.localcustomerkey.value;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: customerkey,
      })
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      // return data || {};
      this.custdeliveryaddress$.next(data);
    } else {
      console.log('cart error from service=', error);
      // console.log('cart status in service=', status);
      // return error;
      this.custdeliveryaddress$.next(error);
    }
  }
  async getCustomerDeliveryAddress(addresstype: any) {
    console.log('from service add type=', addresstype);
    this.selectedDelAddType$.next(addresstype);

    const customerkey = this.localcustomerkey.value;

    const gymcode = 'fm';

    const DATA_TABLE = `${gymcode}_customer_delivery_address`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .match({
        customer_id: customerkey,
        address_type: addresstype,
      })
      .throwOnError();

    if (data?.length) {
      // console.log('cart data inserted success msg from service=', data);
      //  console.log('cart status in service=', status);
      // return data || {};
      this.custdeliveryaddress$.next(data);
      console.log('from service=', this.custdeliveryaddress$.value);
    } else {
      console.log('cart error from service=', error);
      // console.log('cart status in service=', status);
      // return error;
      this.custdeliveryaddress$.next(error);
    }
  }
}
