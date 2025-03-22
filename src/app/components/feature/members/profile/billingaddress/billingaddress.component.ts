import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupCustomerService } from 'src/app/services/sup.customer.service';

@Component({
  selector: 'app-billingaddress',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './billingaddress.component.html',
  styleUrl: './billingaddress.component.scss',
})
export class BillingaddressComponent implements OnInit {
  custbilladdress: any;
  constructor(
    public readonly loader: LoaderService,
    private readonly custservice: SupCustomerService,
    private auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // this.custbilladdress = this.custservice.custbillingaddress$.value;
    // this.loadBillingAddress();

    this.custbilladdress = this.custservice.custbillingaddress$.value;
    console.log(
      'customer billing address under billingcompo=',
      this.custbilladdress
    );
  }

  // loadBillingAddress() {
  //   this.loader.isLoading.next(true);

  //   this.custservice.getCustomerBillingAddress().then(async (resp: any) => {
  //     this.custbilladdress = await this.custservice.customerProfile$.value;
  //     console.log('customer billing address=', this.custbilladdress);
  //     if (!this.custbilladdress) {
  //       this.auth.billFormMode$.next('Insert');
  //       this.router.navigate(['/billform'], { relativeTo: this.route });
  //     } else {
  //       this.auth.billFormMode$.next('Edit');
  //     }
  //   });
  //   this.loader.isLoading.next(false);
  // }
  editDeliveryAddress() {
    this.auth.billFormMode$.next('Edit');
    this.router.navigate(['/billform'], { relativeTo: this.route });
  }
  addNewAddress() {
    // throw new Error('Method not implemented.');
  }
}
