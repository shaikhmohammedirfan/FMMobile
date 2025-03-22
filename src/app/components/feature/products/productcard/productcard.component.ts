import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { productinterface } from 'src/app/interfaces/product.interface';

import { SupCartsService } from 'src/app/services/sup.carts.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { SortbottomsheetComponent } from '../sortbottomsheet/sortbottomsheet.component';
import { FilterbottomsheetComponent } from '../filterbottomsheet/filterbottomsheet.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import config from 'capacitor.config';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-productcard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './productcard.component.html',
  styleUrls: ['./productcard.component.scss'],
})
export class ProductcardComponent implements OnInit {
  @Input() prodsarray: any;

  sortbasicoption: string = '';

  result: any;

  // prodsarray: any[] = [];
  prodList: any[] = [];

  constructor(
    private readonly prodservice: SupProductsService,
    private readonly cartservice: SupCartsService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    public readonly dialog: MatDialog,
    public loader: LoaderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // console.log('cardetails now=', this.prodsarray);
  }

  prodDetails(product: productinterface, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    this.prodservice.prodDetails.next(product);
    this.router.navigate(['/prodDetails'], { relativeTo: this.route });
  }

  addToCart(product: any, ev: any): void {
    ev.stopPropagation();

    // send currently added item to cartSubject variable in service
    this.cartservice.cartInsSubject$.next(product);

    // insert newly added item to db
    this.cartservice.insCartItem(product);

    // Check if transaction is successfull
    this.cartservice.cartInsSubject$.subscribe((resp: any[]) => {
      if (resp === null) {
        // alert('Error found!...Item not added to cart!');
        this.snackbar.showNotification(
          'Error found!...Item not added to cart!',
          'OK',
          'error'
        );
      } else if (resp.length > 0) {
        //Refresh/get latest cardata from Db
        this.getCartData(resp).then((resp: any) => {
          // Reload page after qty got added
          this.router.navigate(['/cart']).then(() => {
            window.location.reload();
          });
        });

        // Add new item to totalcartitem variable in app component
        this.updateCartItemList();
      }
    });
    // Get latest product list from Db
    this.refreshProductList();

    this.router.navigate(['/cart'], { relativeTo: this.route });

    // dialog page is causing some issue
    // this.dialog
    //   .open(ConfirmationDialogComponent)
    //   .afterClosed()
    //   .subscribe((res) => {
    //     if (res === 'go2cart') {
    //       // Refresh product list
    //       this.refreshProductArray();
    //       this.router.navigate(['/cart'], { relativeTo: this.route });
    //     } else {
    //       // Refresh product list
    //       // not req as control fall back to same screen/same record from where started
    //       this.refreshProductArray();
    //       this.router.navigate(['/allproducts'], {
    //         relativeTo: this.route,
    //       });
    //     }
    //   });
  }
  // this.cartservice
  //   .getMsgFromCartSubject()
  //   .subscribe(async (prod2Add: any) => {
  //     // insert item to db
  //     this.cartservice.insCartItem(prod2Add);

  //     this.cartservice.cartInsSubject.subscribe((resp: any) => {
  //       console.log('length of resp=', resp);
  //       if (resp === null) {
  //         alert('Error found!...Item not added to cart!');
  //       } else if (resp.length > 0) {
  //         // update totalcartitem variable

  //         this.auth.totalcartitems.next(prod2Add);

  //         this.auth.getcustomerInfo().subscribe((customerdata: any) => {
  //           // console.log('Memmber data=', customerdata);
  //           customerdata.forEach((element: any) => {
  //             this.auth.totalcartitems.next(element.totalcartitems);
  //             this.auth.totalsaveditems.next(element.totalsaveditems);

  //             console.log('total cartitems=', this.auth.totalcartitems.value);
  //           });
  //         });

  //         // this.auth.totalcartitems.subscribe((totalcartitems: any) => {
  //         //   console.log('add to cart product details=', totalcartitems);
  //         // });

