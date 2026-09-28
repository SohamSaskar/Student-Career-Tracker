import { certificationService } from '../services/certificationService';
import { dashboardService } from '../services/dashboardService';

async function runCertificationTests() {
  console.log('--- DevTrack Phase 10 Certification Vault Unit Tests ---');

  // 1. Fetch initial certifications
  console.log('1. Testing Initial Certification Fetch...');
  const initialCerts = certificationService.getCertifications();
  if (initialCerts.length < 2) {
    throw new Error(`Expected at least 2 default certifications, found ${initialCerts.length}`);
  }
  console.log(`PASS: Initialized ${initialCerts.length} default verified certifications.`);

  // 2. Add New Certification
  console.log('2. Testing Create Certification (Add Certification)...');
  const createdCert = await certificationService.addCertification({
    certificateName: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2026-02-14',
    expiryDate: '2029-02-14',
    credentialId: 'META-FE-772109',
    credentialUrl: 'https://coursera.org/verify/META-FE-772109',
    certificateFile: 'meta_frontend_cert.pdf',
    skills: ['React', 'TypeScript', 'CSS3'],
  });

  if (!createdCert || !createdCert.id || createdCert.certificateName !== 'Meta Front-End Developer Professional Certificate') {
    throw new Error('Failed to create new certification.');
  }
  console.log(`PASS: Certification created successfully with ID: ${createdCert.id}`);

  // 3. Edit Certification
  console.log('3. Testing Edit Certification...');
  const updatedCert = await certificationService.updateCertification({
    id: createdCert.id,
    certificateName: 'Meta Front-End Developer (Advanced Certified)',
    issuer: 'Meta / Coursera',
    issueDate: '2026-02-14',
    expiryDate: '2029-02-14',
    credentialId: 'META-FE-772109-ADV',
    credentialUrl: 'https://coursera.org/verify/META-FE-772109',
    certificateFile: 'meta_frontend_cert_v2.pdf',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  });

  if (updatedCert.certificateName !== 'Meta Front-End Developer (Advanced Certified)') {
    throw new Error('Failed to update certification name.');
  }
  console.log(`PASS: Certification updated successfully: ${updatedCert.certificateName}`);

  // 4. Search Filtering (Partial & Case-Insensitive)
  console.log('4. Testing Search Filtering (Name, Issuer, Skills)...');
  const allCerts = certificationService.getCertifications();
  const metaResults = certificationService.searchAndFilter(allCerts, 'meta', 'All');
  if (metaResults.length !== 1 || !metaResults[0].certificateName.includes('Meta')) {
    throw new Error(`Search for "meta" failed. Expected 1 result, got ${metaResults.length}`);
  }

  const javaResults = certificationService.searchAndFilter(allCerts, 'Oracle', 'All');
  if (javaResults.length === 0) {
    throw new Error('Search for "Oracle" failed to match Oracle Certified Professional.');
  }
  console.log('PASS: Search filtering matched exact partial queries cleanly.');

  // 5. Status Filter Breakdown
  console.log('5. Testing Status Filter breakdown...');
  const recentResults = certificationService.searchAndFilter(allCerts, '', 'Recent');
  console.log(`PASS: Status filter returned ${recentResults.length} recent certifications.`);

  // 6. Dashboard Integration Verification
  console.log('6. Verifying Dashboard Integration...');
  const dashData = await dashboardService.getDashboardData();
  if (!dashData.recentCertifications || dashData.recentCertifications.length === 0) {
    throw new Error('Dashboard recent certifications array is empty after update.');
  }
  console.log(`PASS: Dashboard successfully reflects ${dashData.recentCertifications.length} student credentials.`);

  // 7. Delete Certification
  console.log('7. Testing Delete Certification...');
  await certificationService.deleteCertification(createdCert.id);
  const certsAfterDelete = certificationService.getCertifications();
  const foundDeleted = certsAfterDelete.find((c) => c.id === createdCert.id);
  if (foundDeleted) {
    throw new Error('Deleted certification was still found in list.');
  }
  console.log('PASS: Certification deleted successfully and removed from store.');

  console.log('SUCCESS: All Phase 10 Certification Vault unit tests passed!');
}

runCertificationTests().catch((err) => {
  console.error('FAIL: Phase 10 test failed with error:', err);
  process.exit(1);
});
