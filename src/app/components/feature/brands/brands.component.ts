import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupBrandsService } from 'src/app/services/sup.brands.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrandcardComponent } from './brandcard/brandcard.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, BrandcardComponent],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  brandsArray: any[] = [];

  allbrands: any;
  totalBrands: any;
  countRecords = true;

  newAllBrands: any[] = [];

  constructor(
    private readonly brandservice: SupBrandsService,
    public readonly loader: LoaderService,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // Get total no. of records in table

    this.getAllBrandsDataLength();

    // console.log('countrecords=', this.countRecords);

    // Initial value of variable should be 0 and 4 whenever page loads
    this.brandservice.fromRecord.next(0);
    this.brandservice.toRecord.next(4);

    // Get 5 records eash time from Db
    this.getBrandsByRange(0, 4);
    // console.log(this.brandservice.toRecord.value);
  }

  async getAllBrandsDataLength() {
    try {
      this.loader.isLoading.next(true);
      let resp = await this.brandservice.getAllBrands();
      this.totalBrands = resp.length;
      this.brandservice.totalBrands.next(this.totalBrands);
      this.loader.isLoading.next(false);
    } catch (error) {
      console.log('Error from AllRrandsQuery=', error);
    }
  }
  async moreRecords() {
    // Run only when total no of records in db > 5
    this.countRecords = true;
    // console.log(this.brandservice.toRecord.value);

    if (this.totalBrands < this.brandservice.toRecord.value) {
      this.snackbar.showNotification('End of list...', 'OK', 'info');
      this.countRecords = false;
    } else if (
      this.brandservice.toRecord.value >= 4 &&
      this.brandservice.toRecord.value <= this.totalBrands
    ) {
      this.brandservice.fromRecord.next(this.brandservice.fromRecord.value + 5);
      this.brandservice.toRecord.next(this.brandservice.toRecord.value + 5);

      this.getBrandsByRange(
        this.brandservice.fromRecord.value,
        this.brandservice.toRecord.value
      );
    }
  }

  async getBrandsByRange(fromRec: any, toRec: any) {
    try {
      this.loader.isLoading.next(true);
      let resp = await this.brandservice.getBrandsByRange(fromRec, toRec);
      this.allbrands = resp;
      this.loader.isLoading.next(false);
      if (this.allbrands === null) {
        // alert('No More Items Found...');
        this.snackbar.showNotification('No More Items Found...', 'OK', 'info');

        this.countRecords = false;
      } else {
        this.allbrands.forEach((element: any) => {
          this.newAllBrands.push([
            {
              brandlogo: element.brandlogo,
              brandname: element.brandname,
              brandid: element.brandid,
            },
          ]);
        });
      }
    } catch (error) {
      console.log('Error message from getallbrandbyrange=', error);
    }
  }
}
