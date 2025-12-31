import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../model/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-detail" *ngIf="document; else loading">
      <div class="detail-header">
        <button class="btn-back" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="downloadDocument()">
            <i class="fas fa-download"></i> Download
          </button>
          <button class="btn btn-primary" (click)="editDocument()">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>
      
      <div class="detail-card">
        <div class="document-header">
          <i [class]="getFileIcon(document.fileName)" class="file-icon"></i>
          <div class="document-info">
            <h1>{{ document.title }}</h1>
            <p class="description">{{ document.description || 'No description available' }}</p>
          </div>
        </div>
        
        <div class="document-meta-grid">
          <div class="meta-item">
            <label>File Name</label>
            <p>{{ document.originalName }}</p>
          </div>
          
          <div class="meta-item">
            <label>File Size</label>
            <p>{{ formatFileSize(document.fileSize) }}</p>
          </div>
          
          <div class="meta-item">
            <label>File Type</label>
            <p>{{ document.fileType }}</p>
          </div>
          
          <div class="meta-item">
            <label>Category</label>
            <span class="badge" [class]="'badge-' + document.category">
              {{ document.category }}
            </span>
          </div>
          
          <div class="meta-item">
            <label>Visibility</label>
            <p>
              <i class="fas" [class.fa-lock]="!document.isPublic" [class.fa-globe]="document.isPublic"></i>
              {{ document.isPublic ? 'Public' : 'Private' }}
            </p>
          </div>
          
          <div class="meta-item">
            <label>Downloads</label>
            <p>
              <i class="fas fa-download"></i>
              {{ document.downloadCount }}
            </p>
          </div>
          
          <div class="meta-item">
            <label>Uploaded By</label>
            <div class="uploader-info">
              <div class="avatar">{{ getUserInitials(document.uploadedBy.name) }}</div>
              <div>
                <p class="name">{{ document.uploadedBy.name }}</p>
                <p class="email">{{ document.uploadedBy.email }}</p>
              </div>
            </div>
          </div>
          
          <div class="meta-item">
            <label>Upload Date</label>
            <p>{{ formatDate(document.createdAt) }}</p>
          </div>
          
          <div class="meta-item">
            <label>Last Updated</label>
            <p>{{ formatDate(document.updatedAt) }}</p>
          </div>
        </div>
        
        <div class="tags-section" *ngIf="document.tags.length > 0">
          <h3>Tags</h3>
          <div class="tags-list">
            <span class="tag" *ngFor="let tag of document.tags">{{ tag }}</span>
          </div>
        </div>
        
        <div class="actions-section">
          <h3>Actions</h3>
          <div class="actions-grid">
            <button class="action-btn" (click)="downloadDocument()">
              <i class="fas fa-download"></i>
              <span>Download</span>
            </button>
            
            <button class="action-btn" (click)="shareDocument()">
              <i class="fas fa-share"></i>
              <span>Share</span>
            </button>
            
            <button class="action-btn" (click)="previewDocument()">
              <i class="fas fa-eye"></i>
              <span>Preview</span>
            </button>
            
            <button class="action-btn danger" (click)="deleteDocument()">
              <i class="fas fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ng-template #loading>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading document details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .document-detail {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .btn-back {
      background: none;
      border: none;
      color: #4361ee;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .btn-back:hover {
      background: #f8f9fa;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #5a6268;
    }
    
    .btn-primary {
      background: #4361ee;
      color: white;
    }
    
    .btn-primary:hover {
      background: #3a56d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
    }
    
    .detail-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .document-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e1e5eb;
    }
    
    .file-icon {
      font-size: 3rem;
    }
    
    .document-info h1 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }
    
    .description {
      color: #6c757d;
      margin: 0;
      line-height: 1.6;
    }
    
    .document-meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .meta-item label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.875rem;
    }
    
    .meta-item p {
      margin: 0;
      color: #6c757d;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
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
    
    .uploader-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4361ee, #3a0ca3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .name {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 0.25rem 0;
    }
    
    .email {
      color: #6c757d;
      font-size: 0.875rem;
      margin: 0;
    }
    
    .tags-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e1e5eb;
    }
    
    .tags-section h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tag {
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-radius: 20px;
      font-size: 0.875rem;
      color: #495057;
    }
    
    .actions-section h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .action-btn {
      background: white;
      border: 1px solid #e1e5eb;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .action-btn:hover {
      background: #f8f9fa;
      border-color: #4361ee;
      transform: translateY(-2px);
    }
    
    .action-btn i {
      font-size: 1.5rem;
      color: #4361ee;
    }
    
    .action-btn span {
      font-weight: 500;
      color: #2c3e50;
    }
    
    .action-btn.danger i {
      color: #dc3545;
    }
    
    .action-btn.danger:hover {
      border-color: #dc3545;
      background: #fff5f5;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 1rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4361ee;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .document-detail {
        padding: 1rem;
      }
      
      .detail-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      
      .header-actions {
        justify-content: flex-end;
      }
      
      .document-header {
        flex-direction: column;
        text-align: center;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    }
  }

  loadDocument(id: string): void {
    this.documentService.getDocument(id).subscribe({
      next: (response) => {
        this.document = response.data;
      },
      error: (error) => {
        console.error('Error loading document:', error);
        alert('Document not found');
        this.router.navigate(['/documents']);
      }
    });
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  downloadDocument(): void {
    if (this.document) {
      this.documentService.downloadDocument(this.document._id);
    }
  }

  editDocument(): void {
    alert('Edit functionality will be implemented soon!');
  }

  shareDocument(): void {
    alert('Share functionality will be implemented soon!');
  }

  previewDocument(): void {
    alert('Preview functionality will be implemented soon!');
  }

  deleteDocument(): void {
    if (this.document && confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(this.document._id).subscribe({
        next: () => {
          alert('Document deleted successfully');
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to delete document');
        }
      });
    }
  }
}