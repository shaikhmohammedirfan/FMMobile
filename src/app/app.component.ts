import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';

import { LoaderService } from './services/loader.service';
import { SupCartsService } from './services/sup.carts.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { SupCustomerService } from './services/sup.customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatProgressBarModule,
    NgFor,
    NgIf,
    AsyncPipe,
    RouterLink,
    NgOptimizedImage,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  title = 'Mobile App';
  currUserName: any;

  public appPages = [
    {
      title: 'Home',
      url: '/',
      icon: 'home',
    },

    // {
    //   title: 'Registeration',
    //   url: 'registration',
    //   icon: 'person_add',
    // },

    {
      title: 'News',
      url: '/news',
      icon: 'business',
    },
    {
      title: 'Messages',
      url: '/messageslist',
      icon: 'message',
    },
    {
      title: 'Help',
      url: '/help',
      icon: 'help',
    },
    {
      title: 'Contact Us',
      url: '/contact',
      icon: 'contact_phone',
    },
    {
      title: 'SignIn Options',
      url: 'loginoptions',
      icon: 'person',
    },
  ];

  constructor(
    public readonly auth: AuthService,

    private readonly cartservice: SupCartsService,
    private readonly custservice: SupCustomerService
  ) {}

  ngOnInit(): void {
    // initialize function
    // const aa = this.auth.myfunc();

    // console.log(aa);
    // // or
    // console.log('otehr way to get value', this.auth.testSubject$.value);

    //Get and Set local member name and key from local storage of app

    // member info obtained from fm_member_details_view
    //     account_status
    // :
    // "basic"
    // curr_gymid
    // :
    // "fm"
    // email
    // :
    // "abc@abc.com"
    // member_id
    // :
    // "9501fea6-f4d8-402a-b0c8-6e3aeeca17e5"
    // member_name
    // :
    // "Shaikh Mohammed Irfan"
    // mobile_no
    // :
    // "+918722499762"
    // mobile_verified
    // :
    // true
    // shortname
    // :
    // "Irfan"
    // totalcartitems
    // :
    // 2
    // console.log('TESTTTTING=', this.custservice.custbillingaddress$.value);
    this.loadCustomerView();

    this.auth.getcustomerInfo().then((customerdata: any) => {
      // console.log(this.auth.localcustomerkey.value);
      // console.log('all customer info data in component=', customerdata);
      // this.auth.customerInfo$.subscribe((customerdata: any) => {
      customerdata.forEach((element: any) => {
        this.auth.totalcartitems.next(element.cartcount);
        this.auth.totalsaveditems.next(element.cartcount);

        if (element.customer_id === this.auth.localcustomerkey.value) {
          console.log('local Customer data in appcomp==', element);

          this.auth.totalcartitems.next(element.cartcount);
          this.auth.totalsaveditems.next(element.cartcount);
        }

        // console.log('total cartitems=', this.auth.totalcartitems.value);
      });
    });

    // console.log(
    //   'selected customer in component=',
    //   this.auth.getSeletedCustomerInfo(c)
    // );

    this.getLocalCustomerName();

    this.getLocalCustomerKey();

    this.getLocalGymKey();

    // get cart details for localmember
  }

  loadCustomerView() {
    this.auth.getcustomerInfo().then((resp: any) => {
      console.log('DATA IN COMPO=', this.auth.allCustomerView$.value);
    });
  }
  getLocalCustomerName() {
    this.auth.getLocalcustomername().then((resp) => {
      this.auth.localcustomername.next(resp);

      this.currUserName = this.auth.localcustomername.value;
    });
  }
  getLocalCustomerKey() {
    this.auth.getLocalcustomerKey().then((resp: any) => {
      //   this.auth.localcustomerkey.next(resp);
      console.log(this.auth.localcustomerkey.value);
    });
  }

  getLocalGymKey() {
    this.auth.getLocalGymkey().then((resp: any) => {
      this.auth.currgymid.next(resp);
    });
  }
}
