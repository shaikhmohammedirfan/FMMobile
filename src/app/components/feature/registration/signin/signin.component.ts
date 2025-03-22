import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LoaderService } from 'src/app/services/loader.service';

import { AuthService } from 'src/app/services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  pageTitle = '';
  frmUserLogin!: FormGroup;
  error: string = '';

  // Card Title value passed to 'login option' form title
  CardTitle = 'Login Using';
  userIdStatus = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public loader: LoaderService,

    private auth: AuthService
  ) {
    this.frmUserLogin = fb.group({});
    this.pageTitle = 'Verify User Key';
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.frmUserLogin = this.fb.group({
      userkey: ['', [Validators.required]],
    });
  }

  onSubmit(formValue: any): void {
    console.log(formValue.userkey);
    this.loader.isLoading.next(true);
    // Verify input usercode from database

    this.loader.isLoading.next(false);
  }
  closeForm(): void {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
