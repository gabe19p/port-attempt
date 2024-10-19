import { Routes } from '@angular/router';
import { EarthComponent } from './earth/earth.component';
import { PinDialogComponent } from './pin-dialog/pin-dialog.component';

export const routes: Routes = [
  { path: '', redirectTo: '/resume', pathMatch: 'full' },
  { path: 'earth', component: EarthComponent },
  { path: 'resume', component: PinDialogComponent },
];
