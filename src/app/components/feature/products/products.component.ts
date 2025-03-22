import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductcardComponent } from './productcard/productcard.component';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductcardComponent,
    MatProgressBarModule,

    MatButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  totalProdsCount: any;
  countRecords = true;

  prodsarray: any[] = [];
  prodList: any[] = [];

  constructor(
    private readonly prodservice: SupProductsService,
    public readonly loader: LoaderService,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // Get total count of records in table
    this.getAllProdsDataLength();

    // Initial value of variable should be 0 and 4 whenever page loads
    this.prodservice.fromRecord.next(0);
    this.prodservice.toRecord.next(4);

    // Get 5 records eash time from Db
    this.getProdsByRange(0, 4);
  }

  async getAllProdsDataLength() {
    try {
      await this.prodservice.getAllProductsCount().then((resp: any) => {
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
        .getProdsByRange(
          this.prodservice.fromRecord.value,
          this.prodservice.toRecord.value
        )
        .then((resp) => {
          this.prodList = this.prodservice.prodListByRange$.value;
          this.loader.isLoading.next(false);
          if (this.prodList === null) {
            this.snackbar.showNotification('No Records Found...', 'OK', 'info');
            this.countRecords = false;
          } else {
            this.prodList.forEach((element) => {
              this.prodsarray.push([{ ...element }]);
            });
          }
        });
    } catch (error) {}
  }

  // async getFirst5Records() {
  //   this.loader.isLoading.next(true);
  //   await this.prodservice
  //     .getProdsByRange(
  //       this.prodservice.fromRecord.value,
  //       this.prodservice.toRecord.value
  //     )
  //     .then((resp) => {
  //       this.prodList = this.prodservice.prodListByRange$.value;
  //       console.log('prodlist=', resp);
  //     });

  //   // append/create new array prodsarray from prodList array
  //   this.prodList.forEach((element) => {
  //     this.prodsarray.push([{ ...element }]);
  //   });

  //   this.loader.isLoading.next(false);
  // }

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

      const resp = await this.prodservice.getProdsByRange(
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      );
      this.prodList = this.prodservice.prodListByRange$.value;

      // append next 5 records to prodsarray from prodList array

      if (this.prodList === null) {
        // alert('No More Products Found...');
        this.snackbar.showNotification('End of product list...', 'OK', 'info');
        this.countRecords = false;
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
