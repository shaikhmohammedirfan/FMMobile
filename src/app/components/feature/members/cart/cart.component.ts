import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { SupCartsService } from 'src/app/services/sup.carts.service';
import { CartcardComponent } from './cartcard/cartcard.component';
import { CarttotalComponent } from './carttotal/carttotal.component';
import { productinterface } from 'src/app/interfaces/product.interface';
import { SaveforlaterComponent } from './saveforlater/saveforlater.component';
import {
  ActivatedRoute,
  Router,
  provideRouter,
  withViewTransitions,
} from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SupSaveditemsService } from 'src/app/services/sup.saveditems.service';
import { SavedcardComponent } from './savedcard/savedcard.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    NgIf,
    CartcardComponent,
    SavedcardComponent,
    CarttotalComponent,
    SaveforlaterComponent,
    MatProgressBarModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  customerkey: any;
  cartdata: any = [];
  cartdatalength: number = 0;
  saveddatalength: number = 0;

  cartItems: any = [];
  emptycontainer: boolean = false;

  savedItems: any = [];

  mrptotal = 0;
  currtotal = 0;
  discounttotal = 0;
  deleveryfee = 0;
  savingtotal = 0;
  netamount = 0;

  constructor(
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly cartservice: SupCartsService,
    private readonly saveditemservice: SupSaveditemsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log('cart status=', this.emptycontainer);

    this.loader.isLoading.next(true);
    this.getCartData();

    this.getSavedItemsData();
    // this.getSavedItemDetails(this.auth.getLocalcustomerKey);
    this.loader.isLoading.next(false);
  }

  async getCartData() {
    try {
      await this.cartservice.loadCardDataFromDb();
      this.cartservice.cartData$.subscribe((cartdata) => {
        cartdata.forEach((element: any) => {
          this.cartItems.push([{ ...element }]);
        });
        this.cartdatalength = this.cartItems.length;
        // console.log('cart data from DB=', this.cartdatalength);
      });
      this.cartservice.getCartTotals(this.cartItems);
      this.cartservice.orderDetails.next(this.cartItems);
    } catch (error) {}
  }

  async getSavedItemsData() {
    let resp = await this.auth.getLocalcustomerKey();
    this.customerkey = resp;
    console.log('saved data in compooonent=', this.customerkey);
    this.saveditemservice
      .getSavedItemsBycustomer(this.customerkey)
      .then((resp: any) => {
        console.log('savedlater data in compooo=', resp);
        resp.forEach((element: any) => {
          this.savedItems.push([{ ...element }]);
        });
        this.saveddatalength = this.savedItems.length;
        console.log('saved data from DB=', this.saveddatalength);
      });
  }
  // async getCartData() {
  //   try {
  //     let resp = await this.auth.getLocalcustomerKey();
  //     this.customerkey = resp;

  //     // Get existing Cart details from db
  //     this.getCartDetails(this.customerkey);

  //     this.loader.isLoading.next(true);

  //     // Add current cart item to
  //     this.supservice.cartSubject.subscribe((product: any) => {
  //       // this.cartItems.push({
  //       //   ...product[0],
  //       // });

  //       console.log(
  //         'cartItems from db plus curr add2cart item value=',
  //         this.cartItems
  //       );
  //       this.loader.isLoading.next(false);

  //       this.getCartTotals();
  //     });
  //   } catch (error) {
  //     console.log('error message from cartdata', error);
  //   }
  // }

  // addProductToCart(product: any, ev: any) {
  //   ev.stopPropagation();
  //   alert('add2cart');
  //   this.cartservice.sendMsgToCartSuject(product);

  //   if ('popup to select y/n to go to cart or continue shopping') {
  //     // if yes, to to cart
  //     // use '/' to move from any parent or child route to cart page
  //     this.router.navigate(['/cart'], { relativeTo: this.route });
  //   } else {
  //     // refresh page with newly added item to cart, stay on same page
  //     // all deals page or all product page
  //   }

  //   // this.cartdata.push([
  //   //   {
  //   //     productid: product.productid,
  //   //     productname: product.productname,
  //   //     currentprice: product.currentprice,
  //   //     mrp: product.mrp,
  //   //     cart_product_qty: product.cart_product_qty + 1,
  //   //     seller: product.mfgname,
  //   //     producturl: product.imageurl,
  //   //   },
  //   // ]);
  //   // // console.log('inside cart=', this.cartdata);
  //   // this.getCartTotals(this.cartdata);
  // }

  // async getCartDetails(customerkey: string) {
  //   try {
  //     this.loader.isLoading.next(true);

  //     let resp = await this.supservice.getCartItemsBycustomer(this.customerkey);

  //     // store extracted cartdata from db to cartDetails subject variable
  //     this.supservice.cartDetails.next([...resp]);

  //     // Save above cartdata on local cartdata variable cartItems
  //     this.cartItems = this.supservice.cartDetails.value;

  //     console.log('cartItem length rcvd from db=', this.cartItems.length);

  //     if ((resp = 0 || resp == null || undefined)) {
  //       this.emptycontainer = true;
  //     }

  //     console.log('cart status now=', this.emptycontainer);

  //     this.loader.isLoading.next(false);
  //     this.getCartTotals();
  //   } catch (error) {}
  // }

  // getCartTotals() {
  //   // Convert all previous value to zero
  //   this.mrptotal = 0;
  //   this.currtotal = 0;
  //   this.discounttotal = 0;
  //   this.deleveryfee = 0;
  //   this.savingtotal = 0;
  //   this.netamount = 0;

  //   this.cartItems.forEach((product: any) => {
  //     // console.log(
  //     //   'carttotal',
  //     //   this.mrptotal + product.mrp * product.cart_product_qty
  //     // );

  //     // cart totals
  //     this.mrptotal = this.mrptotal + product.mrp * product.cart_product_qty;
  //     this.supservice.cartmrptotal.next(this.mrptotal);

  //     this.currtotal =
  //       this.currtotal + product.currentprice * product.cart_product_qty;
  //     this.supservice.cartcurrtotal.next(this.currtotal);

  //     this.discounttotal = this.mrptotal - this.currtotal;
  //     this.supservice.cartdiscounttotal.next(this.discounttotal);

  //     this.savingtotal = this.discounttotal;
  //     this.supservice.cartsavingtotal.next(this.savingtotal);
  //   });

  //   // Delivery Fee Calculation
  //   if (this.currtotal >= 1000) {
  //     this.deleveryfee = 0;
  //     this.supservice.cartdeliveryfee.next(this.deleveryfee);
  //     this.netamount = this.currtotal + this.deleveryfee;
  //     this.supservice.cartnettotal.next(this.netamount);
  //   } else {
  //     this.deleveryfee = 50;
  //     this.supservice.cartdeliveryfee.next(this.deleveryfee);
  //     this.netamount = this.currtotal + this.deleveryfee;
  //     this.supservice.cartnettotal.next(this.netamount);
  //   }

  //   // console.log(
  //   //   `totals= ${this.mrptotal},  ${this.supservice.cartsavingtotal.value}`
  //   // );
  // }

  continueShopping() {
    this.router.navigate(['/allproducts'], { relativeTo: this.route });
    // provideRouter( '/allproducts', withViewTransitions);
  }

  placeOrder() {
    // console.log('order details in cart cfomp=', this.cartItems);
    this.cartservice.orderDetails.next(this.cartItems);
    this.auth.selectedDelAddType$.next('Home');
    this.router.navigate(['/orders'], { relativeTo: this.route });
  }

  //   async getSavedItemDetails(customerkey: any) {
  //     try {
  //       this.loader.isLoading.next(true);

  //       let resp = await this.saveditemservice.getSavedItemsBycustomer(
  //         this.customerkey
  //       );
  //       this.loader.isLoading.next(false);
  //       // set subject variable value equal to data extracted from db
  //       this.saveditemservice.savedItemsDetails.next([...resp]);
  //       this.savedItems = this.saveditemservice.savedItemsDetails.value;

  //       // console.log('savedItem value=', this.savedItems);
  //     } catch (error) {}
  //   }
}
