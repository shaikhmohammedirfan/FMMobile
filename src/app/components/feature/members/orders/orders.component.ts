import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { SupCartsService } from 'src/app/services/sup.carts.service';
import { CartcardComponent } from '../cart/cartcard/cartcard.component';
import { CarttotalComponent } from '../cart/carttotal/carttotal.component';
import { SaveforlaterComponent } from '../cart/saveforlater/saveforlater.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SupOrderService } from 'src/app/services/sup.so.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from 'src/app/services/auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  imports: [
    CommonModule,
    CartcardComponent,
    CarttotalComponent,
    SaveforlaterComponent,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class OrdersComponent implements OnInit {
  orderlist: any[] = [];
  orderqty: any;
  billingaddress: any;
  shippingaddress: any;
  customerkey: any;

  constructor(
    private readonly cartservice: SupCartsService,
    private readonly orderservice: SupOrderService,
    public readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // this.authservice.getCustomerBillingAddress().then((billaddress: any) => {
    //   this.billingaddress = this.authservice.custbillingaddress$.value;
    // });

    // console.log('addres type=', this.auth.selectedDelAddType$.value);
    this.auth
      .getCustomerDeliveryAddress(this.auth.selectedDelAddType$.value)
      .then((shipaddress: any) => {
        this.shippingaddress = this.auth.custdeliveryaddress$.value;
        console.log(
          'delivery address selected from order=',
          this.shippingaddress
        );
      });

    this.orderlist = this.cartservice.orderDetails.value;
    // console.log('order details=', this.orderlist);

    if (this.orderlist === null) {
      this.orderqty = 0;
    } else {
      this.orderqty = this.orderlist.length;
    }
  }

  continueShopping() {
    this.router.navigate(['/allproducts'], { relativeTo: this.route });
  }

  changeLogin() {
    this.router.navigate(['/gymlogin'], { relativeTo: this.route });
  }

  changeAddress() {
    this.router.navigate(['/addresslist'], { relativeTo: this.route });
  }
  async applyCoupon() {
    console.log('Coupon applied', this.cartservice.cartnettotal.value);
  }
  async confirmOrder() {
    // Get customers last order no from db
    this.orderservice
      .custLastOrdNo(this.auth.localcustomerkey.value)
      .then((orderno: any) => {
        orderno.forEach((element: any) => {
          // console.log('LAST ORDER NO', element['cust_order_no'] + 1);
          this.orderservice.custLastOrdNo$.next(element['cust_order_no'] + 1);
        });
      });

    // get customer details stored in variable when system loaded
    this.orderservice.soMst$.next(this.auth.allCustomerView$.value);
    this.orderservice.orderDetails$.next(this.orderlist);

    // this.orderservice.insOrderMst();
    // this.orderservice.orderInsSubject$.subscribe((resp: any) => {
    //   if (resp) {
    //     resp.forEach((element: any) => {
    //       // console.log('orderMstData', element.order_id);
    //       this.orderservice.insOrdDetails(element.order_id);
    //     });
    //   }
    // });

    this.router.navigate(['/payments'], { relativeTo: this.route });

    // this.orderservice.orderInsSubject$.subscribe((ordermstdata: any) => {
    //   if (ordermstdata) {
    //     console.log('after ordermaster insert', ordermstdata);
    //     this.orderservice.insOrdDetails(ordermstdata).then((orderdata: any) => {
    //       this.orderservice.ordDetailsInsSubject$.subscribe(
    //         (orderdetails: any) => {
    //           if (orderdetails) {
    //             this.snackbar.showNotification(
    //               'Order Confirmed',
    //               'Ok',
    //               'success'
    //             );
    //             this.router.navigate(['/payments'], { relativeTo: this.route });
    //           }
    //         }
    //       );
    //     });
    //   }
    // });
    // this.router.navigate(['/orders'], { relativeTo: this.route });
  }
}
