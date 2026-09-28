/**
 * Phase 8 Learning Roadmap Automated Test Suite
 * Tests data fetching, readiness calculation, status updating, filtering, and cross-page state synchronization.
 */

import { roadmapService } from '../services/roadmapService';
import { onboardingService } from '../services/onboardingService';
import { OnboardingPayload } from '../types/onboarding';

async function runRoadmapTestSuite() {
  console.log('--- DevTrack Phase 8 Learning Roadmap Unit Tests ---');

  // Setup initial onboarding mock session
  const mockPayload: OnboardingPayload = {
    careerRoleId: 'backend',
    studentSkills: {
      java: 'COMPLETED',
      sql: 'COMPLETED',
      git: 'LEARNING',
      rest_api: 'NOT_STARTED',
      spring_boot: 'NOT_STARTED',
      docker: 'NOT_STARTED',
    },
    profile: {
      fullName: 'Sanjivani Student',
      college: 'Sanjivani University',
      branch: 'Computer Science',
      year: '3rd Year',
    },
  };

  await onboardingService.submitOnboarding(mockPayload);

  // 1. Fetch initial roadmap data
  console.log('1. Testing Roadmap Data Fetch...');
  const initialData = await roadmapService.getRoadmapData();

  if (!initialData.careerGoal || initialData.careerGoal.id !== 'backend') {
    throw new Error('FAILED: Career Goal for backend developer was not fetched correctly.');
  }
  console.log(`PASS: Career Goal fetched: ${initialData.careerGoal.title}`);

  // 2. Verify readiness percentage calculation
  console.log('2. Verifying Readiness Calculation...');
  // 2 completed out of 6 required = 33%
  const expectedPercentage = 33;
  if (initialData.readinessPercentage !== expectedPercentage) {
    throw new Error(`FAILED: Expected readiness ${expectedPercentage}%, got ${initialData.readinessPercentage}%`);
  }
  console.log(`PASS: Readiness percentage matches algorithm (${initialData.readinessPercentage}%)`);

  // 3. Verify total required, completed, learning, and missing counts
  console.log('3. Verifying Skill Counts...');
  if (
    initialData.totalRequired !== 6 ||
    initialData.completedCount !== 2 ||
    initialData.learningCount !== 1 ||
    initialData.missingCount !== 3
  ) {
    throw new Error('FAILED: Skill counts breakdown mismatch.');
  }
  console.log(
    `PASS: Total: ${initialData.totalRequired}, Completed: ${initialData.completedCount}, Learning: ${initialData.learningCount}, Missing: ${initialData.missingCount}`
  );

  // 4. Test skill status update & cross-page synchronization
  console.log('4. Testing Skill Status Update (Git: LEARNING -> COMPLETED)...');
  const updatedData = await roadmapService.updateSkillStatus('git', 'COMPLETED');

  // 3 completed out of 6 required = 50%
  if (updatedData.completedCount !== 3 || updatedData.readinessPercentage !== 50) {
    throw new Error(
      `FAILED: Status update did not sync readiness. Expected 50%, got ${updatedData.readinessPercentage}%`
    );
  }
  console.log(`PASS: Status updated successfully! New Readiness: ${updatedData.readinessPercentage}%`);

  // 5. Verify Next Focus list update
  console.log('5. Verifying Next Focus List Update...');
  if (updatedData.nextFocusSkills.length === 0) {
    throw new Error('FAILED: Next focus skills list should not be empty.');
  }
  console.log(`PASS: Next focus skills count: ${updatedData.nextFocusSkills.length}`);

  // 6. Test search filter matching
  console.log('6. Testing Search Query Filtering...');
  const searchMatch = updatedData.skills.filter((s) => s.name.toLowerCase().includes('spring'));
  if (searchMatch.length === 0 || searchMatch[0].id !== 'spring_boot') {
    throw new Error('FAILED: Search query filtering for "spring" failed.');
  }
  console.log(`PASS: Search query matching verified: ${searchMatch[0].name}`);

  console.log('SUCCESS: All Phase 8 Learning Roadmap unit tests passed!');
}

runRoadmapTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
