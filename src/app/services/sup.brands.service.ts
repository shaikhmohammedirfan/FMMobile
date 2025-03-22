import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupBrandsService {
  private readonly supabase: SupabaseClient;

  // totalBrands or count(*)
  totalBrands = new BehaviorSubject<number>(0);

  // current fromRecord and toRecord variables for data range
  fromRecord = new BehaviorSubject<any>(0);
  toRecord = new BehaviorSubject<any>(4);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }
  async getAllBrands(): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_brand_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .throwOnError();

    if (data?.length) {
      //    console.log('brandmst status in service=', status);
      return data || [];
    } else {
      console.log('brandmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
    return data || [];
  }

  async getTopBrands(): Promise<any> {
    const trendingno = 5;
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_brand_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .lte('trending', trendingno)
      .throwOnError();

    if (data?.length) {
      //  console.log('brand data in service=', data);
      // console.log('brand  status in service=', status);
      return data || [];
    } else {
      console.log('brandmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }

  async getBrandsByRange(fromRecord: number, toRecord: number): Promise<any> {
    const gymcode = 'fm';
    const DATA_TABLE = `${gymcode}_brand_mst`;

    const { data, error, status } = await this.supabase
      .from(DATA_TABLE)
      .select()
      .range(fromRecord, toRecord)
      .throwOnError();

    if (data?.length) {
      // console.log('brand data in service=', data);
      console.log('brand  status in service=', status);
      return data || [];
    } else {
      console.log('brandmst error from service=', error);
      console.log('status in service=', status);
      return error;
    }
  }
}
