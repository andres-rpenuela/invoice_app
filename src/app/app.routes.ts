import { Routes } from '@angular/router';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';
import { productRotuer } from './product/product.router';

export const routes: Routes = [
  { path: '', component: InvoicePageComponent },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
