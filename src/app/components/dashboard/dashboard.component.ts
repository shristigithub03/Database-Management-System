import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../model/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Welcome to your document management system</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <i class="fas fa-file"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalDocuments || 0 }}</h3>
            <p>Total Documents</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">
            <i class="fas fa-download"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalDownloads || 0 }}</h3>
            <p>Total Downloads</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card">
            <div class="stat-icon warning">
              <i class="fas fa-hdd"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalSize || '0 MB' }}</h3>
              <p>Storage Used</p>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>1</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/upload" class="action-card">
            <div class="action-icon">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h4>Upload Document</h4>
            <p>Upload new files to the system</p>
          </a>
          
          <a routerLink="/documents" class="action-card">
            <div class="action-icon">
              <i class="fas fa-folder-open"></i>
            </div>
            <h4>View Documents</h4>
            <p>Browse and manage your documents</p>
          </a>
          
          <div class="action-card" (click)="performSearch()">
            <div class="action-icon">
              <i class="fas fa-search"></i>
            </div>
            <h4>Search Files</h4>
            <p>Find documents quickly</p>
          </div>
          
          <a routerLink="/profile" class="action-card">
            <div class="action-icon">
              <i class="fas fa-user-cog"></i>
            </div>
            <h4>Profile Settings</h4>
            <p>Manage your account settings</p>
          </a>
        </div>
      </div>
      
      <!-- Recent Documents -->
      <div class="recent-documents" *ngIf="recentDocuments.length > 0">
        <div class="section-header">
          <h2>Recent Documents</h2>
          <a routerLink="/documents" class="view-all">View All</a>
        </div>
        
        <div class="documents-table">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Category</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of recentDocuments">
                <td>
                  <div class="document-info">
                    <i [class]="getFileIcon(doc.fileName)"></i>
                    <div>
                      <strong>{{ doc.title }}</strong>
                      <small>{{ doc.description || 'No description' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" [class]="'badge-' + doc.category">
                    {{ doc.category }}
                  </span>
                </td>
                <td>{{ formatFileSize(doc.fileSize) }}</td>
                <td>{{ formatDate(doc.createdAt) }}</td>
                <td>
                  <button class="btn-icon" (click)="downloadDocument(doc._id)">
                    <i class="fas fa-download"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #6c757d;
      font-size: 1.1rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .stat-icon.primary {
      background: linear-gradient(135deg, #4361ee, #3a0ca3);
      color: white;
    }
    
    .stat-icon.success {
      background: linear-gradient(135deg, #4cc9f0, #3a86ff);
      color: white;
    }
    
    .stat-icon.warning {
      background: linear-gradient(135deg, #f8961e, #f3722c);
      color: white;
    }
    
    .stat-icon.info {
      background: linear-gradient(135deg, #7209b7, #560bad);
      color: white;
    }
    
    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
      color: #2c3e50;
    }
    
    .stat-content p {
      margin: 0;
      color: #6c757d;
    }
    
    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .quick-actions h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .action-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s;
      cursor: pointer;
      border: 2px solid transparent;
    }
    
    .action-card:hover {
      background: white;
      border-color: #4361ee;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(67, 97, 238, 0.1);
    }
    
    .action-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #4361ee, #3a0ca3);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: white;
      font-size: 1.25rem;
    }
    
    .action-card h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    .action-card p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .recent-documents {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .view-all {
      color: #4361ee;
      text-decoration: none;
      font-weight: 500;
    }
    
    .view-all:hover {
      text-decoration: underline;
    }
    
    .documents-table {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: #f8f9fa;
    }
    
    th {
      padding: 1rem;
      text-align: left;
      color: #2c3e50;
      font-weight: 600;
      border-bottom: 2px solid #e1e5eb;
    }
    
    td {
      padding: 1rem;
      border-bottom: 1px solid #e1e5eb;
    }
    
    .document-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .document-info i {
      font-size: 1.5rem;
    }
    
    .document-info div {
      display: flex;
      flex-direction: column;
    }
    
    .document-info strong {
      color: #2c3e50;
    }
    
    .document-info small {
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .badge-invoice {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .badge-contract {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    
    .badge-report {
      background: #e8f5e9;
      color: #388e3c;
    }
    
    .badge-presentation {
      background: #fff3e0;
      color: #f57c00;
    }
    
    .badge-other {
      background: #f5f5f5;
      color: #616161;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: #4361ee;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background 0.3s;
    }
    
    .btn-icon:hover {
      background: #f8f9fa;
    }
    
    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }
      
      .stats-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalDocuments: 0,
    totalDownloads: 0,
    totalSize: '0 MB'
  };
  
  recentDocuments: Document[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.documentService.getDocuments(1, 5).subscribe({
      next: (response) => {
        this.recentDocuments = response.data;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  calculateStats(): void {
    this.stats.totalDocuments = this.recentDocuments.length;
    this.stats.totalDownloads = this.recentDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0);
    
    const totalBytes = this.recentDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);
    this.stats.totalSize = this.formatFileSize(totalBytes);
  }

  getFileIcon(fileName: string): string {
    return this.documentService.getFileIcon(fileName);
  }

  formatFileSize(bytes: number): string {
    return this.documentService.formatFileSize(bytes);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  downloadDocument(id: string): void {
    this.documentService.downloadDocument(id);
  }

  performSearch(): void {
    // Navigate to search or open search modal
    console.log('Search functionality');
  }
}