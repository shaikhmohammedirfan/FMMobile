import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { productinterface } from 'src/app/interfaces/product.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotdeals',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, AsyncPipe],
  templateUrl: './hotdeals.component.html',
  styleUrls: ['./hotdeals.component.scss'],
})
export class HotdealsComponent implements OnInit {
  allhotdeals: any;
  offerpct = 70;

  constructor(
    private readonly prodservice: SupProductsService,
    public readonly loader: LoaderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAllHotDeals(this.offerpct);
    // this.loader.isLoading.next(true);
    // this.prodservice.getAllHotDeals(this.offerpct).then((resp: any) => {
    //   this.allhotdeals = resp;
    // });
    // this.loader.isLoading.next(false);
  }

  async getAllHotDeals(offerpct: any) {
    try {
      this.loader.isLoading.next(true);
      let resp = await this.prodservice.getAllHotDeals(this.offerpct);
      this.allhotdeals = resp;
      this.loader.isLoading.next(false);
    } catch (error) {
      console.log('Error from allhotdeals=', error);
    }
  }
  goToBrandPage(brand: string, ev: any) {
    ev.stopPropagation();
    // console.log(brand);
    this.prodservice.brandSelected.next(brand);
    this.router.navigate(['/brandpage'], { relativeTo: this.route });
  }

  prodDetails(product: productinterface, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    this.prodservice.prodDetails.next(product);
    this.router.navigate(['/prodDetails'], { relativeTo: this.route });
  }
}
