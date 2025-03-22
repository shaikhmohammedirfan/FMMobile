import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactform: FormGroup = this.fb.group({
    contactname: ['', [Validators.required]],
    contactphone: [''],
    contactemail: [''],
    contactmessage: ['', [Validators.required]],
  });

  loginsuccess: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginsuccess = true;
  }

  closeForm(ev: any): void {
    ev.stopPropagation();
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  googleSignIn() {}

  // Top open mobile phone login form/dialog
  // openMobileDialog(enterAnimationDuration: any, exitAnimationDuration: any) {

  openMobileDialog() {
    // this.dialog.open(VerifyMobileComponent, {
    //   width: '95%',
    //   height: '630px',
    //   position: { top: '80px' },
    // });
  }
  async onSubmit(formvalue: Form) {
    //To save record to firebase db
    console.log(formvalue);

    // this.supsubject.insertSubject(formvalue);
    // this.router.navigate(['/'], { relativeTo: this.route });
  }
}
