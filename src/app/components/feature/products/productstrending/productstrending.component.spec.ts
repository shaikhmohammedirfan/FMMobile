import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductstrendingComponent } from './productstrending.component';

describe('ProductstrendingComponent', () => {
  let component: ProductstrendingComponent;
  let fixture: ComponentFixture<ProductstrendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductstrendingComponent]
    });
    fixture = TestBed.createComponent(ProductstrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