  //         // display dialog to select option
  //         this.dialog
  //           .open(ConfirmationDialogComponent)
  //           .afterClosed()
  //           .subscribe((res) => {
  //             if (res === 'go2cart') {
  //               this.router.navigate(['/cart'], { relativeTo: this.route });
  //             } else {
  //               console.log(
  //                 'products in products compo now='
  //                 // this.prodservice.productsByRange$.value
  //               );
  //               this.router.navigate(['/allproducts'], {
  //                 relativeTo: this.route,
  //               });
  //             }
  //           });
  //       }
  //     });

  // });

  async updateCartItemList() {
    this.auth.getcustomerInfo().then((customerdata: any) => {
      customerdata.forEach((element: any) => {
        //  console.log('CART COUNT===', element.cartcount);
        this.auth.totalcartitems.next(element.cartcount);
        this.auth.totalsaveditems.next(element.totalsaveditems);
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
      this.cartservice.getCartTotals(cartitem);
    } catch (error) {}
  }

  async refreshProductList() {
    this.loader.isLoading.next(true);
    // console.log('from=', this.prodservice.fromRecord.value);
    // console.log('to=', this.prodservice.toRecord.value);
    // console.log('productsarray=', this.prodsarray);
    // console.log('this.productsArray=', this.prodsarray);

    //Reset initial values of variables
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);
    this.prodsarray = [];
    this.prodList = [];

    await this.prodservice
      .getProdsByRange(
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      )
      .then((resp) => {
        this.prodList = this.prodservice.prodListByRange$.value;
        // append/create new array prodsarray from prodList array
        this.prodList.forEach((element) => {
          this.prodsarray.push([{ ...element }]);
        });

        // console.log('from after=', this.prodservice.fromRecord.value);
        // console.log('to after=', this.prodservice.toRecord.value);
        // console.log('productsarray after=', this.prodsarray);
        // console.log('this.prodsList after=', this.prodList);
      });

    // console.log('prodList value after=', this.prodsarray);

    // this.prodservice.fromRecord.next(0);
    // this.prodservice.toRecord.next(4);

    // console.log('from=', this.prodservice.fromRecord.value);
    // console.log('to=', this.prodservice.toRecord.value);

    // const resp = await this.prodservice.getProdsByRange(
    //   this.prodservice.fromRecord.value,
    //   this.prodservice.toRecord.value
    // );

    // this.prodList = this.prodservice.prodListByRange$.value;

    // // append/create new array prodsarray from prodList array
    // this.productsArray = [];

    // this.prodList.forEach((element) => {
    //   this.productsArray.push([{ ...element }]);
    // });

    this.loader.isLoading.next(false);
  }

  addQty(product: any, ev: any) {
    ev.stopPropagation();
    this.cartservice.addQty(product).then((resp: any) => {
      console.log('add qty resp=', resp);
      this.router.navigate(['/cart'], { relativeTo: this.route });
    });
  }
  delQty(product: any, ev: any) {
    ev.stopPropagation();
  }
  addToWishList(product: productinterface, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    // alert(`${product.productname} added to wishlist`);
    this.snackbar.showNotification(
      `${product.productname} added to wishlist`,
      'OK',
      'success'
    );
    // change icon heart color representing its already added to wishlist
  }

  goToBrandPage(brand: string, ev: any) {
    ev.stopPropagation();
    // console.log(brand);
    this.prodservice.brandSelected.next(brand);
    this.router.navigate(['/brandpage'], { relativeTo: this.route });
  }
  onDetails(product: any) {}
  onEdit(product: any) {}

  search() {
    this.prodsarray = ['', ''];
  }

  // Sort
  dynamicSort(property: any): any {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      const result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
  sort(): void {
    // alert('sort');
    this._bottomSheet.open(SortbottomsheetComponent);
    this.prodsarray[0].sort(this.dynamicSort('productname'));
  }

  filter(): void {
    this._bottomSheet.open(FilterbottomsheetComponent);
  }
}
