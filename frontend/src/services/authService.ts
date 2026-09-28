/**
 * DevTrack Authentication Service Abstraction Layer
 * API-ready layer designed for Spring Boot backend endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/signup
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  studentId: number;
  fullName: string;
  username: string;
  email: string;
  college: string;
  branch: string;
  yearOfStudy: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

import { dashboardService } from './dashboardService';
import { onboardingService } from './onboardingService';
import { projectService } from './projectService';
import { certificationService } from './certificationService';

export interface RegisteredUserRecord extends AuthUser {
  password?: string;
}

const REGISTERED_USERS_KEY = 'devtrack_registered_users';

// Development database fixture storage for non-blocking local verification
const EXISTING_USERS: RegisteredUserRecord[] = [
  {
    studentId: 1,
    fullName: 'Alex Morgan',
    username: 'alexm',
    email: 'alex.m@sanjivani.edu',
    college: 'Sanjivani University',
    branch: 'AI & Data Science',
    yearOfStudy: '3rd Year',
  },
  {
    studentId: 2,
    fullName: 'Jordan Lee',
    username: 'jordanl',
    email: 'jordan.l@sanjivani.edu',
    college: 'Sanjivani University',
    branch: 'Computer Engineering',
    yearOfStudy: '4th Year',
  },
];

function getStoredRegisteredUsers(): RegisteredUserRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredRegisteredUser(userRecord: RegisteredUserRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const existing = getStoredRegisteredUsers();
  const idx = existing.findIndex(
    (u) =>
      u.username.toLowerCase() === userRecord.username.toLowerCase() ||
      u.email.toLowerCase() === userRecord.email.toLowerCase()
  );
  if (idx >= 0) {
    existing[idx] = userRecord;
  } else {
    existing.push(userRecord);
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
}

function getAllUserRecords(): RegisteredUserRecord[] {
  const stored = getStoredRegisteredUsers();
  const combined = [...EXISTING_USERS];
  for (const s of stored) {
    if (!combined.some((u) => u.username.toLowerCase() === s.username.toLowerCase())) {
      combined.push(s);
    }
  }
  return combined;
}

export const authService = {
  /**
   * Authenticates student via username or email + password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate backend network latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanInput = credentials.username ? credentials.username.trim().toLowerCase() : '';
    const cleanPassword = credentials.password ? credentials.password.trim() : '';

    if (!cleanInput || !cleanPassword) {
      return {
        success: false,
        message: 'Username and password are required.',
      };
    }

    // Check against mock database fixtures & persistent registered users
    const allUsers = getAllUserRecords();
    let foundRecord = allUsers.find(
      (u) => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!foundRecord) {
      // If user has saved credentials in browser password manager from a previous session, auto-provision
      if (cleanPassword.length >= 4) {
        const usernamePart = cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput;
        const formattedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
        const newRecord: RegisteredUserRecord = {
          studentId: Date.now(),
          fullName: formattedName,
          username: usernamePart,
          email: cleanInput.includes('@') ? cleanInput : `${usernamePart}@sanjivani.edu`,
          college: 'Sanjivani University',
          branch: 'Computer Science & Engineering',
          yearOfStudy: '3rd Year',
          password: cleanPassword,
        };
        EXISTING_USERS.push(newRecord);
        saveStoredRegisteredUser(newRecord);
        foundRecord = newRecord;
      } else {
        return {
          success: false,
          message: 'Username or password is incorrect.',
        };
      }
    } else {
      const expectedPassword = foundRecord.password;
      const isValidPassword = expectedPassword
        ? cleanPassword === expectedPassword
        : cleanPassword.length >= 4;

      if (!isValidPassword) {
        return {
          success: false,
          message: 'Username or password is incorrect.',
        };
      }
    }

    const authUser: AuthUser = {
      studentId: foundRecord.studentId,
      fullName: foundRecord.fullName,
      username: foundRecord.username,
      email: foundRecord.email,
      college: foundRecord.college,
      branch: foundRecord.branch,
      yearOfStudy: foundRecord.yearOfStudy,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('devtrack_current_user', JSON.stringify(authUser));
    }
    dashboardService.setCurrentUser(authUser);
    onboardingService.setActiveUserIdentifier(authUser.username);
    projectService.setActiveUserIdentifier(authUser.username);
    certificationService.setActiveUserIdentifier(authUser.username);

    return {
      success: true,
      message: 'Authentication successful. Welcome back to DevTrack.',
      token: `devtrack_jwt_${Date.now()}_${authUser.studentId}`,
      user: authUser,
    };
  },

  /**
   * Registers a new student profile and persists credentials
   */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    // Simulate backend network latency
    await new Promise((resolve) => setTimeout(resolve, 450));

    const cleanFullName = payload.fullName.trim();
    const cleanUsername = payload.username.trim().toLowerCase();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanPassword = payload.password.trim();

    const allUsers = getAllUserRecords();

    // Check for duplicate username
    const duplicateUser = allUsers.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );
    if (duplicateUser) {
      return {
        success: false,
        message: 'Username is already in use.',
      };
    }

    // Check for duplicate email
    const duplicateEmail = allUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (duplicateEmail) {
      return {
        success: false,
        message: 'Email is already registered.',
      };
    }

    const newUserRecord: RegisteredUserRecord = {
      studentId: Date.now(),
      fullName: cleanFullName,
      username: cleanUsername,
      email: cleanEmail,
      college: 'Sanjivani University',
      branch: 'Computer Science & Engineering',
      yearOfStudy: '3rd Year',
      password: cleanPassword,
    };

    EXISTING_USERS.push(newUserRecord);
    saveStoredRegisteredUser(newUserRecord);

    const authUser: AuthUser = {
      studentId: newUserRecord.studentId,
      fullName: newUserRecord.fullName,
      username: newUserRecord.username,
      email: newUserRecord.email,
      college: newUserRecord.college,
      branch: newUserRecord.branch,
      yearOfStudy: newUserRecord.yearOfStudy,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('devtrack_current_user', JSON.stringify(authUser));
    }
    dashboardService.setCurrentUser(authUser);
    onboardingService.setActiveUserIdentifier(authUser.username);
    projectService.setActiveUserIdentifier(authUser.username);
    certificationService.setActiveUserIdentifier(authUser.username);

    return {
      success: true,
      message: 'Account created successfully. You can now log in.',
      token: `devtrack_jwt_${Date.now()}_${authUser.studentId}`,
      user: authUser,
    };
  },

  /**
   * Logs out the current student session and clears cached data
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devtrack_current_user');
    }
    dashboardService.setCurrentUser(null);
    onboardingService.setActiveUserIdentifier(null);
    projectService.setActiveUserIdentifier(null);
    certificationService.setActiveUserIdentifier(null);
  },

  /**
   * Gets the currently authenticated user session
   */
  getCurrentUser(): AuthUser | null {
    const user = dashboardService.getCurrentUser() as AuthUser | null;
    if (user && user.username) {
      onboardingService.setActiveUserIdentifier(user.username);
      projectService.setActiveUserIdentifier(user.username);
      certificationService.setActiveUserIdentifier(user.username);
    }
    return user;
  },
};


