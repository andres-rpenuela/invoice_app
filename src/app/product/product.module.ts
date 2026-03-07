import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormPageComponent } from './pages/product-form.page/product-form.page.component';

const routes: Routes = [
  {
    path: 'form',
    loadComponent: () => import('./pages/product-form.page/product-form.page.component').then(m => m.ProductFormPageComponent)
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full' as const
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductModule {}
