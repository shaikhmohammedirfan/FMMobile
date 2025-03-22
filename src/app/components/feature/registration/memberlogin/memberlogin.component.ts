import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupGymService } from 'src/app/services/sup.gym.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SupMemberService } from 'src/app/services/sup.member.service';

@Component({
  selector: 'app-memberlogin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './memberlogin.component.html',
  styleUrls: ['./memberlogin.component.scss'],
})
export class MemberloginComponent implements OnInit {
  error: string = '';
  gymname: string = '';
  gymid!: string;

  // Declare form here to get autocomplete
  frmMemberLogin = this.fb.group({
    memberkey: ['', [Validators.required]],
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly supmemberdata: SupMemberService,
    private readonly auth: AuthService,
    public loader: LoaderService
  ) {
    this.gymname = this.auth.currgymname.value;
    this.gymid = this.auth.currgymid.value;
    // console.log(this.auth.currgymname.value);
    // console.log(this.gymid);
  }

  ngOnInit(): void {
    console.log('Welcome to Login');
  }
  onFormSubmit(formvalue: any) {
    this.loader.isLoading.next(true);
    // Verify input mebercode from database

    this.auth.getcustomerInfo().then((resp: any) => {
      let custinfo = Object.keys(resp);
      if (custinfo.length > 0) {
        custinfo.forEach((element: any) => {
          if ((element.customer_id = this.auth.localcustomerkey.value)) {
            console.log(element);
          }
        });
      }
    });

    this.supmemberdata.getMemberDetails(formvalue.memberkey).then((resp) => {
      if (resp.length > 0) {
        resp.forEach((element: any) => {
          // member id code
          this.auth.currcustomerid.next(element.customer_id);
          this.auth.removeLocalcustomerkey();

          this.auth.setLocalcustomerkey(element.customer_id);
          // console.log(this.auth.getLocalMemberKey());

          // member name code
          this.auth.removeLocalcustomername();
          this.auth.setLocalcustomername(element.shortname);
          this.router.navigate(['../account'], { relativeTo: this.route });
        });
      } else {
        this.error = 'Invalid User! Try again or contact Admin';
        this.loader.isLoading.next(false);
      }
    });
  }

  closeForm(): void {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
