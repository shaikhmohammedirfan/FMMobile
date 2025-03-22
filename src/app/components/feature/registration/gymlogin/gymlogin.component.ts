import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SupGymService } from 'src/app/services/sup.gym.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gymlogin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './gymlogin.component.html',
  styleUrls: ['./gymlogin.component.scss'],
})
export class GymloginComponent {
  error: string = '';
  // Declare form here to get autocomplete
  frmGymLogin = this.fb.group({
    gymkey: ['', [Validators.required]],
  });
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly supdata: SupGymService,
    private readonly auth: AuthService
  ) {}

  onFormSubmit(formvalue: any) {
    // console.log('form value=', formvalue);

    this.supdata.getGymDetails(formvalue.gymkey).then((resp) => {
      if (resp.length > 0) {
        // console.log(resp);

        resp.forEach((element: any) => {
          this.auth.currgymid.next(element.gymid);

          this.auth.currgymname.next(element.gymname);
          this.auth.removeLocalGymkey();
          this.auth.setLocalGymkey(element.gymid);

          this.auth.removeLocalGymname();
          this.auth.setLocalGymname(element.gymname);
        });

        this.router.navigate(['../memberlogin'], { relativeTo: this.route });
      } else {
        this.error =
          'invalid key! Please contact support@fm.com or dial: 123456789';
      }
    });
  }

  closeForm(): void {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
