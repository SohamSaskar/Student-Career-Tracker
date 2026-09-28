import React, { useState } from 'react';
import Image from 'next/image';
import { CertificationItem, CreateCertificationPayload } from '@/types/certifications';
import { SKILLS_CATALOG } from '@/services/onboardingService';
import { generateCertThumbnail } from '@/utils/certThumbnail';
import { Modal } from './Modal';
import { Button } from './Button';
import { Upload, Check, FileText, Loader2 } from 'lucide-react';

interface CertificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateCertificationPayload) => Promise<void>;
  editingCert?: CertificationItem | null;
}

export function CertificationFormModal({
  isOpen,
  onClose,
  onSave,
  editingCert,
}: CertificationFormModalProps) {
  const [certificateName, setCertificateName] = useState(() => editingCert?.certificateName || '');
  const [issuer, setIssuer] = useState(() => editingCert?.issuer || '');
  const [issueDate, setIssueDate] = useState(() => editingCert?.issueDate || '');
  const [expiryDate, setExpiryDate] = useState(() => editingCert?.expiryDate || '');
  const [credentialId, setCredentialId] = useState(() => editingCert?.credentialId || '');
  const [credentialUrl, setCredentialUrl] = useState(() => editingCert?.credentialUrl || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    () => editingCert?.skills || ['Java', 'SQL']
  );

  const [fileName, setFileName] = useState(() => editingCert?.certificateFile || '');
  const [fileDataUrl, setFileDataUrl] = useState(() => editingCert?.fileDataUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(() => editingCert?.thumbnailUrl || '');

  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [errors, setErrors] = useState<{ certificateName?: string; issuer?: string; credentialUrl?: string; file?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // File Picker Handler with Live Thumbnail Generation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File size must be under 10MB.' }));
      return;
    }

    try {
      setGeneratingPreview(true);
      setErrors((prev) => ({ ...prev, file: undefined }));
      setFileName(file.name);

      const result = await generateCertThumbnail(file);
      setFileDataUrl(result.fileDataUrl);
      setThumbnailUrl(result.thumbnailUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate certificate preview.';
      setErrors((prev) => ({ ...prev, file: msg }));
    } finally {
      setGeneratingPreview(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: { certificateName?: string; issuer?: string; credentialUrl?: string; file?: string } = {};

    if (!certificateName || certificateName.trim() === '') {
      newErrors.certificateName = 'Certificate name is required.';
    }

    if (!issuer || issuer.trim() === '') {
      newErrors.issuer = 'Issuer is required.';
    }

    if (credentialUrl.trim() !== '') {
      const isValidUrl =
        credentialUrl.startsWith('http://') ||
        credentialUrl.startsWith('https://') ||
        credentialUrl.includes('.');
      if (!isValidUrl) {
        newErrors.credentialUrl = 'Please enter a valid credential URL (e.g., https://verify.org/123).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      let formattedUrl = credentialUrl.trim();
      if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      await onSave({
        certificateName: certificateName.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        credentialId: credentialId.trim() || undefined,
        credentialUrl: formattedUrl || undefined,
        certificateFile: fileName || 'uploaded_certificate.pdf',
        fileDataUrl: fileDataUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        skills: selectedSkills,
      });

      onClose();
    } catch {
      setErrors({ certificateName: 'Failed to save certificate. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCert ? 'Edit Certification' : 'Add New Certification'}
      description="Upload verified software engineering credentials, industry certificates, and exam completion proof."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting || generatingPreview}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || generatingPreview}
            className="bg-[#5B6470] text-white hover:bg-[#4E5763]"
          >
            {submitting ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save Certificate'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Certificate Name & Issuer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">
              Certificate Title <span className="text-[#B85C58]">*</span>
            </label>
            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="e.g., Oracle Certified Professional: Java SE 21"
              className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F4F5F6] text-[#30343A] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A] ${
                errors.certificateName ? 'border-[#B85C58]' : 'border-[#CDD3D8]'
              }`}
            />
            {errors.certificateName && <p className="text-[11px] font-semibold text-[#B85C58]">{errors.certificateName}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">
              Issuing Organization <span className="text-[#B85C58]">*</span>
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g., Oracle Corporation / AWS"
              className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F4F5F6] text-[#30343A] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A] ${
                errors.issuer ? 'border-[#B85C58]' : 'border-[#CDD3D8]'
              }`}
            />
            {errors.issuer && <p className="text-[11px] font-semibold text-[#B85C58]">{errors.issuer}</p>}
          </div>
        </div>

        {/* Issue Date & Expiry Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold bg-[#F4F5F6] text-[#30343A] border border-[#CDD3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold bg-[#F4F5F6] text-[#30343A] border border-[#CDD3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A]"
            />
          </div>
        </div>

        {/* Credential ID & Verification URL Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">Credential / License ID</label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g., OCP-JAVA21-984210"
              className="w-full px-3.5 py-2 text-xs font-medium bg-[#F4F5F6] text-[#30343A] border border-[#CDD3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#30343A] block">Verification URL</label>
            <input
              type="text"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://verify.oracle.com/cert/984210"
              className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F4F5F6] text-[#30343A] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30343A] ${
                errors.credentialUrl ? 'border-[#B85C58]' : 'border-[#CDD3D8]'
              }`}
            />
            {errors.credentialUrl && <p className="text-[11px] font-semibold text-[#B85C58]">{errors.credentialUrl}</p>}
          </div>
        </div>

        {/* FILE UPLOAD WITH INSTANT LIVE THUMBNAIL PREVIEW */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-[#30343A] block">
            Certificate Document (PDF, PNG, JPG)
          </label>

          <div className="border-2 border-dashed border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl p-4 bg-[#F4F5F6] text-center space-y-3 transition-colors">
            {thumbnailUrl ? (
              <div className="space-y-2">
                <div className="relative w-full h-36 bg-[#ECEFF1] rounded-lg border border-[#CDD3D8] flex items-center justify-center overflow-hidden">
                  <Image
                    src={thumbnailUrl}
                    alt="Uploaded certificate thumbnail preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#59616A] px-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <FileText className="w-4 h-4 text-[#5B6470]" />
                    {fileName || 'certificate_document'}
                  </span>
                  <label className="text-[#5B6470] hover:underline cursor-pointer font-bold">
                    Change File
                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : generatingPreview ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#5B6470] animate-spin" />
                <p className="text-xs font-bold text-[#30343A]">Rendering certificate preview...</p>
                <p className="text-[11px] text-[#7A838C]">Extracting page 1 visual thumbnail</p>
              </div>
            ) : (
              <label className="cursor-pointer block py-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5B6470]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#30343A]">Click to upload or drag & drop certificate file</p>
                  <p className="text-[11px] text-[#7A838C]">Supported formats: PDF, PNG, JPG, JPEG (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.file && <p className="text-[11px] font-semibold text-[#B85C58]">{errors.file}</p>}
        </div>

        {/* Associated Skills Catalog Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-[#30343A] block">
            Associated Skills & Competencies ({selectedSkills.length} Selected)
          </label>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#F4F5F6] border border-[#CDD3D8] rounded-lg">
            {SKILLS_CATALOG.map((skill) => {
              const isSelected = selectedSkills.includes(skill.name);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.name)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all tactile-press ${
                    isSelected
                      ? 'bg-[#5B6470] text-white font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#59616A] hover:bg-[#ECEFF1] border border-[#CDD3D8]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{skill.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
