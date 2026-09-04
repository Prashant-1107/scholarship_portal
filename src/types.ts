export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  state?: string;
  major?: string;
  gpa?: number;
  familyIncome?: number;
  category?: 'General' | 'SC' | 'ST' | 'OBC' | 'Minority';
  expectedGraduationYear?: number;
  gender?: 'Male' | 'Female' | 'Other';
  isCAPFWard?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  type: string;
}

export type ScholarshipStatus = 'Ongoing' | 'Upcoming' | 'Closed';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  status: ScholarshipStatus;
  deadline: string; // ISO date string
  amount?: number;
  eligibility: {
    minGpa: number;
    maxIncome: number;
    states: string[]; // 'All' or specific states
    majors: string[]; // 'All' or specific majors
    categories?: string[];
    requiresCAPF?: boolean;
  };
  docsNeeded: string[];
  link: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  studentId: string;
  dateApplied: string;
  status: 'Pending' | 'Review' | 'Approved' | 'Rejected';
  adminRemarks: string;
}
