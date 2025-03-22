import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupBrandsService } from 'src/app/services/sup.brands.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-topbrands',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './topbrands.component.html',
  styleUrls: ['./topbrands.component.scss'],
})
export class TopbrandsComponent {
  brandsArray: any[] = [];

  constructor(
    private readonly brandservice: SupBrandsService,
    public readonly loader: LoaderService,
    private readonly prodservice: SupProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTopBrands();
  }

  async getTopBrands() {
    try {
      this.loader.isLoading.next(true);
      let resp = await this.brandservice.getTopBrands();
      this.brandsArray = resp;
      this.loader.isLoading.next(false);
    } catch (error) {
      // console.log('error from gettopbrands=', error);
    }
  }

  prodByBrand(brand: any, ev: any) {
    this.prodservice
      .getAllProdsByRangeByBrand(
        brand,
        this.prodservice.fromRecord.value,
        this.prodservice.toRecord.value
      )
      .then((resp: any) => {
        this.prodByBrand = this.prodservice.prodsByBrand$.value;
        // console.log('product by brand...', this.prodByBrand.length);

        if (this.prodByBrand.length > 0) {
          this.prodservice.selectedProdBrand$.next(brand);
          this.router.navigate(['/prodsByBrand'], { relativeTo: this.route });
        } else {
          alert('No product found for this brand....!');
          this.router.navigate(['/'], { relativeTo: this.route });
        }
      });
  }
}
