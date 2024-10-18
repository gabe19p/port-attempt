import { Routes } from '@angular/router';
import { EarthComponent } from './earth/earth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/earth', pathMatch: 'full' },
  { path: 'earth', component: EarthComponent },
];
