'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { ProjectItem, ProjectFilterStatus, CreateProjectPayload } from '@/types/projects';

import { ProjectCard } from '@/components/ui/project-card';
import { ProjectToolbar } from '@/components/ui/project-toolbar';
import { ProjectFormModal } from '@/components/ui/project-form-modal';
import { ProjectDetailModal } from '@/components/ui/project-detail-modal';
import { ProjectDeleteModal } from '@/components/ui/project-delete-modal';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Velaris } from '@/components/ui/velaris';
import { Code2, ArrowLeft, RotateCcw, AlertCircle, CheckCircle2, FolderGit2, Plus, LogOut } from 'lucide-react';

import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectFilterStatus>('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      setProjects(res);
      setError(null);
    } catch {
      setError('Failed to load student projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    projectService
      .getProjects()
      .then((res) => {
        if (isMounted) {
          setProjects(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load student projects.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = async (payload: CreateProjectPayload) => {
    if (editingProject) {
      const updated = await projectService.updateProject(editingProject.id, payload);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(`Updated "${updated.title}" successfully`);
    } else {
      const created = await projectService.createProject(payload);
      setProjects((prev) => [created, ...prev]);
      showToast(`Added "${created.title}" to Project Vault`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      setIsDeleting(true);
      await projectService.deleteProject(deletingProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      showToast(`Deleted "${deletingProject.title}"`);
      setDeletingProject(null);
    } catch {
      showToast('Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = project.description.toLowerCase().includes(query);
        const techMatch = project.techStack.some((tech) => tech.toLowerCase().includes(query));
        if (!titleMatch && !descMatch && !techMatch) return false;
      }

      if (selectedStatus !== 'ALL') {
        if (project.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedStatus]);

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#14181C] flex flex-col font-sans selection:bg-[#2B333B] selection:text-white"
    >
      <AnimatedDashboardBackground />
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 bg-[#14181C] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 border border-[#6E7781] animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#E3F1EA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#CDD3D8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/overview"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#14181C] rounded-md p-1"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-8 h-8 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-xs">
                <Code2 className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-[#14181C] tracking-tight">DEVTRACK</span>
                <span className="text-[10px] font-mono font-bold text-[#4A535C] uppercase tracking-wider">
                  Project Vault Workspace
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/overview">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold border-[#CDD3D8] text-[#14181C] hover:bg-[#ECEFF1]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Overview
                  </Button>
                </motion.div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex text-xs font-semibold border-[#CDD3D8] text-[#14181C] hover:bg-[#ECEFF1]"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#30343A]" />
                  <span className="text-xs font-bold text-[#4A535C] uppercase tracking-wider">
                    Evidence Portfolio Vault
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14181C] tracking-tight">
                  Student Project Vault
                </h1>
                <p className="text-xs sm:text-sm text-[#2F363D] max-w-xl">
                  Maintain your software engineering projects, code repositories, live demos, and skill tags to verify your career readiness score.
                </p>
              </div>

              <div className="shrink-0">
                <ShimmerButton
                  onClick={handleOpenAdd}
                  className="text-xs font-bold bg-[#30343A] text-white hover:bg-[#202428] px-4 py-2 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add New Project</span>
                </ShimmerButton>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div className="space-y-6" role="status" aria-live="polite">
            <span className="sr-only">Loading student project vault...</span>
            <Skeleton className="h-20 w-full bg-[#ECEFF1] rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-56 bg-[#ECEFF1] rounded-2xl" />
              <Skeleton className="h-56 bg-[#ECEFF1] rounded-2xl" />
              <Skeleton className="h-56 bg-[#ECEFF1] rounded-2xl" />
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-[#FFFFFF] border border-[#8F2F2B] rounded-2xl text-center space-y-4 shadow-2xs"
            role="alert"
          >
            <AlertCircle className="w-10 h-10 text-[#8F2F2B] mx-auto" />
            <div>
              <h3 className="text-base font-bold text-[#14181C]">Failed to Load Projects</h3>
              <p className="text-xs text-[#2F363D] mt-1">{error}</p>
            </div>
            <Button
              variant="navy"
              onClick={fetchProjects}
              className="bg-[#2B333B] text-white hover:bg-[#1B2026]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Load
            </Button>
          </motion.div>
        )}

        {/* REAL PROJECTS WORKSPACE */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Toolbar: Search, Filters, Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <ProjectToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onAddProject={handleOpenAdd}
                totalFiltered={filteredProjects.length}
                totalProjects={projects.length}
                onResetFilters={handleResetFilters}
              />
            </motion.div>

            {/* EMPTY STATE: NO PROJECTS IN VAULT AT ALL */}
            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl text-center space-y-4 shadow-2xs"
              >
                <FolderGit2 className="w-12 h-12 text-[#4A535C] mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-[#14181C]">No Projects Yet</h3>
                  <p className="text-xs text-[#2F363D] mt-1 max-w-sm mx-auto">
                    Add your first project to start building your evidence portfolio and boosting your career readiness score.
                  </p>
                </div>
                <Button
                  variant="navy"
                  onClick={handleOpenAdd}
                  className="bg-[#30343A] text-white hover:bg-[#202428]"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Your First Project
                </Button>
              </motion.div>
            )}

            {/* EMPTY STATE: SEARCH / FILTER RETURNED 0 RESULTS */}
            {projects.length > 0 && filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl text-center space-y-3 shadow-2xs"
              >
                <AlertCircle className="w-10 h-10 text-[#4A535C] mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-[#14181C]">No Projects Match Your Filter</h3>
                  <p className="text-xs text-[#2F363D] max-w-sm mx-auto mt-1">
                    No projects match your current search query or status filter. Try resetting your filter settings.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="border-[#CDD3D8] text-[#14181C] hover:bg-[#ECEFF1]"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Clear Filters
                </Button>
              </motion.div>
            )}

            {/* PROJECT CARDS GRID COLLECTION */}
            {filteredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -3, scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProjectCard
                      project={project}
                      onView={setViewingProject}
                      onEdit={handleOpenEdit}
                      onDelete={setDeletingProject}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      <ProjectDetailModal
        isOpen={!!viewingProject}
        onClose={() => setViewingProject(null)}
        project={viewingProject}
        onEdit={handleOpenEdit}
      />

      <ProjectDeleteModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        project={deletingProject}
        deleting={isDeleting}
      />
    </Velaris>
  );
}

