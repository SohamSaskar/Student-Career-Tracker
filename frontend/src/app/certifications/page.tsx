'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificationItem, CertificationFilterStatus, CreateCertificationPayload } from '@/types/certifications';
import { certificationService } from '@/services/certificationService';
import { CertificationCard } from '@/components/ui/certification-card';
import { CertificationToolbar } from '@/components/ui/certification-toolbar';
import { CertificationFormModal } from '@/components/ui/certification-form-modal';
import { CertificationDetailModal } from '@/components/ui/certification-detail-modal';
import { CertificationDeleteModal } from '@/components/ui/certification-delete-modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Velaris } from '@/components/ui/velaris';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';

import { ArrowLeft, Code2, Award, ShieldCheck, RefreshCw, Plus, ChevronRight } from 'lucide-react';

import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      return certificationService.getCertifications();
    } catch {
      return [];
    }
  });
  const [loading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertificationFilterStatus>('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);

  const [detailCert, setDetailCert] = useState<CertificationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [deletingCert, setDeletingCert] = useState<CertificationItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Auto-dismissing small feedback notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      startTransition(() => setToastMessage(null));
    }, 3000);
  };

  const loadCertifications = () => {
    try {
      const data = certificationService.getCertifications();
      setCertifications(data);
    } catch {
      showToast('Failed to load certifications');
    }
  };

  // Filtered List
  const filteredCerts = certificationService.searchAndFilter(certifications, searchQuery, statusFilter);

  // Handlers
  const handleOpenAdd = () => {
    setEditingCert(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cert: CertificationItem) => {
    setEditingCert(cert);
    setIsFormOpen(true);
  };

  const handleOpenView = (cert: CertificationItem) => {
    setDetailCert(cert);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (cert: CertificationItem) => {
    setDeletingCert(cert);
    setIsDeleteOpen(true);
  };

  const handleSaveCert = async (payload: CreateCertificationPayload) => {
    if (editingCert) {
      await certificationService.updateCertification({
        ...payload,
        id: editingCert.id,
      });
      showToast('Updated ✓');
    } else {
      await certificationService.addCertification(payload);
      showToast('Saved ✓');
    }
    loadCertifications();
  };

  const handleDeleteConfirm = async (id: string) => {
    await certificationService.deleteCertification(id);
    showToast('Deleted ✓');
    loadCertifications();
  };

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#30343A] flex flex-col font-sans selection:bg-[#30343A] selection:text-white"
    >
      <AnimatedDashboardBackground />
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#CDD3D8] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/overview" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#30343A] rounded-lg p-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-8 h-8 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs">
                <Code2 className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-[#30343A] tracking-tight leading-none">DevTrack</span>
                <span className="text-[10px] font-bold text-[#7A838C]">Career Readiness Platform</span>
              </div>
            </Link>
            <Link href="/overview">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="sm" className="bg-[#FFFFFF] border-[#CDD3D8] hover:bg-[#ECEFF1] text-[#30343A] font-bold">
                  <ArrowLeft className="w-4 h-4 mr-1.5 text-[#5B6470]" /> Back to Overview
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="navy">Certification Vault</Badge>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#ECEFF1] text-[#30343A] border border-[#CDD3D8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3D7C63]" />
                    {certifications.length} Verified Credentials
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#30343A] tracking-tight">
                  Student Certifications & Industry Credentials
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#59616A] max-w-xl">
                  Maintain verified certificate uploads, industry licenses, and credential proofs for your career portfolio.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ShimmerButton
                  onClick={handleOpenAdd}
                  className="text-xs font-bold bg-[#30343A] text-white hover:bg-[#202428] px-4 py-2 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Upload Certificate</span>
                </ShimmerButton>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadCertifications}
                  className="border-[#CDD3D8] bg-[#FFFFFF] hover:bg-[#ECEFF1] text-[#30343A] font-bold p-2"
                  title="Refresh Certifications"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Toolbar: Search, Filters, Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <CertificationToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onAddClick={handleOpenAdd}
            totalCount={filteredCerts.length}
          />
        </motion.div>

        {/* Certificate Collection Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-80 w-full rounded-2xl bg-[#ECEFF1]" />
            <Skeleton className="h-80 w-full rounded-2xl bg-[#ECEFF1]" />
          </div>
        ) : filteredCerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-8 text-center space-y-4 shadow-2xs max-w-lg mx-auto my-8"
          >
            <div className="w-12 h-12 rounded-full bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5B6470]">
              <Award className="w-6 h-6" />
            </div>
            {searchQuery ? (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#30343A]">No certificates match your search query</h3>
                <p className="text-xs text-[#7A838C]">Try searching for a different certificate title or issuer name.</p>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="mt-2">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#30343A]">No certifications yet</h3>
                <p className="text-xs text-[#7A838C]">
                  Add your first certificate to keep your achievements organized and boost your career readiness score.
                </p>
                <Button
                  variant="navy"
                  size="sm"
                  onClick={handleOpenAdd}
                  className="bg-[#30343A] text-white hover:bg-[#202428] font-bold mt-2"
                >
                  Add Certification
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ y: -3, scale: 1.005 }}
                transition={{ duration: 0.2 }}
              >
                <CertificationCard
                  certification={cert}
                  onView={handleOpenView}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Auto-dismissing Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#30343A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-[#59616A] animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      <CertificationFormModal
        key={editingCert ? editingCert.id : isFormOpen ? 'new' : 'closed'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCert}
        editingCert={editingCert}
      />

      <CertificationDetailModal
        certification={detailCert}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <CertificationDeleteModal
        certification={deletingCert}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Velaris>
  );
}

