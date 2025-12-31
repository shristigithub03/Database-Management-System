import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>DMS Pro</span>
        </div>
      </div>
      
      <ul class="sidebar-nav">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a routerLink="/documents" routerLinkActive="active">
            <i class="fas fa-folder"></i>
            <span>Documents</span>
          </a>
        </li>
        <li>
          <a routerLink="/upload" routerLinkActive="active">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Upload</span>
          </a>
        </li>
        <li>
          <a routerLink="/search" routerLinkActive="active">
            <i class="fas fa-search"></i>
            <span>Search</span>
          </a>
        </li>
        <li class="mt-auto">
          <a routerLink="/profile" routerLinkActive="active">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
      color: white;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 100;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .logo i {
      font-size: 1.5rem;
    }
    
    .sidebar-nav {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-nav li {
      margin: 0.25rem 0;
    }
    
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.3s;
      border-left: 4px solid transparent;
    }
    
    .sidebar-nav a:hover {
      background: rgba(255,255,255,0.05);
      color: white;
      padding-left: 2rem;
    }
    
    .sidebar-nav a.active {
      background: rgba(255,255,255,0.1);
      color: white;
      border-left-color: #4361ee;
    }
    
    .sidebar-nav a i {
      width: 20px;
      text-align: center;
    }
    
    .sidebar-nav .mt-auto {
      margin-top: auto;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }
      
      .logo span,
      .sidebar-nav span {
        display: none;
      }
      
      .sidebar-nav a {
        justify-content: center;
        padding: 1rem;
      }
      
      .sidebar-nav a:hover {
        padding-left: 1rem;
      }
    }
  `]
})
export class SidebarComponent {}