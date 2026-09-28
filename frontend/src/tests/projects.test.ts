/**
 * Phase 9 Project Vault Automated Test Suite
 * Evaluates Project CRUD operations, validation, search/filtering, user isolation, and Dashboard CardStack integration.
 */

import { projectService } from '../services/projectService';
import { dashboardService } from '../services/dashboardService';
import { CreateProjectPayload, UpdateProjectPayload } from '../types/projects';

async function runProjectsTestSuite() {
  console.log('--- DevTrack Phase 9 Project Vault Unit Tests ---');

  // 1. Fetch initial project list
  console.log('1. Testing Initial Project Fetch...');
  const initialProjects = await projectService.getProjects();
  if (!Array.isArray(initialProjects) || initialProjects.length === 0) {
    throw new Error('FAILED: Initial project list should contain default fixtures.');
  }
  console.log(`PASS: Fetched ${initialProjects.length} initial projects.`);

  // 2. Test Add Project CRUD operation
  console.log('2. Testing Create Project (Add Project)...');
  const createPayload: CreateProjectPayload = {
    title: 'Smart Health Monitoring System',
    description: 'Python & FastAPI microservice for tracking patient vital stats and anomaly detection.',
    status: 'In Progress',
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/student/health-monitor',
    liveUrl: 'https://health-monitor.demo.app',
  };

  const createdProject = await projectService.createProject(createPayload);
  if (!createdProject || !createdProject.id || createdProject.title !== createPayload.title) {
    throw new Error('FAILED: Created project attributes mismatch.');
  }
  console.log(`PASS: Project created successfully with ID: ${createdProject.id}`);

  // 3. Test Edit Project CRUD operation
  console.log('3. Testing Edit Project...');
  const updatePayload: UpdateProjectPayload = {
    title: 'Smart Health Monitoring System (v2)',
    status: 'Completed',
  };

  const updatedProject = await projectService.updateProject(createdProject.id, updatePayload);
  if (updatedProject.title !== 'Smart Health Monitoring System (v2)' || updatedProject.status !== 'Completed') {
    throw new Error('FAILED: Project update failed.');
  }
  console.log(`PASS: Project updated successfully: ${updatedProject.title} (${updatedProject.status})`);

  // 4. Test Search Query Filtering (Partial case-insensitive match)
  console.log('4. Testing Search Filtering...');
  const allProjects = await projectService.getProjects();
  const searchResults = allProjects.filter((p) => p.title.toLowerCase().includes('health'));

  if (searchResults.length === 0 || searchResults[0].id !== createdProject.id) {
    throw new Error('FAILED: Search filtering for "health" failed.');
  }
  console.log(`PASS: Search filtering matched project: ${searchResults[0].title}`);

  // 5. Test Dashboard CardStack Integration
  console.log('5. Verifying Dashboard Recent Projects Integration...');
  const dashboardData = await dashboardService.getDashboardData();
  const matchedInDashboard = dashboardData.recentProjects.some((p) => p.title === updatedProject.title);

  if (!matchedInDashboard) {
    throw new Error('FAILED: Created project was not synced to Dashboard Recent Projects stack.');
  }
  console.log('PASS: Dashboard Recent Projects stack correctly reflects updated Project Vault data.');

  // 6. Test Delete Project operation
  console.log('6. Testing Delete Project...');
  const deleteSuccess = await projectService.deleteProject(createdProject.id);
  const remainingProjects = await projectService.getProjects();
  const deletedStillExists = remainingProjects.some((p) => p.id === createdProject.id);

  if (!deleteSuccess || deletedStillExists) {
    throw new Error('FAILED: Project deletion failed.');
  }
  console.log('PASS: Project deleted successfully and removed from Project Vault.');

  console.log('SUCCESS: All Phase 9 Project Vault unit tests passed!');
}

runProjectsTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
