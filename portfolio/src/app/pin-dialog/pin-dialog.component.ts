import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PinDialogData } from '../models/pin-dialog-data'; // set the label type so the earth.ts can read the label

@Component({
  selector: 'app-pin-dialog',
  standalone: true,
  imports: [],
  templateUrl: './pin-dialog.component.html',
  styleUrl: './pin-dialog.component.scss',
})
export class PinDialogComponent {
  // constructor will take the date from the pin that is clicked
  constructor(@Inject(MAT_DIALOG_DATA) public data: PinDialogData) {}
}
