export interface Document {
  _id: string;
  title: string;
  description: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category: 'invoice' | 'contract' | 'report' | 'presentation' | 'other';
  tags: string[];
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isPublic: boolean;
  downloadCount: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: Document;
}

export interface DocumentsResponse {
  success: boolean;
  count: number;
  total: number;
  pages: number;
  currentPage: number;
  data: Document[];
}