import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailPassword } from 'src/app/interfaces/email-password';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-email-password-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './email-password-form.component.html',
  styleUrls: ['./email-password-form.component.scss'],
})
export class EmailPasswordFormComponent implements OnInit {
  @Output() submitEvent: EventEmitter<EmailPassword> =
    new EventEmitter<EmailPassword>();

  frmEmailPassword = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {}

  onFormSubmit(formValue: any): void {
    console.log(formValue);
    // send formValue to calling component using Output
    this.submitEvent.emit(formValue);
  }
}
