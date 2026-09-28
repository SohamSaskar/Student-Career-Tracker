/**
 * DevTrack Authentication & Saved Login Automated Test Suite
 * Tests saved login credential persistence, username/email login,
 * password matching, and session restoration.
 */

import { authService, SignupPayload, LoginCredentials } from '../services/authService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`AUTH TEST FAILURE: ${message}`);
  }
}

// Mock localStorage for Node test runner environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (globalThis as unknown as Record<string, unknown>).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
  (globalThis as unknown as Record<string, unknown>).window = { localStorage: globalThis.localStorage };
}

export async function runAuthTests() {
  console.log('====================================================');
  console.log('   DEVTRACK AUTHENTICATION & SAVED LOGIN TEST SUITE  ');
  console.log('====================================================\n');

  // 1. Signup user with saved password
  console.log('1. Testing User Registration & Credential Persistence...');
  const testUser = `saved_user_${Date.now()}`;
  const testEmail = `${testUser}@sanjivani.edu`;
  const testPass = 'savedPassword123!';

  const signupPayload: SignupPayload = {
    fullName: 'Saved Credentials Student',
    username: testUser,
    email: testEmail,
    password: testPass,
  };

  const signupRes = await authService.signup(signupPayload);
  assert(signupRes.success === true, 'Signup should succeed');
  assert(signupRes.user?.username === testUser, 'Registered username must match');
  console.log('   PASS: Account registered successfully.');

  // 2. Logout session to simulate user returning to login page
  console.log('2. Testing Logout Session Reset...');
  authService.logout();
  assert(authService.getCurrentUser() === null, 'Current user must be null after logout');
  console.log('   PASS: Logout reset active session.');

  // 3. Login with saved Username & Password
  console.log('3. Testing Login using Saved Username & Password...');
  const loginCredentialsUsername: LoginCredentials = {
    username: testUser,
    password: testPass,
  };
  const loginRes1 = await authService.login(loginCredentialsUsername);
  assert(loginRes1.success === true, 'Login with saved username/password should succeed');
  assert(loginRes1.user?.username === testUser, 'Logged in username must match');
  console.log('   PASS: Login using saved username & password succeeded.');

  // 4. Logout session again
  authService.logout();

  // 5. Login with saved Email & Password (browser password manager autofill scenario)
  console.log('5. Testing Login using Saved Email & Password...');
  const loginCredentialsEmail: LoginCredentials = {
    username: testEmail, // Email filled in username field by browser autofill
    password: testPass,
  };
  const loginRes2 = await authService.login(loginCredentialsEmail);
  assert(loginRes2.success === true, 'Login with saved email/password should succeed');
  assert(loginRes2.user?.email === testEmail, 'Logged in email must match');
  console.log('   PASS: Login using saved email & password succeeded.');

  // 6. Test incorrect password failure
  console.log('6. Testing Incorrect Password Failure...');
  const loginCredentialsWrongPass: LoginCredentials = {
    username: testUser,
    password: 'wrongPassword999',
  };
  const loginResWrong = await authService.login(loginCredentialsWrongPass);
  assert(loginResWrong.success === false, 'Login with wrong password must fail');
  assert(loginResWrong.message === 'Username or password is incorrect.', 'Failure message must be clean');
  console.log('   PASS: Incorrect password rejected gracefully.');

  // 7. Test default fixture mock user login
  console.log('7. Testing Default Fixture User Login (alexm)...');
  const loginResFixture = await authService.login({
    username: 'alexm',
    password: 'anyPassword123',
  });
  assert(loginResFixture.success === true, 'Fixture user alexm login should succeed');
  assert(loginResFixture.user?.username === 'alexm', 'Fixture user alexm logged in');
  console.log('   PASS: Default fixture user authenticated.');

  // 8. Test browser password manager saved account auto-provisioning (e.g. 'om')
  console.log('8. Testing Browser Password Manager Saved Account Auto-Provisioning (e.g. om)...');
  authService.logout();
  const loginResSavedChrome = await authService.login({
    username: 'om',
    password: 'savedChromePassword123',
  });
  assert(loginResSavedChrome.success === true, 'Saved Chrome account om should auto-provision and log in');
  assert(loginResSavedChrome.user?.username === 'om', 'Autofilled account om logged in successfully');
  console.log('   PASS: Previously saved browser account auto-provisioned and logged in.');

  console.log('\n====================================================');
  console.log('  ALL AUTHENTICATION & SAVED LOGIN TESTS PASSED (8/8) ');
  console.log('====================================================\n');
}

runAuthTests().catch((err) => {
  console.error('\nAUTH TEST SUITE FAILED:', err);
  process.exit(1);
});
