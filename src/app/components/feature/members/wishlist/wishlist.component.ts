import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedcardComponent } from '../cart/savedcard/savedcard.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupSaveditemsService } from 'src/app/services/sup.saveditems.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, SavedcardComponent, MatProgressBarModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  savedItems: any = [];
  customerkey: any;
  saveddatalength: number = 0;
  constructor(
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly saveditemservice: SupSaveditemsService
  ) {}
  ngOnInit(): void {
    this.getSavedItemsData();
  }

  async getSavedItemsData() {
    let resp = await this.auth.getLocalcustomerKey();
    this.customerkey = resp;
    console.log('saved data in compooonent=', this.customerkey);
    this.loader.isLoading.next(true);
    await this.saveditemservice
      .getSavedItemsBycustomer(this.customerkey)
      .then((resp: any) => {
        console.log('savedlater data in compooo=', resp);
        resp.forEach((element: any) => {
          this.savedItems.push([{ ...element }]);
        });
        this.saveddatalength = this.savedItems.length;
        console.log('saved data from DB=', this.saveddatalength);
      });
    this.loader.isLoading.next(false);
  }
}
