import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { MatCardModule } from '@angular/material/card';
import { SupCartsService } from 'src/app/services/sup.carts.service';
import { AuthService } from 'src/app/services/auth.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SupSaveditemsService } from 'src/app/services/sup.saveditems.service';
import { productinterface } from 'src/app/interfaces/product.interface';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-cartcard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    // MatSnackbarModule not imported
    // here in component as it is defined in main.ts provider list
  ],
  templateUrl: './cartcard.component.html',
  styleUrls: ['./cartcard.component.scss'],
})
export class CartcardComponent implements OnInit {
  @Input() cartArray: any;

  cartlist: any[] = [];
  cartdata: any[] = [];

  constructor(
    private readonly prodservice: SupProductsService,
    public readonly cartservice: SupCartsService,
    private readonly saveitemservice: SupSaveditemsService,
    private readonly auth: AuthService,
    public loader: LoaderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loader.isLoading.next(true);
    // console.log('cartlist value=', this.cartArray);
    this.cartlist = this.cartservice.cartDetails.value;
    // console.log('cartlist value=', this.cartlist);
    this.loader.isLoading.next(false);

    if (this.cartArray) {
      this.cartArray.forEach((element: any) => {
        // this.cartdata.push(element[0]);
        // this.cartdata[0].productid = element.cart_productid;
        // console.log('cartdata to push=', element);

        this.cartdata.push([
          {
            ...element[0],
          },
        ]);

        // console.log('productid in compo=', this.cartdata);
      });
    }

    // console.log('productid=', this.cartdata);

    // for (let i = 0; i < this.cartArray.length; i++) {
    //   this.cartlist.push(this.cartArray[i]);
    // }
    // console.log('cartlist=', this.cartlist);
    // this.cartArray.forEach((element: any) => {
    //   this.cartlist = [...this.cartArray];
    //   console.log('cartlist=', this.cartlist);
    // });
  }

  async addQty(cartitem: any, ev: any) {
    ev.stopPropagation();
    // update cartmaster

    this.cartservice.addQty(cartitem).then((resp: any) => {
      if (resp.length > 0) {
        this.snackbar.showNotification(
          'Item added successfully',
          'Ok',
          'success'
        );
        // Reload page after qty got added
        this.router.navigate(['/cart']).then(() => {
          window.location.reload();
        });
      }
    });
  }

  async decreaseQty(cartitem: any, ev: any) {
    ev.stopPropagation();

    cartitem.forEach((element: any) => {
      if (element.cart_product_qty <= 1) {
        console.log('item removed==.', cartitem);
        this.cartservice.removeCartItem(cartitem).then((itemdeleted: any) => {
          if (itemdeleted.length > 0) {
            this.snackbar.showNotification(
              'Item deleted successfully',
              'Ok',
              'error'
            );
            // Reload page after qty got added
            this.router.navigate(['/cart']).then(() => {
              window.location.reload();
            });
          }
        });
      } else {
        this.cartservice.decreaseQty(cartitem).then((resp: any) => {
          this.snackbar.showNotification(
            'Item deleted successfully',
            'Ok',
            'error'
          );
          // Reload page after qty got added
          this.router.navigate(['/cart']).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }

  save4later(selecteditem: any, ev: any) {
    //console.log('saved itedm=', selecteditem);

    ev.stopPropagation();

    this.snackbar.showNotification('Insert Success', 'OK', 'info');
    // this.auth.totalcartitems.next(selecteditem);

    // update cart item count
    this.auth.getcustomerInfo().then((customerdata: any) => {
      customerdata.forEach((element: any) => {
        this.auth.totalcartitems.next(element.cartcount);
        // Reload page after qty got added
        this.router.navigate(['/cart']).then(() => {
          window.location.reload();
        });
      });
    });

    this.saveitemservice
      .sendMsgToSaveItemSuject(selecteditem)
      .then((resp: any) => {
        //   console.log('afte save insert', resp);
      });
    // // window.location.reload();

    this.router.navigate(['/cart'], { relativeTo: this.route });
  }

  move2cart(item: any) {
    console.log('Move to cart', item);
  }

  delItem(product: productinterface, ev: any) {
    // console.log('item to deltete=', product);
    ev.stopPropagation();
    // window.location.reload();

    // Remove selected cartitem from Db
    this.cartservice.removeCartItem(product);

    // Check if transaction is successfull
    this.cartservice.delCartItem$.subscribe((resp: any[]) => {
      //   console.log('after dele', this.cartservice.delCartItem$.value);
      if (resp === null) {
        // alert('Error found!...Item not added to cart!');
        this.snackbar.showNotification(
          'Error found!...Item not removed!',
          'OK',
          'error'
        );
      } else if (resp.length > 0) {
        //Refresh/get latest cardata from Db
        this.getCartData(resp);

        // Add new item to totalcartitem variable in app component
        this.updateCartItemList();

        window.location.reload();

        this.router.navigate(['/cart'], { relativeTo: this.route });
      }
    });

    //update current status of cart items after deletion
    // this.auth.getMemberInfo().subscribe((memberdata: any) => {
    //  // console.log('Memmber data=', memberdata);
    //   memberdata.forEach((element: any) => {
    //     this.auth.totalcartitems.next(element.totalcartitems);
    //     this.auth.totalsaveditems.next(element.totalsaveditems);

    //    // console.log('total cartitems=', this.auth.totalcartitems.value);
    //   });
    // });
  }

  async updateCartItemList() {
    this.auth.getcustomerInfo().then((customerdata: any) => {
      customerdata.forEach((element: any) => {
        this.auth.totalcartitems.next(element.cartcount);
      });
    });
  }

  async getCartData(cartitem: any) {
    try {
      await this.cartservice.loadCardDataFromDb();
      this.cartservice.cartData$.subscribe((cartdata) => {
        cartdata.forEach((element: any) => {
          cartitem.push([{ ...element }]);
        });
        //this.cartdatalength = this.cartItems.length;
        //console.log('cart data from DB=', this.cartItems);
      });

      // update order details variable
      this.cartservice.orderDetails.next(cartitem);

      // update cart totals
      this.auth.totalcartitems.next(cartitem.cartcount);
      this.auth.totalsaveditems.next(cartitem.cartcount);
      console.log('cartitems total now=', cartitem);
      this.cartservice.getCartTotals(cartitem);

      console.log(
        'order details after deletioon=',
        this.cartservice.orderDetails.value
      );
    } catch (error) {}
  }

  prodDetails(product: productinterface, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    this.prodservice.prodDetails.next(product);
    this.router.navigate(['/prodDetails'], { relativeTo: this.route });
  }
}
