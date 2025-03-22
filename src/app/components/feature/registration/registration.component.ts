import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, SigninComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  signIn() {
    this.router.navigate(['../registration/signin'], {
      relativeTo: this.route,
    });
  }

  // signUp() {
  //   this.router.navigate(['../registration/signup'], {
  //     relativeTo: this.route,
  //   });
  // }
}
