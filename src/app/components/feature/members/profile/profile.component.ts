import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { member_mst } from 'src/app/interfaces/member.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SupMemberService } from 'src/app/services/sup.member.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SupCustomerService } from 'src/app/services/sup.customer.service';
import { BillformComponent } from './billform/billform.component';
import { DeliveryformComponent } from './deliveryform/deliveryform.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingaddressComponent } from './billingaddress/billingaddress.component';
import { CustomermstComponent } from './customermst/customermst.component';
import { CustomermstformComponent } from './customermstform/customermstform.component';
import { DeliveryaddressComponent } from './deliveryaddress/deliveryaddress.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressBarModule,
    BillformComponent,
    DeliveryformComponent,
    DeliveryaddressComponent,
    BillingaddressComponent,
    CustomermstComponent,
    CustomermstformComponent,
  ],
})
export class ProfileComponent implements OnInit {
  @ViewChild(MatAccordion)
  public formmode = '';
  openForm = false;
  accordion!: MatAccordion;
  customer: any;

  custbilladdress: any;
  custdeliveryaddresses: any;

  constructor(
    public readonly auth: AuthService,
    private readonly customerservice: SupCustomerService,
    public readonly loader: LoaderService,

    private fb: UntypedFormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('form mode=', this.auth.billFormMode$.value);
    this.loader.isLoading.next(true);
    this.loadCustomerView();
    // this.loadBillingAddress();
    // this.loadDeliveryAddresses();
    this.loader.isLoading.next(false);
  }

  loadCustomerView() {
    this.loader.isLoading.next(true);
    this.customerservice.getCustomerProfile().then((resp: any) => {
      const customerarray = this.customerservice.allCustomerView$.value;

      if (customerarray) {
        //   // this.customermst = [{ ...customerarray }];
        //   // console.log('cust mst=', this.customermst);
        //   // Save related data to global variables

        this.customer = [{ ...customerarray[0] }];
        //   console.log('customer in compo=', this.customer);
        //
        this.customerservice.customermst$.next(this.customer);

        console.log(
          'customer mst data',
          this.customerservice.customermst$.value
        );
        this.customerservice.custbillingaddress$.next(this.customer);
        console.log(
          'customer bill address=',
          this.customerservice.custbillingaddress$.value
        );

        //
        this.customerservice.custdeliveryaddresses$.next(customerarray);
        console.log(
          'customer delivery address=',
          this.customerservice.custbillingaddress$.value
        );
        //   this.customer = this.custservice.customermst$.value;
        //   this.custbilladdress = this.custservice.custbillingaddress$.value;
        //   this.custdeliveryaddresses =
        //     this.customerservice.custdeliveryaddresses$.value;
      } else {
        this.customer = this.customerservice.allCustomerView$.value;
      }

      // this.customer = [{ ...customerarray }];
      // this.custservice.customerProfile$.next(this.customer);
      // console.log('customer after=', this.customer);

      // this.customer = this.customerservice.customerProfile$.value;
      // console.log('customer mst data', this.customer);

      if (!this.customer) {
        this.auth.custFormMode$.next('Insert');
      } else {
        this.auth.custFormMode$.next('Edit');
      }
    });

    // this.customerservice.getCustomerMstData().then((resp: any) => {
    //   this.customer = this.customerservice.customermst$.value;
    //   console.log('customer mst data', this.customer);

    //   if (!this.customer) {
    //     this.auth.custFormMode$.next('Insert');
    //   } else {
    //     this.auth.custFormMode$.next('Edit');
    //   }
    // });
    this.loader.isLoading.next(false);
  }

  loadDeliveryAddresses() {
    this.loader.isLoading.next(true);
    this.customerservice
      .getCustomerDeliveryAddresses()
      .then(async (resp: any) => {
        // this.custdeliveryaddresses = await this.custservice.custdeliveryaddresses$
        //   .value;

        this.custdeliveryaddresses = await this.customerservice
          .custdeliveryaddresses$.value;

        console.log('customer delivery address=', this.custdeliveryaddresses);
        if (!this.custdeliveryaddresses) {
          this.auth.deliveryFormMode$.next('insert');
          this.router.navigate(['/deliveryform'], { relativeTo: this.route });
        } else {
          this.auth.deliveryFormMode$.next('Edit');
        }
      });
    this.loader.isLoading.next(false);
  }
}
