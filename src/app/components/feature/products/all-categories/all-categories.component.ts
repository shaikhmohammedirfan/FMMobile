import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ProductcardComponent } from '../productcard/productcard.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { BrandcardComponent } from '../../brands/brandcard/brandcard.component';
import { ProdsCategoryCardComponent } from '../prods-category-card/prods-category-card.component';

@Component({
  selector: 'app-prod-categories',
  standalone: true,
  imports: [CommonModule, ProdsCategoryCardComponent, MatProgressBarModule],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  catList: any[] = [];
  prodByCategory: any[] = [];
  categoryarray: any[] = [];
  countRecords = true;
  totalCategoriesCount: any;

  constructor(
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly prodservice: SupProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // Get total no. of records in table
    this.getAllCategoriesDataLength();

    // Initial value of variable should be 0 and 4 whenever page loads
    // to get first 5 records
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);
    this.getCategoriesByRange(0, 4);
  }

  async getAllCategoriesDataLength() {
    try {
      this.loader.isLoading.next(true);
      // let resp = this.prodservice.getAllCategories();
      // this.totalCategoriesCount = resp;
      // console.log('category count=', this.totalCategoriesCount);
      this.prodservice.getAllCategoriesCount().then((resp: any) => {
        this.totalCategoriesCount = resp;
        // console.log('category count=', this.totalCategoriesCount);
      });
    } catch (error) {
      console.log('Error from categoryCount', error);
    }
  }

  async getCategoriesByRange(fromRec: number, toRe: number) {
    try {
      this.loader.isLoading.next(true);

      this.prodservice
        .getCategoriesByRange(
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp: any) => {
          this.catList = this.prodservice.categoryList$.value;
          this.loader.isLoading.next(false);
          if (this.catList === null || this.catList.length == 0) {
            this.snackbar.showNotification('No Records Found...', 'OK', 'info');
            this.countRecords = false;
          } else {
            this.catList.forEach((element) => {
              this.categoryarray.push([{ ...element }]);
            });
          }
        });
    } catch (error) {
      console.log('Error message from getallcategoriesrange=', error);
    }
  }
  // async getFirst5Records() {
  //   this.loader.isLoading.next(true);

  //   this.prodservice.getCategoriesByRange(0, 4).then((resp: any) => {
  //     this.catList = this.prodservice.categoryList$.value;

  //     this.catList.forEach((element) => {
  //       this.categoryarray.push([{ ...element }]);
  //     });
  //   });
  //   console.log('categories in component=', this.categoryarray);
  //   this.loader.isLoading.next(false);
  // }

  async moreRecords() {
    if (this.totalCategoriesCount < this.prodservice.toRecord.value) {
      this.snackbar.showNotification('End of items...', 'OK', 'info');
      this.countRecords = false;
    } else if (
      this.prodservice.toRecord.value >= 4 &&
      this.prodservice.toRecord.value <= this.totalCategoriesCount
    ) {
      this.prodservice.fromRecord.next(this.prodservice.fromRecord.value + 5);
      this.prodservice.toRecord.next(this.prodservice.toRecord.value + 5);

      const resp = await this.prodservice.getCategoriesByRange(
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.catList = this.prodservice.categoryList$.value;
    }

    if (this.catList === null) {
      // alert('');
      this.snackbar.showNotification(
        'No More Categories Found...',
        'OK',
        'info'
      );
      this.countRecords = false;
    } else {
      this.loader.isLoading.next(true);

      // console.log('prodarray before push=', this.prodsarray);

      this.catList.forEach((element) => {
        this.categoryarray.push([{ ...element }]);
      });
      // console.log('prodsarray here=', this.prodsarray);
      this.loader.isLoading.next(false);
    }
  }
  // async moreRecords() {
  //   try {
  //     await this.prodservice
  //       .getAllProdsByBrandCount(this.prodservice.selectedProdBrand$.value)
  //       .then((resp: any) => {
  //         this.totalProdsCount = resp;
  //       });
  //   } catch (error) {
  //     console.log('Error retreiwing allproucuts', error);
  //   }
  // }

  // async getCategoryList() {
  //   this.loader.isLoading.next(true);
  //   await this.prodservice.getAllCategories().then((resp: any) => {
  //     this.catList = resp;
  //     // console.log('category list in compo=', this.catList);
  //   });

  //   this.loader.isLoading.next(false);
  // }

  // prodsByCategory(category: any, $event: MouseEvent) {
  //   // console.log('Method not implemented.', category);
  //   this.prodservice
  //     .getAllProdsByRangeByCategory(
  //       category,
  //       this.prodservice.fromRecord.value,
  //       this.prodservice.toRecord.value
  //     )
  //     .then((resp: any) => {
  //       this.prodByCategory = resp;
  //       console.log('product by categories...', this.prodByCategory);
  //       if (this.prodByCategory === null) {
  //         this.snackbar.showNotification(
  //           'No product found for this category...',
  //           'OK',
  //           'info'
  //         );
  //         // alert('no product found for this category...');
  //         this.router.navigate(['../'], { relativeTo: this.route });
  //       } else {
  //         this.router.navigate(['/prodsByCategory'], {
  //           relativeTo: this.route,
  //         });
  //       }
  //     });
  // }
  async sort() {}
  async filter() {}
}
