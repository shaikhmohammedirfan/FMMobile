import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-sortbottomsheet',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './sortbottomsheet.component.html',
  styleUrls: ['./sortbottomsheet.component.scss'],
})
export class SortbottomsheetComponent {
  constructor(private _bottomSheet: MatBottomSheet) {}
  openLink(event: MouseEvent): void {
    this._bottomSheet.dismiss();
    event.preventDefault();
  }
}
