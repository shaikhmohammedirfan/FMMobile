import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupProductsService } from 'src/app/services/sup.products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss'],
})
export class ProductdetailsComponent implements OnInit {
  selectedproduct: any;
  quantity = signal(1);

  constructor(
    private readonly productservice: SupProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedproduct = this.productservice.prodDetails.value;
    console.log(this.selectedproduct);
  }
  closeForm(ev: any): void {
    ev.stopPropagation();
    this.router.navigate(['../allproducts'], { relativeTo: this.route });
  }
}
