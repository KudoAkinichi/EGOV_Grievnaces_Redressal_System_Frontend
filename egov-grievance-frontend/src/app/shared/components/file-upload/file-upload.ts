import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadResult } from './file-upload.model';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss'],
})
export class FileUploadComponent {
  @Input() multiple = false;
  @Input() accept = '*';
  @Output() fileSelected = new EventEmitter<FileUploadResult[]>();

  selectedFiles: FileUploadResult[] = [];
  errorMessage = '';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.errorMessage = '';
    const newFiles: FileUploadResult[] = [];

    Array.from(input.files).forEach((file) => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `File "${file.name}" is too large (max 5MB)`;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];

        const uploadResult: FileUploadResult = {
          fileName: file.name,
          fileType: file.type,
          fileDataBase64: base64,
          fileSize: file.size,
        };

        newFiles.push(uploadResult);

        // If all files are processed, update the list and emit
        if (newFiles.length === Array.from(input.files!).length) {
          if (this.multiple) {
            this.selectedFiles = [...this.selectedFiles, ...newFiles];
          } else {
            this.selectedFiles = [newFiles[0]];
          }
          this.fileSelected.emit(this.selectedFiles);
        }
      };

      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.fileSelected.emit(this.selectedFiles);
  }

  clearAll(): void {
    this.selectedFiles = [];
    this.fileSelected.emit(this.selectedFiles);
  }
}
