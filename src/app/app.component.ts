import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container" *ngIf="isAuthenticated(); else authLayout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <main class="content-wrapper">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
    
    <ng-template #authLayout>
      <div class="auth-container">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }
    
    .main-content {
      flex: 1;
      margin-left: 250px;
      display: flex;
      flex-direction: column;
    }
    
    .content-wrapper {
      flex: 1;
      padding: 2rem;
    }
    
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
      
      .content-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}