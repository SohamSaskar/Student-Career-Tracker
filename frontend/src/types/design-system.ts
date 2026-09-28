export type ComponentSize = 'sm' | 'md' | 'lg';

export type ButtonVariant = 'navy' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export type CardVariant = 'standard' | 'elevated' | 'interactive';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

export interface StudentProfileFixture {
  fullName: string;
  email: string;
  college: string;
  branch: string;
  yearOfStudy: string;
  targetRole: string;
}
