import { Route } from '@angular/router';
// import { RegistrationComponent } from './registration.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LoginOptionsComponent } from './login-options/login-options.component';

export const REGISTRATION_ROUTE: Route[] = [
  {
    path: '',
    title: 'User Registration Page',
    component: LoginOptionsComponent,
  },

  // {
  //   path: 'loginoptions',
  //   title: 'Login Options Page',
  //   component: LoginOptionsComponent,
  // },
  // {
  //   path: 'signin',
  //   title: 'SignIn page',
  //   component: SigninComponent,
  // },

  {
    path: 'signup',
    title: 'SignUp page',
    component: SignupComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
