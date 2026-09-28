export type CertificationFilterStatus = 'All' | 'Recent' | 'Expiring' | 'Expired';

export interface CertificationItem {
  id: string;
  studentId?: string;
  certificateName: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFile?: string; // Filename or file format description
  fileDataUrl?: string; // Original uploaded file data URL (PDF or Image)
  thumbnailUrl?: string; // Rendered PNG data URL of page 1 (for PDF) or image data URL (for PNG/JPG)
  skills: string[]; // Associated DevTrack skills
  isVerified: boolean;
  createdAt: string;
}

export interface CreateCertificationPayload {
  certificateName: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFile?: string;
  fileDataUrl?: string;
  thumbnailUrl?: string;
  skills: string[];
}

export interface UpdateCertificationPayload extends CreateCertificationPayload {
  id: string;
}
