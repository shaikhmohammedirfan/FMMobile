import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupGymService {
  private readonly supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getGymDetails(gymkey: string): Promise<any> {
    const gymdetails = await this.supabase
      .from('gym_master')
      .select()
      .eq('gymid', gymkey);
    // console.log(gymdetails.data);
    return gymdetails.data || [];
  }
}
