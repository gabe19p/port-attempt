import { Routes } from '@angular/router';
import { EarthComponent } from './earth/earth.component';
import { PinDialogComponent } from './pin-dialog/pin-dialog.component';
import { EducationComponent } from './education/education.component';

export const routes: Routes = [
  { path: '', redirectTo: '/education', pathMatch: 'full' },
  { path: 'earth', component: EarthComponent },
  { path: 'education', component: EducationComponent },
];
