import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductcardComponent } from '../productcard/productcard.component';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-productsonoffer',
  standalone: true,
  imports: [CommonModule, ProductcardComponent, MatProgressBarModule],
  templateUrl: './productsonoffer.component.html',
  styleUrls: ['./productsonoffer.component.scss'],
})
export class ProductsonofferComponent implements OnInit {
  allprods: any[] = [];
  offeredprods: any[] = [];
  recordCounts = true;
  totalProdsOnOffer: any;

  constructor(
    private readonly prodservice: SupProductsService,
    public readonly loader: LoaderService,
    private snackbar: SnackbarService
  ) {}
  async ngOnInit(): Promise<void> {
    // To get data from supabase server
    this.loader.isLoading.next(true);

    // total no. of records/products on offer in table

    await this.prodservice
      .getAllOnOfferProds()
      .then((resp: any) => {
        this.totalProdsOnOffer = resp.length;
      })
      .catch((error: any) => {
        console.log('catch error.....', error);
      });
    // total no. of records in table
    // this.totalProds = this.prodservice.totalProducts.value;

    // this.prodservice.totalProducts.next(
    //   (await this.prodservice.getAllProducts()).length
    // );

    // total records on offer
    this.prodservice.getAllDeals().then((resp: any) => {
      this.recordCounts = resp.length;
    });

    this.prodservice.getAllDeals().then((resp: any) => {
      this.allprods = resp;

      this.allprods.forEach((element: any) => {
        this.offeredprods.push([
          {
            ...element,
          },
        ]);
      });
      // console.log('offered prodsss=', this.offeredprods);
    });

    // TO PUSH INDIVIDUAL ITEM, INCASE YOU WANT TO CHANGE ORIGINAL VALUE OF element.variable to NEW VALUE (eg: total= element.a + element.b)
    // this.allprods.forEach((element: any) => {
    //   this.offeredprods.push([
    //     {
    //       imageurl: element.imageurl,
    //       productname: element.productname,
    //       mfgname: element.mfgname,
    //       currentprice: element.currentprice,
    //       mrp: element.mrp,
    //       qty: element.cart_product_qty,
    //     },
    //   ]);
    //});

    this.loader.isLoading.next(false);
    // this.supservice.getAllProducts().then((resp) => {
    //   // console.log(resp);
    //   this.offeredprods = resp;
    //   // To get data from supabase server
    //   this.loader.isLoading.next(false);
    // });
  }
  async moreRecords() {
    await this.prodservice.getAllOnOfferProds().then((resp: any) => {
      this.totalProdsOnOffer = resp.length;
    });

    if (
      this.prodservice.toRecord.value >= 4 &&
      this.prodservice.toRecord.value <= this.totalProdsOnOffer
    ) {
      this.prodservice.fromRecord.next(this.prodservice.fromRecord.value + 5);
      this.prodservice.toRecord.next(this.prodservice.toRecord.value + 5);
      this.loader.isLoading.next(true);

      await this.prodservice
        .getAllOnOfferProdsByRange(
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.allprods = resp;
          this.loader.isLoading.next(false);
          //pushing value to new list
          if (this.allprods === null) {
            // alert('No More Products Found...');
            this.snackbar.showNotification(
              'No More Products Found...',
              'Ok',
              'info'
            );
            this.recordCounts = false;
          } else {
            this.allprods.forEach((element: any) => {
              this.offeredprods.push([
                {
                  ...element,
                },
              ]);
            });
          }
        });
    } else {
      alert('No More Products Found...');
      this.recordCounts = false;
    }
  }
}
