import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../model/document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="document-list">
      <div class="header-section">
        <h1>Documents</h1>
        <div class="header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search documents..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="searchDocuments()">
          </div>
          <a routerLink="/upload" class="btn btn-primary">
            <i class="fas fa-plus"></i> Upload Document
          </a>
        </div>
      </div>
      
      <div class="filters-section">
        <div class="filter-group">
          <label>Category:</label>
          <select [(ngModel)]="selectedCategory" (change)="filterDocuments()">
            <option value="all">All Categories</option>
            <option value="invoice">Invoice</option>
            <option value="contract">Contract</option>
            <option value="report">Report</option>
            <option value="presentation">Presentation</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="tags-filter" *ngIf="availableTags.length > 0">
          <label>Filter by Tags:</label>
          <div class="tags-list">
            <span 
              *ngFor="let tag of availableTags" 
              class="tag"
              [class.active]="selectedTags.includes(tag)"
              (click)="toggleTag(tag)">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="documents-grid" *ngIf="documents.length > 0; else emptyState">
        <div class="document-card" *ngFor="let doc of documents">
          <div class="document-header">
            <i [class]="getFileIcon(doc.fileName)"></i>
            <div class="document-title">
              <h4>{{ doc.title }}</h4>
              <p class="description">{{ doc.description || 'No description' }}</p>
            </div>
            <div class="document-actions">
              <button class="btn-icon" (click)="downloadDocument(doc._id)" title="Download">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn-icon" [routerLink]="['/documents', doc._id]" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <div class="document-meta">
            <span class="category">{{ doc.category }}</span>
            <span class="size">{{ formatFileSize(doc.fileSize) }}</span>
            <span class="date">{{ formatDate(doc.createdAt) }}</span>
          </div>
          
          <div class="document-tags" *ngIf="doc.tags.length > 0">
            <span class="tag" *ngFor="let tag of doc.tags">{{ tag }}</span>
          </div>
          
          <div class="document-footer">
            <span class="uploader">
              <i class="fas fa-user"></i> {{ doc.uploadedBy.name }}
            </span>
            <span class="downloads">
              <i class="fas fa-download"></i> {{ doc.downloadCount }}
            </span>
          </div>
        </div>
      </div>
      
      <ng-template #emptyState>
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <h3>No documents found</h3>
          <p>Upload your first document to get started</p>
          <a routerLink="/upload" class="btn btn-primary">
            <i class="fas fa-cloud-upload-alt"></i> Upload Document
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .document-list {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .header-section h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .search-box {
      position: relative;
      width: 300px;
    }
    
    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    
    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #e1e5eb;
      border-radius: 6px;
      background: #f8f9fa;
      font-size: 1rem;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: #4361ee;
      background: white;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
    
    .btn-primary {
      background: #4361ee;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    
    .btn-primary:hover {
      background: #3a56d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
    }
    
    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .filter-group {
      margin-bottom: 1rem;
    }
    
    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .filter-group select {
      width: 100%;
      max-width: 300px;
      padding: 0.75rem;
      border: 1px solid #e1e5eb;
      border-radius: 6px;
      background: white;
      font-size: 1rem;
    }
    
    .tags-filter label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
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
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .tag:hover {
      background: #e9ecef;
    }
    
    .tag.active {
      background: #4361ee;
      color: white;
    }
    
    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .document-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s;
    }
    
    .document-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .document-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .document-header i {
      font-size: 2rem;
      margin-top: 0.25rem;
    }
    
    .document-title {
      flex: 1;
    }
    
    .document-title h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }
    
    .description {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .document-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .btn-icon:hover {
      background: #f8f9fa;
      color: #4361ee;
    }
    
    .document-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .category {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      text-transform: capitalize;
    }
    
    .document-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .document-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e1e5eb;
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .uploader, .downloads {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .empty-state i {
      font-size: 4rem;
      color: #e1e5eb;
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .empty-state p {
      color: #6c757d;
      margin-bottom: 2rem;
    }
    
    @media (max-width: 768px) {
      .document-list {
        padding: 1rem;
      }
      
      .header-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        width: 100%;
      }
      
      .documents-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  selectedTags: string[] = [];
  availableTags: string[] = [];
  
  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments(1, 20, this.selectedCategory, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.documents = response.data;
          this.extractTags();
        },
        error: (error) => {
          console.error('Error loading documents:', error);
        }
      });
  }

  extractTags(): void {
    const allTags = this.documents.flatMap(doc => doc.tags);
    this.availableTags = [...new Set(allTags)];
  }

  searchDocuments(): void {
    this.loadDocuments();
  }

  filterDocuments(): void {
    this.loadDocuments();
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    // Filter documents based on selected tags
    if (this.selectedTags.length > 0) {
      this.documents = this.documents.filter(doc => 
        this.selectedTags.some(tag => doc.tags.includes(tag))
      );
    } else {
      this.loadDocuments();
    }
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
}