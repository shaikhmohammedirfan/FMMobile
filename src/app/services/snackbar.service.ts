import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackbar: MatSnackBar = inject(MatSnackBar);

  showNotification(
    displayMessage: string,
    btnText: string,
    messageType: 'error' | 'success' | 'info'
  ): void {
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {
        message: displayMessage,
        buttonText: btnText,
        type: messageType,
      },
      // 5000 means 5 seconds
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageType,
    });
  }
}
