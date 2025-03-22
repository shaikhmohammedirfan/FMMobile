import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { customerProfileInterface } from 'src/app/interfaces/customer.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/services/auth.service';
import { SupCustomerService } from 'src/app/services/sup.customer.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-billform',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './billform.component.html',
  styleUrl: './billform.component.scss',
})
export class BillformComponent implements OnInit {
  @Input() formMode: string | undefined;

  billingform: FormGroup;
  custbilladdress: any;

  customercode: any;

  constructor(
    private fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly custservice: SupCustomerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly loader: LoaderService,
    private readonly snackbar: SnackbarService
  ) {
    this.billingform = this.fb.group({});
  }
  ngOnInit(): void {
    this.formMode = this.auth.billFormMode$.value;
    this.billingFormInit();

    if (this.formMode === 'Edit') {
      this.setFormValue();
    } else {
      this.billingFormInit();
    }
  }

  billingFormInit() {
    // console.log('formMode now=', this.formMode);
    this.custbilladdress = this.custservice.custbillingaddress$.value;
    // console.log('customer initial blll address=', this.custbilladdress);

    this.billingform = this.fb.group({
      customer_id: [''],
      // customer_name: ['', [Validators.required]],
      // customer_panno: [''],
      area_street: ['', [Validators.required]],
      landmark: [''],
      city_dist: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      // reg_mobileno: ['', [Validators.required]],
      // reg_email: ['', [Validators.email]],
      // inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
      // updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
      // update_by text not null,
    });
  }

  loadBillingAddress() {
    this.custbilladdress = this.custservice.custbillingaddress$.value;

    //   this.custservice.getCustomerBillingAddress().then((resp: any) => {
    //     this.custbilladdress = this.custservice.custbillingaddress$.value;
    //     console.log('customer billing address=', this.custbilladdress);
    //   });
  }
  saveBillingAddress(formvalue: any) {
    console.log('formMode now=', this.formMode);
    console.log('insert success!', formvalue);

    // console.log('insert success!', formvalue.controls.customer_name.value);

    // let propertyNames = Object.keys(formvalue).map((element: any) => {
    //   console.log(element.customer_name);
    // });

    // console.log(propertyNames);

    // const trytry = propertyNames.map((item: any) => {
    //   return {
    //     customer_id: item.customer_id,
    //   };
    // });

    // console.log('trytry=', trytry);
    const addressItemArray = {
      customer_id: this.billingform.get('customer_id')?.value,
      // customer_panno: this.billingform.get('customer_panno')?.value,
      // customer_name: this.billingform.get('customer_name')?.value,
      area_street: this.billingform.get('area_street')?.value,
      landmark: this.billingform.get('landmark')?.value,
      city_dist: this.billingform.get('city_dist')?.value,
      state: this.billingform.get('state')?.value,
      pincode: this.billingform.get('pincode')?.value,
      country: this.billingform.get('country')?.value,
    };
    console.log(
      'customer id in billing form=',
      this.billingform.get('customer_id')?.value
    );
    if (
      this.billingform.get('customer_id')?.value === '' ||
      this.billingform.get('customer_id')?.value === null ||
      this.billingform.get('customer_id')?.value === undefined
    ) {
      console.log('insert mode ON..', this.billingform?.value);

      // console.log('addre array in compo=', addressItemArray);
      this.loader.isLoading.next(true);
      this.custservice
        .insCustomerBillingAddress(addressItemArray)
        .then((resp: any) => {
          console.log('insert success!', resp);
          this.snackbar.showNotification(
            `Insert Successfully`,
            'OK',
            'success'
          );
          this.router.navigate(['../profile'], { relativeTo: this.route });
        });
      //   this.supstudent.insertStudent(formvalue);
      this.loader.isLoading.next(false);
    } else {
      console.log('editing mode =', formvalue);
      this.custservice
        .editCustomerBillingAddress(addressItemArray)
        .then((resp: any) => {
          console.log('edit success!', resp);
          this.snackbar.showNotification(`Edit Successfully`, 'OK', 'success');
          this.router.navigate(['../profile'], { relativeTo: this.route });
        });
      // }
      // firebase/firestore db code
      // if (this.studentcode === null || this.studentcode === undefined) {
      //   console.log('insrt mode', this.studentcode);
      //   const newStudent = this.studentService.createStudent(formvalue);
      //   console.log(newStudent);
      //   this.router.navigate(['/school']);
      // } else {
      //   console.log('editing mode =', this.formediting);
      //   this.studentService.updateStudent(formvalue, this.studentcode);
      //   // this.apiservice.editPackage(this.packageform.value, this.packagecode);
      //   this.router.navigate(['/school']);
    }
  }

  setFormValue(): void {
    console.log('form status=', this.formMode);

    this.custbilladdress = this.custservice.custbillingaddress$.value;

    console.log('customer billing addresw22s=', this.custbilladdress[0]);
    this.customercode = this.custbilladdress;
    console.log('customer code e=', this.custbilladdress[0].customer_id);

    this.billingform.patchValue({
      customer_id: this.custbilladdress[0].customer_id,
      // customer_name: this.custbilladdress[0].bill_addr_customer_name,
      // customer_panno: this.custbilladdress[0].bill_addr_customer_panno,
      area_street: this.custbilladdress[0].bill_addr_area_street,
      landmark: this.custbilladdress[0].bill_addr_landmark,
      city_dist: this.custbilladdress[0].bill_addr_city_dist,
      state: this.custbilladdress[0].bill_addr_state,
      pincode: this.custbilladdress[0].bill_addr_pincode,
      country: this.custbilladdress[0].bill_addr_country,
      // reg_mobileno: this.custbilladdress[0].bill_addr_reg_mobileno,
      // reg_email: this.custbilladdress[0].bill_addr_reg_email,
    });

    this.loader.isLoading.next(true);
    // this.supstudent.editStudent(studentmaster).then((editData) => {
    //   // console.log('edit data return', editData);
    // });
    this.loader.isLoading.next(false);
    //   this.router.navigate(['/school'], { relativeTo: this.route });
  }
}
