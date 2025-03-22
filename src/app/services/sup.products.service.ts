import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupProductsService {
  private readonly supabase: SupabaseClient;

  prodListByRange$ = new BehaviorSubject<any>(null);
  prodsByCategory$ = new BehaviorSubject<any>(null);
  prodsByBrand$ = new BehaviorSubject<any>(null);
  categoryList$ = new BehaviorSubject<any>(null);
  selectedProdBrand$ = new BehaviorSubject<string>('');
  selectedProdCategory$ = new BehaviorSubject<string>('');

  // totalProducts or count(*)
  // totalProds = new BehaviorSubject<number>(0);

  // totalProducts on offer
  totalProdsOnOffer = new BehaviorSubject<number>(0);

  // to hold all products (5 only)
  // allProducts = new Subject();

  // to hold products by range
  // productsByRange$ = new BehaviorSubject<any>(null);
  // to hold selected product details
  prodDetails = new BehaviorSubject<any>(null);

  // selected brand
  brandSelected = new BehaviorSubject<any>(null);

  // current fromRecord and toRecord variables for data range
  fromRecord = new BehaviorSubject<any>(0);
  toRecord = new BehaviorSubject<any>(4);

  constructor(private readonly auth: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllProductsCount(): Promise<any> {
    // const gymcode = this.auth.currgymid.value;
    // here gymcode will be our own brand products

    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .throwOnError();
    return data?.length;
  }

  async getAllProductObs(): Promise<Observable<any>> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_mst`;

    const { data, error, status } = await this.supabase.from(DATA_TABLE)
      .select(`
      *,
      fm_cart_mst (cart_productid,
        cart_product_qty)
      `);

    const obsdata = from(data || []);
    return obsdata;
  }

  // async getAllProducts(): Promise<any> {
  //   // const gymcode = this.auth.currgymid.value;
  //   // here gymcode will be our own brand products

  //   const gymcode = 'fm';
  //   const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

  //   const { data, error, status } = await this.supabase
  //     .from(DATA_TABLE)
  //     .select()
  //     .throwOnError();

  //   // const DATA_TABLE = `${gymcode}_product_mst`;

  //   // const { data, error, status } = await this.supabase.from(DATA_TABLE)
  //   //   .select(`
  //   //   *,
  //   //   fm_cart_mst (cart_productid,
  //   //     cart_product_qty)
  //   //   `);

  //   if (data?.length) {
  //     // console.log('productmst data in service=', data);
  //     // console.log('productmst status in service=', status);
  //     // return data || [];
  //     this.allProducts.next(data);
  //   } else {
  //     console.log('productmst error from service=', error);
  //     console.log('status in service=', status);
  //     // return error;
  //     this.allProducts.next(error);
  //   }
  // }

  async getAllDeals() {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('onoffer', true)
      .throwOnError();

    if (data?.length) {
      // console.log('productmst data in service=', data);
      // console.log('productmst status in service=', status);
      return data || [];
    } else {
      console.log('productmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }
  async getAllHotDeals(offerpct: number) {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('onoffer', true)
      .gte('offerpercentage', offerpct)
      .throwOnError();

    if (data?.length) {
      // console.log('productmst data in service=', data);
      // console.log('productmst status in service=', status);
      return data || [];
    } else {
      console.log('productmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }

  async getAllOnOfferProds() {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('onoffer', true)
      .throwOnError();

    if (data?.length) {
      console.log('productmst status in service=', status);
      return data || [];
    } else {
      console.log('productmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }
  async getAllOnOfferProdsByRange(fromRecord: number, toRecord: number) {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)
      .eq('onoffer', true)
      .order('productname', { ascending: true })
      .throwOnError();

    if (data?.length) {
      console.log('productmst status in service=', status);
      return data || [];
    } else {
      console.log('productmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }

  async getProdsByRange(fromRecord: number, toRecord: number) {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)
      .order('productname', { ascending: true })
      .throwOnError();

    // return product list to observable
    if (data?.length) {
      // console.log('productmst and qty data in service=', data);
      console.log('productmst status in service=', status);
      // return data || [];

      this.prodListByRange$.next(data);
      console.log('in service data=', this.prodListByRange$.value);
    } else {
      console.log('productmst error from service=', error);
      console.log('status in service=', status);
      // return error;
      this.prodListByRange$.next(error);
    }
  }
  // async getProdsByRange(fromRecord: number, toRecord: number) {
  //   const gymcode = 'fm';
  //   const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

  //   const { data, error, status } = await this.supabase
  //     .from(DATA_TABLE)
  //     .select()
  //     .range(fromRecord, toRecord)
  //     .order('productname', { ascending: true })
  //     .throwOnError();

  //   if (data?.length) {
  //     // console.log('productmst and qty data in service=', data);
  //     console.log('productmst status in service=', status);
  //     // return data || [];
  //     this.productsByRange$.next(data);
  //   } else {
  //     console.log('productmst error from service=', error);
  //     console.log('status in service=', status);
  //     // return error;
  //     this.productsByRange$.next(error);
  //   }
  //   // return data || [];
  // }

  // Categories related code

  async getAllCategories() {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_category_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .throwOnError();

    if (data?.length) {
      // console.log('category data in service=', data);

      return data || [];
    } else {
      console.log('productmst error from service=', error);

      return error;
    }
    return data || [];
  }

  async getCategoriesByRange(fromRecord: number, toRecord: number) {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_category_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)

      .throwOnError();

    // return product list to observable
    if (data?.length) {
      // console.log('productmst and qty data in service=', data);
      //console.log('productmst status in service=', status);
      // return data || [];

      this.categoryList$.next(data);
      console.log('in service data=', this.prodListByRange$.value);
    } else {
      console.log('status in service=', status);
      // return error;
      this.categoryList$.next(error);
    }
  }

  async getAllCategoriesCount(): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_category_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .throwOnError();
    return data?.length;
  }

  async getAllProdsByCategoryCount(category: string): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('productcategory1', category)
      .throwOnError();
    console.log('allprodsbycategories service=', data?.length);
    return data?.length;
  }

  async getAllProdsByRangeByCategory(
    category: string,
    fromRecord: number,
    toRecord: number
  ): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)
      .order('productname', { ascending: true })
      .eq('productcategory1', category)
      .throwOnError();

    if (data?.length) {
      this.prodsByCategory$.next(data);

      console.log('productmst data in service=', this.prodsByCategory$.value);
      // return this.prodsByCategory$.value();
    } else {
      this.prodsByCategory$.next(data);
      console.log('productmst error from service=', error);

      //return error;
    }
  }
  // Brands related code
  async getAllProdsByBrandCount(brand: string): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('mfgname', brand)
      .throwOnError();
    // console.log('allprodsbybrand in service=', data?.length);
    return data?.length;
  }

  async getAllProdsByRangeByBrand(
    brand: string,
    fromRecord: number,
    toRecord: number
  ): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_product_cart_mst_view`;

    console.log('brand in service=', brand);

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)
      .order('productname', { ascending: true })
      .eq('mfgname', brand)
      .throwOnError();

    if (data?.length) {
      this.prodsByBrand$.next(data);
      console.log('prods by brand in service=', data);

      // return this.prodsByCategory$.value();
    } else {
      console.log('productmst error from service=', error);
      this.prodsByBrand$.next(data);
      // console.log('productmst data in service=', this.prodsByBrand$.value);
      // return error;
    }
  }

  // async getAllProdsByBrand(brand: string): Promise<any> {
  //   const gymcode = 'fm';
  //   const DATA_TABLE = `${gymcode}_product_mst`;

  //   const { data, error, status } = await this.supabase
  //     .from(DATA_TABLE)
  //     .select()
  //     .eq('mfgname', brand)
  //     .throwOnError();

  //   if (data?.length) {
  //     // console.log('productmst data in service=', data);
  //     console.log('productmst status in service=', status);
  //     return data || [];
  //   } else {
  //     console.log('productmst error from service=', error);
  //     console.log('status in service=', status);
  //     return error;
  //   }
  //   return data || [];
  // }
}
