import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-filterbottomsheet',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './filterbottomsheet.component.html',
  styleUrls: ['./filterbottomsheet.component.scss'],
})
export class FilterbottomsheetComponent {
  constructor(private _bottomSheet: MatBottomSheet) {}
  openLink(event: MouseEvent): void {
    this._bottomSheet.dismiss();
    event.preventDefault();
  }
}
