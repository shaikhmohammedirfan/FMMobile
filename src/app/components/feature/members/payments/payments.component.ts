import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarttotalComponent } from '../cart/carttotal/carttotal.component';
import { SupOrderService } from 'src/app/services/sup.so.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, CarttotalComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  constructor(private supordservice: SupOrderService) {}

  ngOnInit(): void {
    // public.fm_so_mst (
    //   order_id uuid not null default uuid_generate_v4 (),
    //   order_date timestamp with time zone not null default timezone ('utc'::text, now()),
    //   customer_id uuid not null,
    //   order_amount numeric not null,
    //   order_status text not null default 'pending'::text,
    //   payment_method text not null default 'COD'::text,
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
    //   del_add_id text null,
    //   constraint fm_so_mst_pkey primary key (order_id),
    //   constraint fm_so_mst_customer_id_fkey foreign key (customer_id) references fm_customer_mst (customer_id)
    // ) tablespace pg_default;
  }
  cod() {
    this.supordservice.pmtMethod$.next('COD');
    this.saveOrder();
  }
  saveOrder() {
    console.log('orderMstData', this.supordservice.soMst$.value);

    this.supordservice.insOrderMst().then((resp: any) => {
      if (resp) {
        console.log('Order success');
      }
    });
  }
}
