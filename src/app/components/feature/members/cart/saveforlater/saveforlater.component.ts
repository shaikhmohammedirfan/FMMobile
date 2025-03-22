import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { SupSaveditemsService } from 'src/app/services/sup.saveditems.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartcardComponent } from '../cartcard/cartcard.component';
import { SavedcardComponent } from '../savedcard/savedcard.component';

@Component({
  selector: 'app-saveforlater',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    NgIf,
    NgFor,
    SavedcardComponent,
  ],
  templateUrl: './saveforlater.component.html',
  styleUrls: ['./saveforlater.component.scss'],
})
export class SaveforlaterComponent implements OnInit {
  customerkey: any;
  savedItems: any[] = [];
  saveddata: any = [];

  constructor(
    private readonly auth: AuthService,
    private readonly saveditemservice: SupSaveditemsService,
    public loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.isLoading.next(true);
    this.getSavedItemsData();
    this.loader.isLoading.next(false);
  }

  async getSavedItemsData() {
    try {
      let resp = await this.auth.getLocalcustomerKey();
      this.customerkey = resp;

      // Get Cart details from db
      this.getSavedItemDetails(this.customerkey);

      this.loader.isLoading.next(true);

      this.saveditemservice
        .getMsgFromSavedItemsSubject()
        .subscribe((product: any) => {
          this.savedItems.push({
            ...product,
          });

          console.log('cartItem final value=', this.savedItems);
          this.loader.isLoading.next(false);
        });
    } catch (error) {
      console.log('error message from saved', error);
    }
  }

  async getSavedItemDetails(customerkey: any) {
    try {
      this.loader.isLoading.next(true);

      let resp = await this.saveditemservice.getSavedItemsBycustomer(
        this.customerkey
      );
      // this.saveditemservice.savedItemsDetails.next([...resp]);

      this.savedItems = this.saveditemservice.savedItemsDetails.value;
      this.loader.isLoading.next(false);
      console.log('cartItem initial value=', this.savedItems);
    } catch (error) {}
  }
}
