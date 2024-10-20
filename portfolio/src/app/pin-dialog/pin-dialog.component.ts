import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { PinDialogData } from '../models/pin-dialog-data'; // set the label type so the earth.ts can read the label
import { WorkInfo } from '../models/work-info';
import {
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pin-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './pin-dialog.component.html',
  styleUrl: './pin-dialog.component.scss',
})
export class PinDialogComponent {
  // constructor will take the data from the pin that is clicked
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { info: WorkInfo },
    public dialogRef: MatDialogRef<PinDialogComponent>
  ) {}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
