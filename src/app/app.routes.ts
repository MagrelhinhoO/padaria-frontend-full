import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'produtos',
        loadComponent: () => import('./features/products/components/product-list/product-list.component')
          .then(m => m.ProductListComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./features/menu/main-menu.component')
          .then(m => m.MainMenuComponent)
      },
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
