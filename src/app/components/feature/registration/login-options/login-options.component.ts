import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailPasswordFormComponent } from '../email-password-form/email-password-form.component';

@Component({
  selector: 'app-login-options',
  standalone: true,
  imports: [CommonModule, EmailPasswordFormComponent],
  templateUrl: './login-options.component.html',
  styleUrls: ['./login-options.component.scss'],
})
export class LoginOptionsComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute // private snackNotify: SnackNotifyService
  ) {}

  googleSignIn() {
    // try {
    //   this.fAuthservice.googleSignUp().then((loginsuccess) => {
    //     if (loginsuccess) {
    //       // console.log(loginsuccess.user);
    //       this.fireservice
    //         .getCartKeyFromUserMaster(loginsuccess.user.email)
    //         .then((cartkeyfound) => {
    //           // console.log('CARTLEU', cartkeyfound);
    //           if (cartkeyfound) {
    //             this.fireservice
    //               .setLocalKey(cartkeyfound)
    //               .then(async (success) => {
    //                 if (success) {
    //                   // this.snackNotify.showNotification(
    //                   //   'Login successfull!',
    //                   //   'OK',
    //                   //   'success'
    //                   // );
    //                   this.popupmessage = 'Login successfull!';
    //                   await this.router.navigate(['/']);
    //                 }
    //               });
    //           } else {
    //             // this.snackNotify.showNotification(
    //             //   'User not found! Please create new account',
    //             //   'OK',
    //             //   'error'
    //             // );
    //             this.popupmessage = 'User not found! Please create new account';
    //           }
    //         });
    //     } else {
    //       // this.snackNotify.showNotification(
    //       //   'Error login to google account! Try again...',
    //       //   'OK',
    //       //   'error'
    //       // );
    //       this.popupmessage = 'Error login to google account! Try again...';
    //       console.log('Error login to google account! Try again..');
    //     }
    //   });
    // } catch {
    //   console.log('Some error occured');
    // }
    // this.fAuthservice.googleSignUp().then((data: any) => {
    //   if (data) {
    //     this.fireService.signedUserBS.next(data.user.uid);
    //     this.fireService.setLocalKey(data.user.uid);
    //     this.router.navigate(['/myaccount']);
    //   } else {
    //   }
    // });
  }

  frmSubmitting(rcvdFormvalue: any): void {
    console.log('Rcvd from email form', rcvdFormvalue);
  }
  closeForm(): void {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
