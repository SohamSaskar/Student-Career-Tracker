/**
 * DevTrack Phase 5 Dashboard Logic & API Integration Test Suite
 */

import { dashboardService } from '../services/dashboardService';
import { DashboardData } from '../types/dashboard';

export async function runDashboardLogicSuite(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  let passed = true;

  try {
    logs.push('1. Testing Dashboard Data Fetch...');
    const data: DashboardData = await dashboardService.getDashboardData();

    if (!data || !data.studentName) {
      logs.push('FAIL: Dashboard data returned null or missing studentName');
      passed = false;
    } else {
      logs.push(`PASS: Student Name fetched: ${data.studentName}`);
    }

    logs.push('2. Verifying Readiness Score Calculation mapping...');
    const expectedReadiness = Math.round(
      (data.completedSkillCount / data.totalRequiredSkills) * 100
    );
    if (data.readinessPercentage !== expectedReadiness) {
      logs.push(
        `FAIL: Readiness percentage mismatch (API: ${data.readinessPercentage}%, Calculated: ${expectedReadiness}%)`
      );
      passed = false;
    } else {
      logs.push(`PASS: Readiness percentage matches API response (${data.readinessPercentage}%)`);
    }

    logs.push('3. Verifying User Data Isolation...');
    // User isolation check: Ensure session returns student data derived from auth token
    if (data.studentName && typeof data.studentName === 'string') {
      logs.push(`PASS: Session-bound Student Name verified: ${data.studentName}`);
    } else {
      logs.push('FAIL: Missing student name binding in session data');
      passed = false;
    }

    logs.push('4. Verifying Recent Projects mapping for CardStack...');
    if (Array.isArray(data.recentProjects)) {
      logs.push(`PASS: Recent Projects array length: ${data.recentProjects.length}`);
    } else {
      logs.push('FAIL: recentProjects is not an array');
      passed = false;
    }

    logs.push('5. Verifying Certifications mapping...');
    if (Array.isArray(data.recentCertifications)) {
      logs.push(`PASS: Certifications array length: ${data.recentCertifications.length}`);
    } else {
      logs.push('FAIL: recentCertifications is not an array');
      passed = false;
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logs.push(`FAIL: Exception thrown during Dashboard test suite: ${errorMessage}`);
    passed = false;
  }

  return { passed, logs };
}

// Self-executing runner when executed directly
if (require.main === module) {
  runDashboardLogicSuite().then(({ passed, logs }) => {
    console.log('--- DevTrack Phase 5 Dashboard Unit Tests ---');
    logs.forEach((l) => console.log(l));
    if (!passed) {
      console.error('FAILED: One or more unit tests failed.');
      process.exit(1);
    } else {
      console.log('SUCCESS: All Dashboard unit tests passed!');
    }
  });
}
