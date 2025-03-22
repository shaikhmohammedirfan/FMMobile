import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SupCustomerService } from 'src/app/services/sup.customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-deliveryform',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './deliveryform.component.html',
  styleUrl: './deliveryform.component.scss',
})
export class DeliveryformComponent implements OnInit {
  deliveryform: FormGroup;
  custdeliveryaddress: any;
  formMode: string | undefined;
  customerkey: any;

  constructor(
    private fb: FormBuilder,
    private readonly custservice: SupCustomerService,
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly loader: LoaderService,
    private snackbar: SnackbarService
  ) {
    this.deliveryform = this.fb.group({});
  }
  ngOnInit(): void {
    this.formMode = this.auth.deliveryFormMode$.value;
    this.deliveryFormInit();

    // this.custdeliveryaddress = this.custservice.custdeliveryaddresses$.value;
    // console.log('customer delivery address=', this.custdeliveryaddress);

    if (this.formMode === 'Edit') {
      this.setFormValue();
    } else {
      this.deliveryFormInit();
    }
  }

  deliveryFormInit() {
    this.deliveryform = this.fb.group({
      customer_id: [''],
      address_type: [''],
      address_id: [''],
      area_street: ['', [Validators.required]],
      landmark: [''],
      city_dist: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      default_del_address: [''],
    });
  }

  setFormValue(): void {
    // console.log('form status=', this.formMode);
    this.custdeliveryaddress = this.custservice.custdeliveryaddresses$.value;

    // console.log('customer delivery addresw22s=', this.custdeliveryaddress);
    // this.customercode = this.custbilladdress;
    //  console.log('customer code e=', this.custdeliveryaddress.customer_id);

    this.deliveryform.patchValue({
      customer_id: this.custdeliveryaddress.customer_id,
      // customer_name: this.custdeliveryaddress[0].customer_name,
      // customer_panno: this.custdeliveryaddress[0].customer_panno,
      address_type: this.custdeliveryaddress.del_addr_type,
      address_id: this.custdeliveryaddress.del_addr_id,
      area_street: this.custdeliveryaddress.del_addr_area_street,
      landmark: this.custdeliveryaddress.del_addr_landmark,
      city_dist: this.custdeliveryaddress.del_addr_city_dist,
      state: this.custdeliveryaddress.del_addr_state,
      pincode: this.custdeliveryaddress.del_addr_pincode,
      country: this.custdeliveryaddress.del_addr_country,
      default_del_address: this.custdeliveryaddress.default_del_address,
      // reg_mobileno: this.custdeliveryaddress[0].reg_mobileno,
      // reg_email: this.custdeliveryaddress[0].reg_email,
    });

    this.loader.isLoading.next(true);
    // this.supstudent.editStudent(studentmaster).then((editData) => {
    //   // console.log('edit data return', editData);
    // });
    this.loader.isLoading.next(false);
    //   this.router.navigate(['/school'], { relativeTo: this.route });
  }

  // loadDeliveryAddress() {
  // Get local customer delivery address selected by user in previous step
  // To get all delivery address related to local customer
  // this.custservice.getCustomerDeliveryAddresses().then((resp: any) => {
  //   this.custdeliveryaddress = this.custservice.custdeliveryaddresses$.value;
  //   console.log('customer delivery address=', this.custdeliveryaddress);
  // });
  // }
  saveDeliveryAddress(formvalue: any) {
    this.auth.getLocalcustomerKey().then(async (resp: any) => {
      // console.log('local customer key=', this.auth.localcustomerkey.value);
      this.customerkey = resp;
    });
    const addressItemArray = {
      customer_id: this.customerkey,
      address_type: this.deliveryform.get('address_type')?.value,
      address_id: this.deliveryform.get('address_id')?.value,
      area_street: this.deliveryform.get('area_street')?.value,
      landmark: this.deliveryform.get('landmark')?.value,
      city_dist: this.deliveryform.get('city_dist')?.value,
      state: this.deliveryform.get('state')?.value,
      pincode: this.deliveryform.get('pincode')?.value,
      country: this.deliveryform.get('country')?.value,
      default_del_address: this.deliveryform.get('default_del_address')?.value,
    };

    console.log('EDIT FORM VALUE=', addressItemArray);

    if (
      this.deliveryform.get('customer_id')?.value === '' ||
      this.deliveryform.get('customer_id')?.value === null ||
      this.deliveryform.get('customer_id')?.value === undefined
    ) {
      console.log('insert mode ON..', this.deliveryform?.value);
      this.loader.isLoading.next(true);
      this.custservice
        .insCustomerDeliveryAddress(addressItemArray)
        .then((resp: any) => {
          console.log('insert success!', resp);

          this.snackbar.showNotification(
            `Insert Successfully`,
            'OK',
            'success'
          );
          // this.snackbar.showNotification(
          //   'Error found!...Item not added to cart!',
          //   'OK',
          //   'error'
          // );
          this.router.navigate(['../profile'], { relativeTo: this.route });
        });
    } else {
      this.custservice
        .editCustomerDeliveryAddress(addressItemArray)
        .then((resp: any) => {
          console.log('edit success!', resp);
          this.snackbar.showNotification(`Edit Successfully`, 'OK', 'success');
          this.router.navigate(['../profile'], { relativeTo: this.route });
        });
    }
  }

  closeForm(ev: any): void {
    ev.stopPropagation();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
