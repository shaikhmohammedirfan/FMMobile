import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductcardComponent } from '../productcard/productcard.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from 'src/app/services/loader.service';
import { SupProductsService } from 'src/app/services/sup.products.service';

import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-prods-by-brand',
  standalone: true,
  imports: [CommonModule, ProductcardComponent, MatProgressBarModule],
  templateUrl: './prods-by-brand.component.html',
  styleUrl: './prods-by-brand.component.scss',
})
export class ProdsByBrandComponent implements OnInit {
  totalProdsCount: any;
  countRecords = true;

  prodsarray: any[] = [];
  prodList: any[] = [];

  constructor(
    public loader: LoaderService,
    private readonly prodservice: SupProductsService,
    private readonly snackbar: SnackbarService
  ) {
    // this.getFirst5Records();
  }

  ngOnInit(): void {
    // Get total count of records in table
    this.getAllProdsByBrandDataLength();

    // Initial value of variable should be 0 and 4 whenever page loads
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);

    this.getProdsByRange(
      this.prodservice.fromRecord.value,
      this.prodservice.toRecord.value
    );
  }

  async getAllProdsByBrandDataLength() {
    try {
      await this.prodservice
        .getAllProdsByBrandCount(this.prodservice.selectedProdBrand$.value)
        .then((resp: any) => {
          this.totalProdsCount = resp;
        });
    } catch (error) {
      console.log('Error retreiwing allproucuts', error);
    }
  }

  async getProdsByRange(fromRec: any, toRec: any) {
    try {
      this.loader.isLoading.next(true);
      // console.log('brand selected=', this.prodservice.selectedProdBrand$.value);
      await this.prodservice
        .getAllProdsByRangeByBrand(
          this.prodservice.selectedProdBrand$.value,
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.prodList = this.prodservice.prodsByBrand$.value;
          this.prodList.forEach((element) => {
            this.prodsarray.push([{ ...element }]);
          });
        });
      this.loader.isLoading.next(false);
    } catch (error) {
      console.log('Error from prodsbybrandbyrange=', error);
    }
  }
  // async getFirst5Records() {
  //   this.loader.isLoading.next(true);
  //   this.prodservice.prodsByBrand$.subscribe((resp: any) => {
  //     this.prodList = this.prodservice.prodsByBrand$.value;
  //     console.log('prodslst=', this.prodList);
  //   });

  //   // append/create new array prodsarray from prodList array
  //   this.prodList.forEach((element) => {
  //     this.prodsarray.push([{ ...element }]);
  //   });

  //   this.loader.isLoading.next(false);
  // }

  async moreRecords() {
    // console.log('total prods=', this.totalProdsCount);
    // console.log('toRecord value now=', this.prodservice.toRecord.value);

    if (this.totalProdsCount < this.prodservice.toRecord.value) {
      // alert('No More Products Found...');
      this.snackbar.showNotification('End of product list...', 'OK', 'info');
      this.countRecords = false;
    } else if (
      this.prodservice.toRecord.value >= 4 &&
      this.prodservice.toRecord.value <= this.totalProdsCount
    ) {
      this.prodservice.fromRecord.next(this.prodservice.fromRecord.value + 5);
      this.prodservice.toRecord.next(this.prodservice.toRecord.value + 5);

      const resp = await this.prodservice.getAllProdsByRangeByBrand(
        this.prodservice.selectedProdBrand$.value,
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.prodList = this.prodservice.prodsByBrand$.value;

      // append next 5 records to prodsarray from prodList array

      if (this.prodList === null) {
        // alert('');
        this.snackbar.showNotification(
          'No More Products Found...',
          'OK',
          'info'
        );
        this.countRecords = false;

        //Reset initial value of variables
        // this.prodservice.fromRecord.next(0);
        // this.prodservice.toRecord.next(4);
      } else {
        this.loader.isLoading.next(true);

        // console.log('prodarray before push=', this.prodsarray);

        this.prodList.forEach((element) => {
          this.prodsarray.push([{ ...element }]);
        });
        // console.log('prodsarray here=', this.prodsarray);
        this.loader.isLoading.next(false);
      }
    }
  }
}
