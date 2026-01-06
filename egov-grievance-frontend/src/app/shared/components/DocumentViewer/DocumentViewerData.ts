import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GrievanceDocument } from '../../../core/models/document.model';

export interface DocumentViewerData {
  document: GrievanceDocument;
}

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="document-viewer-container">
      <!-- Header -->
      <div class="viewer-header">
        <h2>{{ data.document.fileName }}</h2>
        <button mat-icon-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="viewer-content">
        <!-- PDF Viewer -->
        <div *ngIf="isPdf()" class="pdf-viewer">
          <iframe [src]="getDocumentUrl() | safe" class="pdf-frame"></iframe>
        </div>

        <!-- Image Viewer -->
        <div *ngIf="isImage()" class="image-viewer">
          <img [src]="getDocumentUrl()" alt="{{ data.document.fileName }}" />
        </div>

        <!-- Unsupported Format -->
        <div *ngIf="!isPdf() && !isImage()" class="unsupported-viewer">
          <mat-icon>description</mat-icon>
          <p>Preview not available for {{ getFileExtension() }} files</p>
          <p class="file-info">
            {{ data.document.fileName }} ({{ (data.document.fileSize / 1024).toFixed(2) }} KB)
          </p>
          <button mat-raised-button color="primary" (click)="downloadDocument()">
            <mat-icon>download</mat-icon>
            Download File
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="viewer-footer">
        <span class="file-info">
          {{ data.document.fileSize / 1024 | number : '1.2-2' }} KB | {{ data.document.fileType }}
        </span>
        <button mat-button (click)="downloadDocument()">
          <mat-icon>download</mat-icon>
          Download
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .document-viewer-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 90vh;
      }

      .viewer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #f5f5f5;

        h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
      }

      .viewer-content {
        flex: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fafafa;
        min-height: 400px;
      }

      .pdf-viewer {
        width: 100%;
        height: 100%;
      }

      .pdf-frame {
        width: 100%;
        height: 100%;
        border: none;
      }

      .image-viewer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }

      .unsupported-viewer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #999;
          margin-bottom: 16px;
        }

        p {
          margin: 8px 0;
          color: #666;

          &.file-info {
            font-size: 12px;
            color: #999;
            margin-top: 16px;
          }
        }
      }

      .viewer-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-top: 1px solid #e0e0e0;
        background-color: #f5f5f5;

        .file-info {
          font-size: 12px;
          color: #666;
        }
      }

      @media (max-width: 600px) {
        .document-viewer-container {
          max-height: 100vh;
        }

        .viewer-header h2 {
          font-size: 16px;
        }
      }
    `,
  ],
})
export class DocumentViewerComponent {
  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentViewerData
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  isPdf(): boolean {
    return this.data.document.fileType === 'application/pdf';
  }

  isImage(): boolean {
    return this.data.document.fileType.startsWith('image/');
  }

  getDocumentUrl(): string {
    return `data:${this.data.document.fileType};base64,${this.data.document.fileDataBase64}`;
  }

  getFileExtension(): string {
    const parts = this.data.document.fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'UNKNOWN';
  }

  downloadDocument(): void {
    const linkSource = `data:${this.data.document.fileType};base64,${this.data.document.fileDataBase64}`;
    const link = document.createElement('a');
    link.href = linkSource;
    link.download = this.data.document.fileName;
    link.click();
  }
}
