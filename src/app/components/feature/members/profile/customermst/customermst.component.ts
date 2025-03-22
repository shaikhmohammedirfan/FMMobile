import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupCustomerService } from 'src/app/services/sup.customer.service';

@Component({
  selector: 'app-customermst',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './customermst.component.html',
  styleUrl: './customermst.component.scss',
})
export class CustomermstComponent implements OnInit {
  customermst: any;
  constructor(
    private readonly custservice: SupCustomerService,
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.customermst = this.custservice.customermst$.value;
    // this.loadCustMstData();
    console.log('customer mst dataaa initially==', this.customermst);
  }

  async loadCustMstData() {
    // const customerarray = this.custservice.customerProfile$.value;
    // // console.log('customer array=', customerarray);
    // customerarray.forEach((element: any) => {
    //   let address1 = element.del_addr_type?.trim();
    //   let address2 = element.default_del_address?.trim();
    //   // console.log('DEFAULT ADDRESS=', address2);
    //   // console.log(' ADDRESssS type=', address1);
    //   if (customerarray.length > 1) {
    //     console.log('2 records found');
    //     // this.customermst = [{ ...customerarray }];
    //     // console.log('cust mst=', this.customermst);
    //   } else {
    //     console.log('1 record found...');
    //   }
    // });
    // console.log('DEFAULT ADDRESS=', this.customermst);
    // this.customermst = await this.customerservice
    //   .getCustomerProfile()
    //   .then((resp: any) => {
    //     this.customerservice.customerProfile$.value.forEach((element: any) => {
    //       this.customermst = element;
    //       console.log('customer mstttt data=', this.customermst);
    //     });
    //   });
  }
  editCustomerMst() {
    this.auth.custFormMode$.next('Edit');
    this.router.navigate(['/custmstform'], { relativeTo: this.route });
  }
}
