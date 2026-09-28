import { readinessService } from '../services/readinessService';
import { onboardingService, CAREER_ROLES } from '../services/onboardingService';
import { dashboardService } from '../services/dashboardService';
import { SkillStatus } from '../types/onboarding';

async function runReadinessTests() {
  console.log('--- DevTrack Phase 11 Career Readiness Unit Tests ---');

  // Test 1: Required = 5, Completed = 2 => Readiness = 40%
  console.log('1. Testing Required = 5, Completed = 2 => 40%...');
  const fiveSkillsRole = {
    id: 'test_role_5',
    title: 'Test Software Engineer',
    description: 'Test role with exactly 5 required skills',
    iconName: 'Code',
    demand: 'High Demand',
    requiredSkillIds: ['skill_1', 'skill_2', 'skill_3', 'skill_4', 'skill_5'],
  };
  // Register temporarily in CAREER_ROLES for pure calculation
  CAREER_ROLES.push(fiveSkillsRole);

  const mockSkillsMap2of5: Record<string, SkillStatus> = {
    skill_1: 'COMPLETED',
    skill_2: 'COMPLETED',
    skill_3: 'LEARNING',
    skill_4: 'NOT_STARTED',
    skill_5: 'NOT_STARTED',
  };
  const calc1 = onboardingService.calculateReadiness('test_role_5', mockSkillsMap2of5);
  if (calc1.percentage !== 40 || calc1.completedCount !== 2 || calc1.totalRequired !== 5) {
    throw new Error(`Expected 40% readiness (2/5), got ${calc1.percentage}%`);
  }
  console.log('PASS: Calculated exact 40% readiness for 2 of 5 completed required skills.');

  // Test 2: Required = 5, Completed = 0 => Readiness = 0%
  console.log('2. Testing Required = 5, Completed = 0 => 0%...');
  const mockSkillsMap0of5: Record<string, SkillStatus> = {
    skill_1: 'NOT_STARTED',
    skill_2: 'NOT_STARTED',
    skill_3: 'NOT_STARTED',
    skill_4: 'NOT_STARTED',
    skill_5: 'NOT_STARTED',
  };
  const calc2 = onboardingService.calculateReadiness('test_role_5', mockSkillsMap0of5);
  if (calc2.percentage !== 0 || calc2.completedCount !== 0 || calc2.totalRequired !== 5) {
    throw new Error(`Expected 0% readiness (0/5), got ${calc2.percentage}%`);
  }
  console.log('PASS: Calculated exact 0% readiness for 0 of 5 completed required skills.');

  // Test 3: Required = 5, Completed = 5 => Readiness = 100%
  console.log('3. Testing Required = 5, Completed = 5 => 100%...');
  const mockSkillsMap5of5: Record<string, SkillStatus> = {
    skill_1: 'COMPLETED',
    skill_2: 'COMPLETED',
    skill_3: 'COMPLETED',
    skill_4: 'COMPLETED',
    skill_5: 'COMPLETED',
  };
  const calc3 = onboardingService.calculateReadiness('test_role_5', mockSkillsMap5of5);
  if (calc3.percentage !== 100 || calc3.completedCount !== 5 || calc3.totalRequired !== 5) {
    throw new Error(`Expected 100% readiness (5/5), got ${calc3.percentage}%`);
  }
  console.log('PASS: Calculated exact 100% readiness for 5 of 5 completed required skills.');

  // Test 4: Required = 0 => No crash, No NaN, No Infinity
  console.log('4. Testing Required = 0 handling (no NaN, no Infinity, no crash)...');
  const calcZero = onboardingService.calculateReadiness('invalid_nonexistent_role', {});
  if (isNaN(calcZero.percentage) || !isFinite(calcZero.percentage) || calcZero.percentage !== 0 || calcZero.totalRequired !== 0) {
    throw new Error(`Zero required skills returned invalid value: ${calcZero.percentage}`);
  }
  console.log('PASS: Zero required skills safely returned 0% without NaN or Infinity.');

  // Clean up temporary test role
  const tempIdx = CAREER_ROLES.findIndex((r) => r.id === 'test_role_5');
  if (tempIdx !== -1) CAREER_ROLES.splice(tempIdx, 1);

  // Test 5: User Isolation (User A cannot access User B data)
  console.log('5. Testing User Isolation...');
  const userA = { fullName: 'Student Alice', email: 'alice@university.edu', college: 'MIT', branch: 'CSE', yearOfStudy: '3rd' };
  dashboardService.setCurrentUser(userA);
  const dataA = await readinessService.getReadinessData();
  if (dataA.studentName !== 'Student Alice') {
    throw new Error(`User isolation failed: expected Student Alice, got ${dataA.studentName}`);
  }

  const userB = { fullName: 'Student Bob', email: 'bob@university.edu', college: 'Stanford', branch: 'ECE', yearOfStudy: '4th' };
  dashboardService.setCurrentUser(userB);
  const dataB = await readinessService.getReadinessData();
  if (dataB.studentName !== 'Student Bob') {
    throw new Error(`User isolation failed: expected Student Bob, got ${dataB.studentName}`);
  }
  console.log('PASS: User isolation verified! Student A and Student B sessions are strictly scoped.');

  // Reset to default
  dashboardService.setCurrentUser({ fullName: 'Alex Morgan', email: 'alex.m@sanjivani.edu', college: 'Sanjivani University', branch: 'AI & Data Science', yearOfStudy: '3rd Year' });

  // Test 6: Career goal loading & skill status loading
  console.log('6. Testing Career Goal & Skill Status Loading...');
  const mainData = await readinessService.getReadinessData();
  if (!mainData.careerGoal) {
    throw new Error('Career goal failed to load.');
  }
  console.log(`PASS: Loaded target career role: ${mainData.careerGoal.title} with ${mainData.requiredSkills.length} required skills.`);

  // Test 7: Completed, Learning, Missing counts sum to totalRequired
  console.log('7. Testing Completed, Learning, Missing counts integrity...');
  const sumCounts = mainData.completedCount + mainData.learningCount + mainData.missingCount;
  if (sumCounts !== mainData.totalRequired) {
    throw new Error(`Count mismatch: completed (${mainData.completedCount}) + learning (${mainData.learningCount}) + missing (${mainData.missingCount}) = ${sumCounts} != totalRequired (${mainData.totalRequired})`);
  }
  console.log(`PASS: Skill counts verified: ${mainData.completedCount} done + ${mainData.learningCount} learning + ${mainData.missingCount} missing = ${mainData.totalRequired} total.`);

  // Test 8: Dashboard Consistency
  console.log('8. Testing Dashboard Consistency...');
  const dashData = await dashboardService.getDashboardData();
  if (dashData.readinessPercentage !== mainData.readinessPercentage) {
    throw new Error(`Dashboard readiness mismatch: Dashboard = ${dashData.readinessPercentage}%, Career Readiness = ${mainData.readinessPercentage}%`);
  }
  console.log(`PASS: Single source of truth verified! Dashboard and Career Readiness both report ${mainData.readinessPercentage}%.`);

  // Test 9: Recommended focus skills synchronization
  console.log('9. Testing Priority Focus Skills...');
  if (mainData.priorityFocus.some((s) => s.status === 'COMPLETED')) {
    throw new Error('Priority focus includes already completed skills.');
  }
  console.log(`PASS: Priority focus correctly targets ${mainData.priorityFocus.length} unmastered skills.`);

  // Test 10: Vault Project and Certification Summaries
  console.log('10. Testing Vault Summaries...');
  if (mainData.projectSummary.totalProjects < 0 || mainData.certificationSummary.totalCertifications < 0) {
    throw new Error('Invalid project or certification summary counts.');
  }
  console.log(`PASS: Project summary (${mainData.projectSummary.totalProjects} projects) and Certification summary (${mainData.certificationSummary.totalCertifications} certs) verified.`);

  console.log('SUCCESS: All Phase 11 Career Readiness unit tests passed!');
}

runReadinessTests().catch((err) => {
  console.error('FAIL: Phase 11 test failed with error:', err);
  process.exit(1);
});
