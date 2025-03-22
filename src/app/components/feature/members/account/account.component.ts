import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomermstComponent } from '../profile/customermst/customermst.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomermstComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  customerid!: string;
  customername: any;
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.customerid = this.auth.localcustomerkey.value;
    this.customername = this.auth.localcustomername.value;

    this.auth.getLocalcustomername().then((resp) => {
      if (resp !== null) {
        this.customername = resp;
        this.router.navigate(['account'], { relativeTo: this.route });
      } else {
        alert('Required information not found! Please login...');
        this.router.navigate(['../gymlogin'], { relativeTo: this.route });
      }
      // console.log(this.customername);
    });
  }
  logout() {
    this.router.navigate(['../gymlogin'], { relativeTo: this.route });
  }
}
