import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from 'src/app/services/loader.service';
import { SupSaveditemsService } from 'src/app/services/sup.saveditems.service';
import { elementAt } from 'rxjs';
import { productinterface } from 'src/app/interfaces/product.interface';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupCartsService } from 'src/app/services/sup.carts.service';

@Component({
  selector: 'app-savedcard',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './savedcard.component.html',
  styleUrls: ['./savedcard.component.scss'],
})
export class SavedcardComponent implements OnInit {
  @Input() savedItemArray: any;

  saveditemlist: any[] = [];
  saveditemdata: any[] = [];
  memberkey: any;

  constructor(
    public loader: LoaderService,
    private readonly saveditemservice: SupSaveditemsService,
    private readonly prodservice: SupProductsService,
    private readonly cartservice: SupCartsService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private snackbar: SnackbarService
  ) {}

  async ngOnInit() {
    this.loader.isLoading.next(true);
    // this.saveditemlist = await this.saveditemservice.savedItemsDetails.value;
    console.log('saveditemlist value=', this.savedItemArray);
    this.loader.isLoading.next(false);
  }

  prodDetails(product: productinterface, ev: any) {
    // To stop further events to triggered
    ev.stopPropagation();
    this.prodservice.prodDetails.next(product);
    this.router.navigate(['/prodDetails'], { relativeTo: this.route });
  }

  delItem(item: any, ev: any) {
    ev.stopPropagation();
    this.saveditemservice.remSavedItem(item).then(() => {
      this.saveditemservice.deletedItem$.subscribe((resp: any) => {
        console.log('resp here=', this.saveditemservice.deletedItem$.value);
        if (this.saveditemservice.deletedItem$.value) {
          this.snackbar.showNotification('Delete Success', 'OK', 'info');
          // Reload page after qty got added
          this.router.navigate(['/cart']).then(() => {
            window.location.reload();
          });
        }
      });
    });

    //   if (resp) {
    //

    //     // this.router.navigate(['/cart']).then(() => {
    //     //   window.location.reload();
    //     // });
    //   }
    // });
  }

  move2cart(saveditem: any, $event: MouseEvent) {
    // send currently added item to cartSubject variable in service
    this.cartservice.cartInsSubject$.next(saveditem);

    // insert newly added item to db
    this.cartservice.insCartItem(saveditem).then((resp: any) => {
      // Confirm item inserted to cart db
      if (this.cartservice.cartInsSubject$.value) {
        // Delete item from saved item db
        this.delItem(this.cartservice.cartInsSubject$.value, $event);
      }
      // update cart item count
      this.auth.getcustomerInfo().then((customerdata: any) => {
        customerdata.forEach((element: any) => {
          this.auth.totalcartitems.next(element.cartcount);
          // Reload page after qty got added
          this.router.navigate(['/cart']).then(() => {
            window.location.reload();
          });
        });
      });
    });
  }
}
