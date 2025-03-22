import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupMemberService {
  private readonly supabase: SupabaseClient;
  constructor(private readonly auth: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getMemberDetails(memberkey: string): Promise<any> {
    // console.log(this.auth.currgymid.value);

    const gymcode = this.auth.currgymid.value;
    // const loggedinuser = this.authservice.currlogin.value;

    const DATA_TABLE = `${gymcode}_customer_mst`;

    const memberdetails = await this.supabase
      .from(DATA_TABLE)
      .select()
      .eq('customer_id', memberkey);
    // console.log(gymdetails.data);
    return memberdetails.data || [];

    // const { data, status, error } = await this.supabase
    //   .from(DATA_TABLE)
    //   .select()
    //   .eq('customer_id', memberkey)
    //   .throwOnError();

    // if (data?.length) {
    //   console.log('data in service=', data);
    //   console.log('status in service=', status);
    //   return data || [];
    // } else {
    //   console.log('data error in service=', error);
    //   console.log('status in service=', status);
    //   return error || [];
    // }
    // // console.log(memberDetails.data);
    // return data || [];
  }
}
