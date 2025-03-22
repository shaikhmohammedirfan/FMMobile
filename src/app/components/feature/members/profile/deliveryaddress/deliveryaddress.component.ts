import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupCustomerService } from 'src/app/services/sup.customer.service';

@Component({
  selector: 'app-deliveryaddress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule],
  templateUrl: './deliveryaddress.component.html',
  styleUrl: './deliveryaddress.component.scss',
})
export class DeliveryaddressComponent implements OnInit {
  deliveryaddresses: any;
  constructor(
    private readonly custservice: SupCustomerService,
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.deliveryaddresses = this.customerservice.custdeliveryaddresses$.value;
    this.deliveryaddresses = this.custservice.custdeliveryaddresses$.value;
    console.log(
      'customer delivery address under delivery compo=',
      this.deliveryaddresses
    );
  }
  editDeliveryAddress(addressid: any) {
    console.log('address id=', addressid);
    this.auth.deliveryFormMode$.next('Edit');

    const findAddressId = this.deliveryaddresses.find(function (val: any) {
      return val.del_addr_id.includes(addressid);
    });
    console.log('findSarah', findAddressId);
    this.custservice.custdeliveryaddresses$.next(findAddressId);

    this.router.navigate(['/deliveryform'], { relativeTo: this.route });
  }

  addressSelected(selectedAdd: any) {
    console.log('addresstype', selectedAdd);
    this.auth.selectedDelAddType$.next(selectedAdd);
    // selectedAdd.forEach((element: any) => {
    //   console.log('element', element.address_type);
    // });
    this.auth.custdeliveryaddress$.next(selectedAdd);
    // this.auth.selectedDelAddType$.next()
    // console.log('curr add selected=', this.auth.custdeliveryaddress$.value);
    this.router.navigate(['/orders'], { relativeTo: this.route });
  }

  addNewAddress() {
    this.auth.deliveryFormMode$.next('Insert');
    this.router.navigate(['/deliveryform'], { relativeTo: this.route });
  }
}
