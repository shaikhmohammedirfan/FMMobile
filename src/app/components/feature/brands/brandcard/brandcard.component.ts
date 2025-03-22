import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-brandcard',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './brandcard.component.html',
  styleUrls: ['./brandcard.component.scss'],
})
export class BrandcardComponent implements OnInit {
  @Input() brandsArray: any[] = [];
  newBrandsArray: any[] = [];
  brandSelected: any;
  countRecords = true;
  totalProdsByBranchCount = 0;
  prodListByBrand: any[] = [];
  prodsarray: any[] = [];

  constructor(
    private readonly prodservice: SupProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: SnackbarService,
    public readonly loader: LoaderService
  ) {}

  ngOnInit(): void {
    // console.log('BrandsArray in brand card=', this.brandsArray);

    // Initial value of variable should be 0 and 4 whenever page loads
    // to get first 5 records
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);
  }

  async getProdsByBrandByRange(brand: string, $event: MouseEvent) {
    this.prodservice.selectedProdBrand$.next(brand);
    this.brandSelected = this.prodservice.selectedProdBrand$.value;
    //Get count(*) for selected branch from db
    try {
      this.loader.isLoading.next(true);
      this.prodservice.getAllProdsByBrandCount(brand).then((resp: any) => {
        this.totalProdsByBranchCount = resp;
        this.loader.isLoading.next(false);
        // console.log('count of prods by brnch=', this.totalProdsByBranchCount);
      });
    } catch (error) {
      console.log('Error from prodsByBrandCount', error);
    }

    try {
      this.loader.isLoading.next(true);
      this.prodservice
        .getAllProdsByRangeByBrand(
          this.brandSelected,
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.prodListByBrand = this.prodservice.prodsByBrand$.value;
          // console.log('prodlist=', this.prodListByBrand);
          this.loader.isLoading.next(false);
          if (
            this.prodListByBrand === null ||
            this.prodListByBrand.length == 0
          ) {
            this.snackbar.showNotification('No Records Found...', 'OK', 'info');
            this.countRecords = false;
          } else {
            this.prodListByBrand.forEach((element) => {
              this.prodsarray.push([{ ...element }]);
              this.router.navigate(['/prodsByBrand'], {
                relativeTo: this.route,
              });
            });
          }
        });
      this.loader.isLoading.next(false);
    } catch (error) {}
  }

  async moreRecords() {
    if (this.totalProdsByBranchCount < this.prodservice.toRecord.value) {
      this.snackbar.showNotification('End of items...', 'OK', 'info');
      this.countRecords = false;
    } else if (
      this.prodservice.toRecord.value >= 4 &&
      this.prodservice.toRecord.value <= this.totalProdsByBranchCount
    ) {
      this.prodservice.fromRecord.next(this.prodservice.fromRecord.value + 5);
      this.prodservice.toRecord.next(this.prodservice.toRecord.value + 5);

      const resp = await this.prodservice.getAllProdsByRangeByBrand(
        this.brandSelected,
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.prodListByBrand = this.prodservice.prodsByBrand$.value;
    }

    if (this.prodListByBrand === null || this.prodListByBrand.length == 0) {
      // alert('');
      this.snackbar.showNotification('No More Products Found...', 'OK', 'info');
      this.countRecords = false;
    } else {
      this.loader.isLoading.next(true);

      // console.log('prodarray before push=', this.prodsarray);

      this.prodListByBrand.forEach((element) => {
        this.prodsarray.push([{ ...element }]);
        this.router.navigate(['/prodsByBrand'], {
          relativeTo: this.route,
        });
      });
      // console.log('prodsarray here=', this.prodsarray);
      this.loader.isLoading.next(false);
    }
  }
  // prodByBrand(brand: any, ev: any) {
  //   // To stop further events to triggered
  //   // ev.stopPropagation();

  //   this.prodservice
  //     .getAllProdsByRangeByBrand(
  //       brand,
  //       this.prodservice.fromRecord.value,
  //       this.prodservice.toRecord.value
  //     )
  //     .then((resp: any) => {
  //       this.prodByBrand = this.prodservice.prodsByBrand$.value;
  //       // console.log('product by brand...', this.prodByBrand.length);

  //       if (this.prodByBrand.length > 0) {
  //         this.prodservice.selectedProdBrand$.next(brand);
  //         this.router.navigate(['/prodsByBrand'], { relativeTo: this.route });
  //       } else {
  //         //alert();
  //         this.snackbar.showNotification('End of brand list...', 'OK', 'info');

  //         this.router.navigate(['/'], { relativeTo: this.route });
  //       }
  //     });
  // }

  async sort() {}
  async filter() {}
}
