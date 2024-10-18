import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { PinDialogData } from '../models/pin-dialog-data'; // set the label type so the earth.ts can read the label
import { WorkInfo } from '../models/work-info';

@Component({
  selector: 'app-pin-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './pin-dialog.component.html',
  styleUrl: './pin-dialog.component.scss',
})
export class PinDialogComponent {
  // constructor will take the date from the pin that is clicked
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { info: WorkInfo },
    public dialogRef: MatDialogRef<PinDialogComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  isFlipped = false;

  jobs = [
    {
      jobNumber: 1,
      jobTitle: 'Knowledge Manager',
      jobLocation: 'Omaha, Nebraska',
    },
  ];

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  doSomething() {
    // Implement the action you want to perform
    console.log('Action button clicked');
  }
}
