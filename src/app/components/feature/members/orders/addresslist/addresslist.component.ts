import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-addresslist',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './addresslist.component.html',
  styleUrls: ['./addresslist.component.scss'],
})
export class AddresslistComponent implements OnInit {
  addresslist: any[] = [];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.auth.deliveryAddressByCustomer().then((data: any) => {
      this.addresslist = this.auth.custdeliveryaddress$.value;
      console.log('delivery addr list', this.addresslist);
    });
  }
  addressSelected(selectedAdd: any) {
    // this.custdeliveryaddress$.next(data);
    this.auth.selectedDelAddType$.next(selectedAdd);
    const currDelAddSelected = this.auth.selectedDelAddType$.value;
    console.log('addresstype', currDelAddSelected);

    // selectedAdd.forEach((element: any) => {
    //   console.log('element', element.address_type);
    // });
    this.auth
      .getCustomerDeliveryAddress(currDelAddSelected)
      .then((resp: any) => {
        console.log(
          'current cust delivery address=',
          this.auth.custdeliveryaddress$.value
        );
      });
    this.auth.custdeliveryaddress$.next(selectedAdd);
    // this.auth.selectedDelAddType$.next()
    // console.log('curr add selected=', this.auth.custdeliveryaddress$.value);
    this.router.navigate(['/orders'], { relativeTo: this.route });
  }

  editAddress(address: any) {
    console.log('address to edit', address);
    this.router.navigate(['/deliveryform'], { relativeTo: this.route });
  }
  addNewAddress() {
    this.auth.billFormMode$.next('Insert');
    this.router.navigate(['/deliveryform'], { relativeTo: this.route });
  }
}
