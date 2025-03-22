import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupCustomerService } from 'src/app/services/sup.customer.service';

@Component({
  selector: 'app-customermstform',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './customermstform.component.html',
  styleUrl: './customermstform.component.scss',
})
export class CustomermstformComponent implements OnInit {
  formMode: string | undefined;
  custMstForm: FormGroup;

  customermst: any;

  // customercode: any;

  constructor(
    private fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly custservice: SupCustomerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,

    public readonly loader: LoaderService
  ) {
    this.custMstForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.formMode = this.auth.custFormMode$.value;
    this.custMstFormInit();
    // this.loadCustMstData();

    this.customermst = this.custservice.customermst$.value;

    console.log('custmstdata=', this.customermst);
    if (this.formMode === 'Edit') {
      this.setFormValue();
    } else {
      this.custMstFormInit();
    }
  }

  // customer_id uuid not null default uuid_generate_v4 (),
  // customer_name text null,
  // reg_mobileno text not null,
  // reg_email text null,
  // mobile_verified boolean null,
  // email_verified boolean null,
  // curr_gymid text not null,
  // account_status text not null,
  // inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
  // updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  // update_by text null default 'customer_id'::text,
  // shortname text not null,
  // totalcartitems numeric null,
  // totalsaveditems numeric null,
  // customer_panno text null,
  // alternatephone text null,
  custMstFormInit() {
    this.custMstForm = this.fb.group({
      customer_id: [''],
      customer_name: ['', [Validators.required]],
      shortname: ['', [Validators.required]],
      reg_mobileno: ['', [Validators.required]],
      reg_email: ['', [Validators.email]],
      mobile_verified: [false, [Validators.required]],
      email_verified: [false],
      curr_gymid: ['', [Validators.required]],
      account_status: ['', [Validators.required]],
      totalcartitems: [0, [Validators.required]],
      totalsaveditems: [0],
      customer_panno: [''],
      alternatephone: [''],
    });
  }

  // async loadCustMstData() {
  //   this.customermst = await this.customerservice
  //     .getCustomerMstData()
  //     .then((resp: any) => {
  //       return this.customerservice.customermst$.value;
  //     });
  // }
  setFormValue() {
    console.log('form status=', this.formMode);

    this.customermst = this.custservice.customermst$.value;

    this.custMstForm.patchValue({
      customer_id: this.customermst[0].customer_id,
      customer_name: this.customermst[0].customer_name,
      customer_panno: this.customermst[0].customer_panno,
      shortname: this.customermst[0].shortname,
      curr_gymid: this.customermst[0].curr_gymid,
      reg_mobileno: this.customermst[0].reg_mobileno,
      reg_email: this.customermst[0].reg_email,
      mobile_verified: this.customermst[0].mobile_verified,
      email_verified: this.customermst[0].email_verified,
      account_status: this.customermst[0].account_status,
      alternatephone: this.customermst[0].alternatephone,
    });

    this.loader.isLoading.next(true);

    this.loader.isLoading.next(false);
  }

  saveCustMst(formvalue: any) {
    if (
      this.custMstForm.get('customer_id')?.value === '' ||
      this.custMstForm.get('customer_id')?.value === null ||
      this.custMstForm.get('customer_id')?.value === undefined
    ) {
      // console.log('insert succes=', this.custMstForm?.value);
      const custmsttemArray = {
        customer_id: this.auth.localcustomerkey.value,
        customer_name: this.custMstForm.get('customer_name')?.value,
        customer_panno: this.custMstForm.get('customer_panno')?.value,
        shortname: this.custMstForm.get('shortname')?.value,
        curr_gymid: this.custMstForm.get('curr_gymid')?.value,
        reg_mobileno: this.custMstForm.get('reg_mobileno')?.value,
        reg_email: this.custMstForm.get('reg_email')?.value,
        mobile_verified: this.custMstForm.get('mobile_verified')?.value,
        email_verified: this.custMstForm.get('email_verified')?.value,
        account_status: this.custMstForm.get('account_status')?.value,
        alternatephone: this.custMstForm.get('alternatephone')?.value,
      };
      // console.log('addre array in compo=', custmsttemArray);
      this.loader.isLoading.next(true);
      this.custservice
        .insCustomerBillingAddress(custmsttemArray)
        .then((resp: any) => {
          console.log('insert success!', resp);
          this.router.navigate(['../profile'], { relativeTo: this.route });
        });
      //   this.supstudent.insertStudent(formvalue);
      //   this.loader.isLoading.next(false);
    } else {
      // console.log('editing mode =', formvalue);
      this.custservice.editCustomerMst(formvalue).then((resp: any) => {
        // console.log('edit success!', resp);
        this.router.navigate(['../profile'], { relativeTo: this.route });
      });
    }
  }
}
