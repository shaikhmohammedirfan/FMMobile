import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { ContactComponent } from './contact/contact.component';
import { GymloginComponent } from './components/feature/registration/gymlogin/gymlogin.component';
import { MemberloginComponent } from './components/feature/registration/memberlogin/memberlogin.component';
import { AccountComponent } from './components/feature/members/account/account.component';
import { ProfileComponent } from './components/feature/members/profile/profile.component';
import { OrdersComponent } from './components/feature/members/orders/orders.component';
import { CartComponent } from './components/feature/members/cart/cart.component';
import { WishlistComponent } from './components/feature/members/wishlist/wishlist.component';
import { GymhomeComponent } from './components/feature/gymhome/gymhome.component';
import { ProductsComponent } from './components/feature/products/products.component';
import { ProductsonofferComponent } from './components/feature/products/productsonoffer/productsonoffer.component';
import { ProductdetailsComponent } from './components/feature/products/productdetails/productdetails.component';
// import { BrandpageComponent } from './components/feature/products/brandpage/brandpage.component';

import { BrandsComponent } from './components/feature/brands/brands.component';
import { SaveforlaterComponent } from './components/feature/members/cart/saveforlater/saveforlater.component';
import { PaymentsComponent } from './components/feature/members/payments/payments.component';
import { AddresslistComponent } from './components/feature/members/orders/addresslist/addresslist.component';
import { BillformComponent } from './components/feature/members/profile/billform/billform.component';
import { CustomermstComponent } from './components/feature/members/profile/customermst/customermst.component';
import { CustomermstformComponent } from './components/feature/members/profile/customermstform/customermstform.component';
import { DeliveryaddressComponent } from './components/feature/members/profile/deliveryaddress/deliveryaddress.component';
import { DeliveryformComponent } from './components/feature/members/profile/deliveryform/deliveryform.component';
import { AllordersComponent } from './components/feature/members/orders/allorders/allorders.component';

import { ProdsByBrandComponent } from './components/feature/products/prods-by-brand/prods-by-brand.component';
import { ProdsByCategoryComponent } from './components/feature/products/prods-by-category/prods-by-category.component';
import { CategoriesComponent } from './components/feature/products/all-categories/all-categories.component';

const routes: Routes = [
  {
    path: '',
    title: 'Home page',
    component: HomeComponent,
  },
  {
    path: 'help',
    component: HelpPageComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  // {
  //   path: 'registration',
  //   title: 'Resteration',
  //   loadComponent: () =>
  //     import('./components/feature/registration/registration.component').then(
  //       (c) => c.RegistrationComponent
  //     ),
  // },
  {
    path: 'gymhome',
    title: 'Gym Home Page',
    component: GymhomeComponent,
  },
  {
    path: 'gymlogin',
    title: 'Gym Login Page',
    component: GymloginComponent,
  },
  {
    path: 'memberlogin',
    title: 'Member Login Page',
    component: MemberloginComponent,
  },
  {
    path: 'account',
    title: 'Member Account Page',
    component: AccountComponent,
  },
  {
    path: 'profile',
    title: 'Profile Page',
    component: ProfileComponent,
  },
  {
    path: 'billform',
    title: 'Billing Form Page',
    component: BillformComponent,
  },
  {
    path: 'custmstform',
    title: 'Customer Master Form Page',
    component: CustomermstformComponent,
  },
  {
    path: 'deliveryform',
    title: 'Delivery Form Page',
    component: DeliveryformComponent,
  },
  {
    path: 'orders',
    title: 'Orders Page',
    component: OrdersComponent,
  },
  {
    path: 'allorders',
    title: 'All Orders List',
    component: AllordersComponent,
  },
  {
    path: 'addresslist',
    title: 'Address List Page',
    component: AddresslistComponent,
  },
  {
    path: 'payments',
    title: 'Payments Page',
    component: PaymentsComponent,
  },
  {
    path: 'cart',
    title: 'Cart Page',
    component: CartComponent,
  },
  {
    path: 'wishlist',
    title: 'Wishlist Page',
    component: WishlistComponent,
  },
  {
    path: 'allproducts',
    title: 'All Products Page',
    component: ProductsComponent,
  },
  {
    path: 'allCategories',
    title: 'List Of Product Categories Page',
    component: CategoriesComponent,
  },

  {
    path: 'prodsByBrand',
    title: 'List of all products by selected brand Page',
    component: ProdsByBrandComponent,
  },

  {
    path: 'prodsByCategory',
    title: 'List of all products by selected category Page',
    component: ProdsByCategoryComponent,
  },
  {
    path: 'hotdeals',
    title: 'HotDeals Page',
    component: ProductsonofferComponent,
  },
  {
    path: 'alldeals',
    title: 'All-Deals Page',
    component: ProductsonofferComponent,
  },
  {
    path: 'prodDetails',
    title: 'Product Details Page',
    component: ProductdetailsComponent,
  },
  {
    path: 'allbrands',
    title: 'All Brands Page',
    component: BrandsComponent,
  },
  {
    path: 'saved4later',
    title: 'Saved For Later Page',
    component: SaveforlaterComponent,
  },
  {
    path: 'loginoptions',
    title: 'Login Options Page',
    loadChildren: () =>
      import('./components/feature/registration/registration.route').then(
        (routecomponent) => routecomponent.REGISTRATION_ROUTE
      ),
  },

  // {
  //   path: 'student',
  //   title: 'Student Dashboard page',
  //   loadChildren: () =>
  //     import('./components/feature/student/student.route').then(
  //       (routecomponent) => routecomponent.STUDENT_ROUTE
  //     ),
  // },
  // Route to STUDENT_ROUTE (not REPORT_ROUTE) as reports required studentid
  // {
  //   path: 'reports',
  //   title: 'Reports page',
  //   loadChildren: () =>
  //     import('./components/feature/student/student.route').then(
  //       (routecomponent) => routecomponent.STUDENT_ROUTE
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
