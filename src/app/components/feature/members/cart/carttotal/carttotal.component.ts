import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { SupCartsService } from 'src/app/services/sup.carts.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-carttotal',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, NgIf, MatFormFieldModule],
  templateUrl: './carttotal.component.html',
  styleUrls: ['./carttotal.component.scss'],
})
export class CarttotalComponent implements OnInit {
  @Input() cartArray: any;
  cartlist: any[] = [];

  mrptotal = 0;
  discounttotal = 0;
  deleveryfee = 0;
  savingtotal = 0;
  netamount = 0;

  constructor(
    private readonly cartservice: SupCartsService,
    public readonly loader: LoaderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loader.isLoading.next(true);
    this.cartlist = this.cartservice.cartDetails.value;
    this.mrptotal = this.cartservice.cartmrptotal.value;
    this.discounttotal = this.cartservice.cartdiscounttotal.value;
    this.savingtotal = this.cartservice.cartsavingtotal.value;
    this.deleveryfee = this.cartservice.cartdeliveryfee.value;
    this.netamount = this.cartservice.cartnettotal.value;

    this.loader.isLoading.next(false);
    console.log('mrptotal in total=', this.cartservice.cartmrptotal.value);

    // this.cartlist.forEach((element: any) => {});
  }
}
