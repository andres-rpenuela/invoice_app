export const productRotuer = [
  {
    path: 'form',
    loadComponent: () =>
      import('./pages/product-form.page/product-form.page.component').then(
        (m) => m.ProductFormPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full' as const,
  },
]
