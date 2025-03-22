import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { SupOrderService } from 'src/app/services/sup.so.service';
import { so_mstInterface } from 'src/app/interfaces/somaster.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { so_detailsInterface } from 'src/app/interfaces/sodetails.interface';
import { productinterface } from 'src/app/interfaces/product.interface';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatProgressBarModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
})
export class AllordersComponent implements OnInit {
  somstlist: so_mstInterface[] = [];
  sodetaillist: so_detailsInterface[] = [];
  // items: any[] = [
  //   {
  //     title: 'title of item 1',
  //     content: { name: 'content of item 1', age: 20 },
  //     panelOpenState: false,
  //   },
  //   {
  //     title: 'title of item 2',
  //     content: { name: 'content of item 2', age: 30 },
  //     panelOpenState: false,
  //   },
  //   {
  //     title: 'title of item 3',
  //     content: { name: 'content of item 3', age: 40 },
  //     panelOpenState: false,
  //   },
  //   {
  //     title: 'title of item 4',
  //     content: { name: 'content of item 4', age: 50 },
  //     panelOpenState: false,
  //   },
  // ];

  constructor(
    private readonly soservice: SupOrderService,
    private readonly auth: AuthService,
    public readonly loader: LoaderService,
    private readonly prodservice: SupProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getsoMstList();
  }

  async getsoMstList() {
    this.loader.isLoading.next(true);
    await this.soservice
      .custsoMstList(this.auth.localcustomerkey.value)
      .then((resp: any) => {
        console.log('soMst list=', resp);
        this.somstlist = resp;
      });

    this.loader.isLoading.next(false);
  }

  async getDetails(orderid: any) {}
  async onPanelClick(orderid: any) {
    this.loader.isLoading.next(true);
    await this.soservice.custsoDetailList(orderid).then((resp: any) => {
      this.sodetaillist = resp;
      // console.log('Order No:', this.sodetaillist);
    });
    this.loader.isLoading.next(false);
  }
  prodDetails(productid: any, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    this.prodservice.prodDetails.next(productid);
    this.router.navigate(['/prodDetails'], { relativeTo: this.route });
  }
}
