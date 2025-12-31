import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="upload-container">
      <div class="upload-header">
        <h1>Upload Document</h1>
        <p>Upload files to your document management system</p>
      </div>
      
      <div class="upload-card">
        <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
          <!-- Document Information Section -->
          <div class="form-section">
            <h3>Document Information</h3>
            
            <div class="form-group">
              <label for="title">Document Title *</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title"
                class="form-control"
                placeholder="Enter document title">
              <div class="error" *ngIf="uploadForm.get('title')?.invalid && uploadForm.get('title')?.touched">
                Title is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description"
                class="form-control"
                rows="3"
                placeholder="Enter document description (optional)"></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" formControlName="category" class="form-control">
                  <option value="invoice">Invoice</option>
                  <option value="contract">Contract</option>
                  <option value="report">Report</option>
                  <option value="presentation">Presentation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="tags">Tags (comma separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  formControlName="tags"
                  class="form-control"
                  placeholder="invoice, report, important">
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isPublic">
                <span>Make this document public (visible to all users)</span>
              </label>
            </div>
          </div>
          
          <!-- File Selection Section -->
          <div class="form-section">
            <h3>File Selection</h3>
            
            <div 
              class="file-drop-area"
              [class.drag-over]="isDragOver"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)">
              
              <div class="file-drop-content" *ngIf="!selectedFile; else fileSelected">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <h4>Drop files here or click to browse</h4>
                <p>Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG</p>
                <p class="file-size">Max file size: 10MB</p>
                <button type="button" class="btn btn-outline" (click)="fileInput.click()">
                  Browse Files
                </button>
              </div>
              
              <ng-template #fileSelected>
                <div class="file-selected">
                  <i [class]="getFileIcon(selectedFile!.name)" class="file-icon"></i>
                  <div class="file-info">
                    <h4>{{ selectedFile!.name }}</h4>
                    <p>{{ formatFileSize(selectedFile!.size) }}</p>
                  </div>
                  <button type="button" class="btn-icon" (click)="removeFile()">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </ng-template>
              
              <input 
                type="file" 
                #fileInput
                (change)="onFileSelected($event)"
                hidden
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png">
            </div>
            
            <!-- Upload Progress -->
            <div class="upload-progress" *ngIf="uploadProgress > 0">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="uploadProgress"></div>
              </div>
              <div class="progress-text">
                Uploading: {{ uploadProgress }}%
              </div>
            </div>
            
            <!-- Error/Success Messages -->
            <div class="message error" *ngIf="errorMessage">
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage }}
            </div>
            
            <div class="message success" *ngIf="successMessage">
              <i class="fas fa-check-circle"></i>
              {{ successMessage }}
            </div>
          </div>
          
          <!-- Form Actions -->
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="router.navigate(['/documents'])">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="uploadForm.invalid || !selectedFile || loading">
              {{ loading ? 'Uploading...' : 'Upload Document' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .upload-header {
      margin-bottom: 2rem;
    }
    
    .upload-header h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .upload-header p {
      color: #6c757d;
      margin: 0;
    }
    
    .upload-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e1e5eb;
    }
    
    .form-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .form-section h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e1e5eb;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #4361ee;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: auto;
    }
    
    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .file-drop-area {
      border: 2px dashed #e1e5eb;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s;
      background: #f8f9fa;
      cursor: pointer;
    }
    
    .file-drop-area.drag-over {
      border-color: #4361ee;
      background: rgba(67, 97, 238, 0.05);
    }
    
    .upload-icon {
      font-size: 3rem;
      color: #4361ee;
      margin-bottom: 1rem;
    }
    
    .file-drop-content h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .file-drop-content p {
      color: #6c757d;
      margin-bottom: 0.5rem;
    }
    
    .file-size {
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      font-size: 1rem;
    }
    
    .btn-outline {
      background: white;
      border: 2px solid #4361ee;
      color: #4361ee;
    }
    
    .btn-outline:hover {
      background: #4361ee;
      color: white;
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
    
    .btn-primary:hover:not(:disabled) {
      background: #3a56d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
    }
    
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .file-selected {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #e1e5eb;
    }
    
    .file-icon {
      font-size: 2rem;
    }
    
    .file-info {
      flex: 1;
    }
    
    .file-info h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      word-break: break-all;
    }
    
    .file-info p {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .btn-icon:hover {
      background: #f8f9fa;
      color: #dc3545;
    }
    
    .upload-progress {
      margin-top: 1.5rem;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e1e5eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4361ee, #3a0ca3);
      transition: width 0.3s;
    }
    
    .progress-text {
      text-align: center;
      color: #4361ee;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .message {
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .message.error {
      background: #ffeaea;
      color: #dc3545;
      border: 1px solid #f8d7da;
    }
    
    .message.success {
      background: #e8f5e9;
      color: #28a745;
      border: 1px solid #d4edda;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .upload-container {
        padding: 1rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .form-actions {
        flex-direction: column-reverse;
      }
      
      .form-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isDragOver = false;
  loading = false;
  uploadProgress = 0;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    public router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['other'],
      tags: [''],
      isPublic: [false]
    });
  }

  // Drag and Drop Handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFileSelection(event.dataTransfer.files[0]);
    }
  }

  // File Selection Handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  handleFileSelection(file: File): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.errorMessage = 'File size exceeds 10MB limit';
      return;
    }
    
    // Validate file type
    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.jpg',
      '.jpeg',
      '.png'
    ];
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage = `File type not supported. Allowed types: ${allowedExtensions.join(', ')}`;
      return;
    }
    
    this.selectedFile = file;
    
    // Set title from filename if title is empty
    if (!this.uploadForm.get('title')?.value) {
      const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      this.uploadForm.patchValue({ title });
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // File Icon Helper
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf text-danger',
      'doc': 'fas fa-file-word text-primary',
      'docx': 'fas fa-file-word text-primary',
      'xls': 'fas fa-file-excel text-success',
      'xlsx': 'fas fa-file-excel text-success',
      'ppt': 'fas fa-file-powerpoint text-warning',
      'pptx': 'fas fa-file-powerpoint text-warning',
      'txt': 'fas fa-file-alt text-secondary',
      'jpg': 'fas fa-file-image text-info',
      'jpeg': 'fas fa-file-image text-info',
      'png': 'fas fa-file-image text-info'
    };
    
    return iconMap[ext] || 'fas fa-file text-secondary';
  }

  // File Size Formatter
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Form Submission
  onSubmit(): void {
    if (this.uploadForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.uploadForm.markAllAsTouched();
      return;
    }
    
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }
    
    this.loading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Simulate upload progress (in real app, this would come from HTTP event)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 300);
    
    // Prepare form data
    const formData = {
      ...this.uploadForm.value,
      tags: this.uploadForm.value.tags 
        ? this.uploadForm.value.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : []
    };
    
    // Upload document
    this.documentService.uploadDocument(this.selectedFile, formData)
      .subscribe({
        next: (response) => {
          clearInterval(progressInterval);
          this.uploadProgress = 100;
          this.successMessage = 'Document uploaded successfully!';
          
          // Reset form after successful upload
          setTimeout(() => {
            this.router.navigate(['/documents']);
          }, 1500);
        },
        error: (error) => {
          clearInterval(progressInterval);
          this.loading = false;
          this.uploadProgress = 0;
          this.errorMessage = error.error?.message || 'Upload failed. Please try again.';
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}