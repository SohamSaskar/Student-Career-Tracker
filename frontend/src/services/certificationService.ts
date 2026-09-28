import {
  CertificationItem,
  CreateCertificationPayload,
  UpdateCertificationPayload,
  CertificationFilterStatus,
} from '@/types/certifications';
import { generateSampleCertCanvas } from '@/utils/certThumbnail';

const CERTS_STORAGE_KEY = 'devtrack_student_certifications';
const DASHBOARD_CERTS_KEY = 'devtrack_student_certs';

const inMemoryCertsStorageMap: Record<string, string> = {};
let inMemoryActiveCertUserKey: string | null = null;

function getCurrentCertUserIdentifier(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = localStorage.getItem('devtrack_current_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        return u.username || u.email || (u.studentId ? String(u.studentId) : null);
      } catch {
        // fallback
      }
    }
  }
  return inMemoryActiveCertUserKey;
}

function getScopedCertKey(): string {
  const userId = getCurrentCertUserIdentifier();
  return userId ? `${CERTS_STORAGE_KEY}_${userId}` : CERTS_STORAGE_KEY;
}

export const certificationService = {
  setActiveUserIdentifier(id: string | null) {
    inMemoryActiveCertUserKey = id;
  },

  /**
   * Node / fallback storage synchronization helper
   */
  storageFallback(): string | null {
    const key = getScopedCertKey();
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || (key !== CERTS_STORAGE_KEY ? localStorage.getItem(CERTS_STORAGE_KEY) : null);
    }
    return inMemoryCertsStorageMap[key] || (key !== CERTS_STORAGE_KEY ? inMemoryCertsStorageMap[CERTS_STORAGE_KEY] : null) || null;
  },

  /**
   * Retrieves default realistic student certificates with rendered thumbnails
   */
  getDefaultCertifications(): CertificationItem[] {
    const javaThumb = generateSampleCertCanvas(
      'Oracle Certified Professional: Java SE 21',
      'Oracle Corporation',
      'Aug 2025',
      'ORACLE CERTIFIED PROFESSIONAL'
    );

    const awsThumb = generateSampleCertCanvas(
      'AWS Certified Solutions Architect – Associate',
      'Amazon Web Services',
      'Jan 2026',
      'AWS CERTIFIED'
    );

    return [
      {
        id: 'cert-1',
        certificateName: 'Oracle Certified Professional: Java SE 21',
        issuer: 'Oracle Corporation',
        issueDate: '2025-08-15',
        expiryDate: '2028-08-15',
        credentialId: 'OCP-JAVA21-984210',
        credentialUrl: 'https://education.oracle.com/verify/OCP-JAVA21-984210',
        certificateFile: 'oracle_java_se21_cert.pdf',
        thumbnailUrl: javaThumb,
        skills: ['Java', 'Spring Boot', 'SQL'],
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cert-2',
        certificateName: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2026-01-10',
        expiryDate: '2029-01-10',
        credentialId: 'AWS-SAA-304918',
        credentialUrl: 'https://aws.amazon.com/verification/AWS-SAA-304918',
        certificateFile: 'aws_solutions_architect.pdf',
        thumbnailUrl: awsThumb,
        skills: ['Docker', 'PostgreSQL', 'System Design'],
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];
  },

  /**
   * Syncs data to Dashboard certification key
   */
  syncToDashboard(certs: CertificationItem[]) {
    if (typeof window === 'undefined') return;

    const dashboardFormat = certs.map((c) => ({
      id: c.id,
      name: c.certificateName,
      issuer: c.issuer,
      issueDate: c.issueDate
        ? new Date(c.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Verified',
      fileName: c.certificateFile || 'certificate.pdf',
      isVerified: c.isVerified,
      thumbnailUrl: c.thumbnailUrl,
    }));

    try {
      const key = getScopedCertKey();
      const dashKey = key === CERTS_STORAGE_KEY ? DASHBOARD_CERTS_KEY : `${DASHBOARD_CERTS_KEY}_${getCurrentCertUserIdentifier()}`;
      localStorage.setItem(dashKey, JSON.stringify(dashboardFormat));
      if (key === CERTS_STORAGE_KEY) {
        localStorage.setItem(DASHBOARD_CERTS_KEY, JSON.stringify(dashboardFormat));
      }
    } catch {
      // Ignore quota error if base64 images are large
    }
  },

  /**
   * Fetches all certifications for the active student
   */
  getCertifications(): CertificationItem[] {
    const key = getScopedCertKey();
    let raw: string | null = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      raw = localStorage.getItem(key) || (key !== CERTS_STORAGE_KEY ? localStorage.getItem(CERTS_STORAGE_KEY) : null);
    } else {
      raw = this.storageFallback();
    }

    if (!raw) {
      const defaults = this.getDefaultCertifications();
      const stringified = JSON.stringify(defaults);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, stringified);
        if (key === CERTS_STORAGE_KEY) localStorage.setItem(CERTS_STORAGE_KEY, stringified);
        this.syncToDashboard(defaults);
      } else {
        inMemoryCertsStorageMap[key] = stringified;
        if (key === CERTS_STORAGE_KEY) inMemoryCertsStorageMap[CERTS_STORAGE_KEY] = stringified;
      }

      return defaults;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  /**
   * Fetches details of a specific certificate by ID
   */
  getCertificationById(id: string): CertificationItem | null {
    const certs = this.getCertifications();
    return certs.find((c) => c.id === id) || null;
  },

  /**
   * Saves certifications array to storage
   */
  saveCertifications(certs: CertificationItem[]) {
    const dataStr = JSON.stringify(certs);
    const key = getScopedCertKey();

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, dataStr);
      if (key === CERTS_STORAGE_KEY) localStorage.setItem(CERTS_STORAGE_KEY, dataStr);
      this.syncToDashboard(certs);
    } else {
      inMemoryCertsStorageMap[key] = dataStr;
      if (key === CERTS_STORAGE_KEY) inMemoryCertsStorageMap[CERTS_STORAGE_KEY] = dataStr;
    }
  },

  /**
   * Adds a new certification
   */
  async addCertification(payload: CreateCertificationPayload): Promise<CertificationItem> {
    const certs = this.getCertifications();

    // Generate fallback visual thumbnail if missing
    let thumbnail = payload.thumbnailUrl;
    if (!thumbnail) {
      thumbnail = generateSampleCertCanvas(
        payload.certificateName,
        payload.issuer,
        payload.issueDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        'VERIFIED CERTIFICATE'
      );
    }

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      certificateName: payload.certificateName,
      issuer: payload.issuer,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
      credentialId: payload.credentialId,
      credentialUrl: payload.credentialUrl,
      certificateFile: payload.certificateFile || 'uploaded_certificate.pdf',
      fileDataUrl: payload.fileDataUrl,
      thumbnailUrl: thumbnail,
      skills: payload.skills.length > 0 ? payload.skills : ['Java', 'SQL'],
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCert, ...certs];
    this.saveCertifications(updated);
    return newCert;
  },

  /**
   * Updates an existing certification
   */
  async updateCertification(payload: UpdateCertificationPayload): Promise<CertificationItem> {
    const certs = this.getCertifications();
    const index = certs.findIndex((c) => c.id === payload.id);

    if (index === -1) {
      throw new Error(`Certification with ID ${payload.id} not found.`);
    }

    const existing = certs[index];

    let thumbnail = payload.thumbnailUrl || existing.thumbnailUrl;
    if (!thumbnail) {
      thumbnail = generateSampleCertCanvas(
        payload.certificateName,
        payload.issuer,
        payload.issueDate || 'Verified',
        'UPDATED CERTIFICATE'
      );
    }

    const updatedItem: CertificationItem = {
      ...existing,
      certificateName: payload.certificateName,
      issuer: payload.issuer,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
      credentialId: payload.credentialId,
      credentialUrl: payload.credentialUrl,
      certificateFile: payload.certificateFile || existing.certificateFile,
      fileDataUrl: payload.fileDataUrl || existing.fileDataUrl,
      thumbnailUrl: thumbnail,
      skills: payload.skills,
    };

    certs[index] = updatedItem;
    this.saveCertifications(certs);
    return updatedItem;
  },

  /**
   * Deletes a certification by ID
   */
  async deleteCertification(id: string): Promise<void> {
    const certs = this.getCertifications();
    const filtered = certs.filter((c) => c.id !== id);
    this.saveCertifications(filtered);
  },

  /**
   * Searches and filters certifications
   */
  searchAndFilter(
    certs: CertificationItem[],
    searchQuery: string,
    statusFilter: CertificationFilterStatus
  ): CertificationItem[] {
    const today = new Date();
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    return certs.filter((cert) => {
      // 1. Partial case-insensitive Search matching on name, issuer, and skills
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cert.certificateName.toLowerCase().includes(query);
        const matchesIssuer = cert.issuer.toLowerCase().includes(query);
        const matchesSkill = cert.skills.some((s) => s.toLowerCase().includes(query));

        if (!matchesName && !matchesIssuer && !matchesSkill) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter === 'All') return true;

      if (statusFilter === 'Recent') {
        if (!cert.issueDate) return true;
        const issued = new Date(cert.issueDate);
        return issued >= sixMonthsAgo;
      }

      if (statusFilter === 'Expiring') {
        if (!cert.expiryDate) return false;
        const expiry = new Date(cert.expiryDate);
        return expiry >= today && expiry <= next60Days;
      }

      if (statusFilter === 'Expired') {
        if (!cert.expiryDate) return false;
        const expiry = new Date(cert.expiryDate);
        return expiry < today;
      }

      return true;
    });
  },
};
