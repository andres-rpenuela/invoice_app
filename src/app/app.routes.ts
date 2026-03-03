import { Routes } from '@angular/router';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';


export const routes: Routes = [
  { path: '', component: InvoicePageComponent },
  { path: '', redirectTo: '', pathMatch: 'full'}
];
