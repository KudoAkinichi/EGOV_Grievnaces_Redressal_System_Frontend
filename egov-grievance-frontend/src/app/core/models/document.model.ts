import { UserRole } from '../enums/user-role.enum';

export interface GrievanceDocument {
  id: number;
  grievanceId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string; // Base64
  uploadedBy: number;
  uploadedByRole: UserRole;
  createdAt: string;
}

export interface UploadDocumentRequest {
  fileName: string;
  fileType: string;
  fileDataBase64: string;
}
