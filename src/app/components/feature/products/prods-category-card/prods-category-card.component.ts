import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupProductsService } from 'src/app/services/sup.products.service';

@Component({
  selector: 'app-prods-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prods-category-card.component.html',
  styleUrl: './prods-category-card.component.scss',
})
export class ProdsCategoryCardComponent implements OnInit {
  @Input() categoryArray: any;

  totalProdsByCategoryCount: any;
  countRecords = true;

  prodsarray: any[] = [];
  prodListByCategory: any[] = [];

  categorySelected: any;

  constructor(
    private readonly prodservice: SupProductsService,
    public loader: LoaderService,
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initial value of variable should be 0 and 4 whenever page loads
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);

    // this.getProdsByCategoryByRange(
    //   this.prodservice.fromRecord.value,
    //   this.prodservice.toRecord.value
    // );
  }

  async getAllProdsByCategoryDataLength() {
    try {
      // console.log(
      //   'Error retreiwing allproucuts',
      //   this.prodservice.selectedProdCategory$.value
      // );
      await this.prodservice
        .getAllProdsByCategoryCount(
          this.prodservice.selectedProdCategory$.value
        )
        .then((resp: any) => {
          this.totalProdsByCategoryCount = resp;
        });
    } catch (error) {
      console.log('Error retreiwing allproucuts', error);
    }
  }

  // async getProdsByBrandByRange(brand: string, $event: MouseEvent) {
  //   this.prodservice.selectedProdBrand$.next(brand);
  //   this.brandSelected = this.prodservice.selectedProdBrand$.value;
  //   //Get count(*) for selected branch from db
  //   try {
  //     this.loader.isLoading.next(true);
  //     this.prodservice.getAllProdsByBrandCount(brand).then((resp: any) => {
  //       this.totalProdsByBranchCount = resp;
  //       this.loader.isLoading.next(false);
  //       console.log('count of prods by brnch=', this.totalProdsByBranchCount);
  //     });
  //   } catch (error) {
  //     console.log('Error from prodsByBrandCount', error);
  //   }

  //   try {
  //     this.loader.isLoading.next(true);
  //     this.prodservice
  //       .getAllProdsByRangeByBrand(
  //         this.brandSelected,
  //         this.prodservice.fromRecord.value,
  //         this.prodservice.toRecord.value
  //       )
  //       .then((resp: any) => {
  //         this.prodListByBrand = this.prodservice.prodsByBrand$.value;
  //         console.log('prodlist=', this.prodListByBrand);
  //         this.loader.isLoading.next(false);
  //         if (
  //           this.prodListByBrand === null ||
  //           this.prodListByBrand.length == 0
  //         ) {
  //           this.snackbar.showNotification('No Records Found...', 'OK', 'info');
  //           this.countRecords = false;
  //         } else {
  //           this.prodListByBrand.forEach((element) => {
  //             this.prodsarray.push([{ ...element }]);
  //             this.router.navigate(['/prodsByBrand'], {
  //               relativeTo: this.route,
  //             });
  //           });
  //         }
  //       });
  //     this.loader.isLoading.next(false);
  //   } catch (error) {}
  // }

  async getProdsByCategoryByRange(categorycode: any, $event: MouseEvent) {
    this.prodservice.selectedProdCategory$.next(categorycode);
    this.categorySelected = this.prodservice.selectedProdCategory$.value;

    // console.log('category=.', this.prodservice.selectedProdCategory$.value);
    //Get total count of records in table

    try {
      this.loader.isLoading.next(true);
      this.prodservice
        .getAllProdsByBrandCount(this.categorySelected)
        .then((resp: any) => {
          this.totalProdsByCategoryCount = resp;

          this.loader.isLoading.next(false);
          // console.log('count of prods by brnch=', this.totalProdsByBranchCount);
        });
    } catch (error) {
      console.log('Error from prodsByBrandCount', error);
    }

    try {
      this.loader.isLoading.next(true);
      await this.prodservice
        .getAllProdsByRangeByCategory(
          this.categorySelected,
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.prodListByCategory = this.prodservice.prodsByCategory$.value;
          this.loader.isLoading.next(false);
          console.log('prodlist now ===', this.prodListByCategory);

          if (
            this.prodListByCategory === null ||
            this.prodListByCategory.length == 0
          ) {
            this.snackbar.showNotification(
              'No Records Foundddd...',
              'OK',
              'info'
            );
            this.countRecords = false;
          } else {
            console.log('prodlist present now ===', this.prodListByCategory);
            this.prodListByCategory.forEach((element: any) => {
              this.prodsarray.push([{ ...element }]);
              this.router.navigate(['/prodsByCategory'], {
                relativeTo: this.route,
              });
            });
          }
        });

      this.loader.isLoading.next(false);
    } catch (error) {
      console.log('Error from prodsbycategorybyrange=', error);
    }
  }

  async moreRecords() {
    if (this.totalProdsByCategoryCount < this.prodservice.toRecord.value) {
      this.snackbar.showNotification('End of items...', 'OK', 'info');
      this.countRecords = false;
    } else if (
      this.prodservice.toRecord.value >= 4 &&
      this.prodservice.toRecord.value <= this.totalProdsByCategoryCount
    ) {
      this.prodservice.fromRecord.next(this.prodservice.fromRecord.value + 5);
      this.prodservice.toRecord.next(this.prodservice.toRecord.value + 5);

      const resp = await this.prodservice.getAllProdsByRangeByBrand(
        this.categorySelected,
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.prodListByCategory = this.prodservice.prodsByCategory$.value;
    }

    if (
      this.prodListByCategory === null ||
      this.prodListByCategory.length == 0
    ) {
      // alert('');
      this.snackbar.showNotification('No More Products Found...', 'OK', 'info');
      this.countRecords = false;
    } else {
      this.loader.isLoading.next(true);

      // console.log('prodarray before push=', this.prodsarray);

      this.prodListByCategory.forEach((element) => {
        this.prodsarray.push([{ ...element }]);
        this.router.navigate(['/prodsByCategory'], {
          relativeTo: this.route,
        });
      });
      // console.log('prodsarray here=', this.prodsarray);
      this.loader.isLoading.next(false);
    }
  }

  sort() {
    console.log('Sort clicked.');
  }
  filter() {
    console.log('Filter clicked.');
  }
}
