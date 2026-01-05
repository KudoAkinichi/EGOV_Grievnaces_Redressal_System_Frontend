import { Component, EventEmitter, Output } from '@angular/core';
import { FileUploadResult } from './file-upload.model';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss'],
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<FileUploadResult>();

  selectedFile?: FileUploadResult;
  errorMessage = '';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Basic validation (optional)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'File size must be less than 5MB';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];

      this.selectedFile = {
        fileName: file.name,
        fileType: file.type,
        fileDataBase64: base64,
        fileSize: file.size,
      };

      this.errorMessage = '';
      this.fileSelected.emit(this.selectedFile);
    };

    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.selectedFile = undefined;
  }
}
