import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ProductcardComponent } from '../productcard/productcard.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-prods-by-category',
  standalone: true,
  imports: [CommonModule, ProductcardComponent, MatProgressBarModule],
  templateUrl: './prods-by-category.component.html',
  styleUrl: './prods-by-category.component.scss',
})
export class ProdsByCategoryComponent implements OnInit {
  totalProdsCount: any;
  countRecords = true;

  prodsarray: any[] = [];
  prodList: any[] = [];

  constructor(
    public loader: LoaderService,
    private readonly prodservice: SupProductsService,
    private readonly snackbar: SnackbarService
  ) {}
  ngOnInit(): void {
    // Get total count of records in table
    this.getAllProdsByCategoryDataLength();

    // Initial value of variable should be 0 and 4 whenever page loads
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);

    this.getProdsByRange(
      this.prodservice.fromRecord.value,
      this.prodservice.toRecord.value
    );
  }

  async getAllProdsByCategoryDataLength() {
    try {
      await this.prodservice
        .getAllProdsByCategoryCount(
          this.prodservice.selectedProdCategory$.value
        )
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
      await this.prodservice
        .getAllProdsByRangeByCategory(
          this.prodservice.selectedProdCategory$.value,
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.prodList = this.prodservice.prodsByCategory$.value;
          this.prodList.forEach((element) => {
            this.prodsarray.push([{ ...element }]);
          });
        });

      this.loader.isLoading.next(false);
    } catch (error) {
      console.log('Error from prodsbycategorybyrange=', error);
    }
  }
  async moreRecords() {
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

      const resp = await this.prodservice.getAllProdsByRangeByCategory(
        this.prodservice.selectedProdCategory$.value,
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.prodList = this.prodservice.prodsByCategory$.value;

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
