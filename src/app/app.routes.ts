import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'documents', 
    loadComponent: () => import('./components/document/document-list/document-list.component').then(m => m.DocumentListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./components/document/document-upload/document-upload.component').then(m => m.DocumentUploadComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'documents/:id', 
    loadComponent: () => import('./components/document/document-detail/document-detail.component').then(m => m.DocumentDetailComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];