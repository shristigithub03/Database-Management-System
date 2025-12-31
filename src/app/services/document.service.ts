import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, UploadResponse, DocumentsResponse } from '../model/document.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, data: any): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('category', data.category || 'other');
    formData.append('tags', data.tags || '');
    formData.append('isPublic', data.isPublic || 'false');

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Observable<DocumentsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (category && category !== 'all') {
      params = params.set('category', category);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<DocumentsResponse>(this.apiUrl, { params });
  }

  getDocument(id: string): Observable<{ success: boolean; data: Document }> {
    return this.http.get<{ success: boolean; data: Document }>(`${this.apiUrl}/${id}`);
  }

  downloadDocument(id: string): void {
    window.open(`${this.apiUrl}/${id}/download`, '_blank');
  }

  updateDocument(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const iconMap: { [key: string]: string } = {
      'pdf': 'fa-file-pdf text-danger',
      'doc': 'fa-file-word text-primary',
      'docx': 'fa-file-word text-primary',
      'xls': 'fa-file-excel text-success',
      'xlsx': 'fa-file-excel text-success',
      'ppt': 'fa-file-powerpoint text-warning',
      'pptx': 'fa-file-powerpoint text-warning',
      'jpg': 'fa-file-image text-info',
      'jpeg': 'fa-file-image text-info',
      'png': 'fa-file-image text-info',
      'gif': 'fa-file-image text-info',
      'txt': 'fa-file-alt text-secondary',
      'zip': 'fa-file-archive text-secondary',
      'rar': 'fa-file-archive text-secondary'
    };
    
    return iconMap[ext] || 'fa-file text-secondary';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}