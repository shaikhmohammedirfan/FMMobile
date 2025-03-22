import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

import { ProductsonofferComponent } from '../components/feature/products/productsonoffer/productsonoffer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotdealsComponent } from '../components/feature/products/hotdeals/hotdeals.component';
import { BrandsComponent } from '../components/feature/brands/brands.component';
import { TopbrandsComponent } from '../components/feature/brands/topbrands/topbrands.component';
import { CartComponent } from '../components/feature/members/cart/cart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    RouterOutlet,
    ProductsonofferComponent,
    HotdealsComponent,
    TopbrandsComponent,
    CartComponent,
  ],
})
export class HomeComponent implements OnInit {
  gymname: any;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {}

  start = () => {
    this.auth.getLocalGymName().then((resp: any) => {
      // console.log(resp);
      if (resp !== null) {
        this.gymname = resp;
        this.router.navigate(['gymhome'], { relativeTo: this.route });
      } else {
        alert('Required information not found! Please login...');
        this.router.navigate(['gymlogin'], { relativeTo: this.route });
      }
    });
  };
}
