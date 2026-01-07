import { Person, Department, Website, Application, MockData } from '../types/schema';

export const mockPeople: Person[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    departmentId: 101,
    managerId: 2,
    lastContactDate: '2025-12-01',
    champion: 'Yes',
    levelAccessAccount: 'Complete',
    notes: 'Primary contact for IT accessibility.'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    departmentId: 101,
    lastContactDate: '2025-11-15',
    champion: 'In Progress',
    levelAccessAccount: 'In Progress',
    notes: 'Oversees departmental compliance.'
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Johnson',
    departmentId: 102,
    managerId: 4,
    lastContactDate: '2025-10-20',
    champion: 'No',
    levelAccessAccount: 'No',
    notes: 'Needs training on accessibility tools.'
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    departmentId: 102,
    lastContactDate: '2025-12-05',
    champion: 'Yes',
    levelAccessAccount: 'Complete',
    notes: 'Department head for HR.'
  },
  {
    id: 5,
    firstName: 'Michael',
    lastName: 'Brown',
    departmentId: 103,
    managerId: 6,
    lastContactDate: '2025-09-10',
    champion: 'In Progress',
    levelAccessAccount: 'Troubleshooting',
    notes: 'Experiencing login issues with Level Access.'
  },
  {
    id: 6,
    firstName: 'Sarah',
    lastName: 'Wilson',
    departmentId: 103,
    lastContactDate: '2025-11-30',
    champion: 'Yes',
    levelAccessAccount: 'Complete',
    notes: 'Research lead.'
  }
];

export const mockDepartments: Department[] = [
  {
    id: 101,
    name: 'Information Technology',
    headId: 2,
    managerId: 2,
    lastContactDate: '2025-12-10',
    championId: 1,
    websiteIds: [1, 2],
    applicationIds: [1],
    notes: 'Core infrastructure team.'
  },
  {
    id: 102,
    name: 'Human Resources',
    headId: 4,
    managerId: 4,
    lastContactDate: '2025-12-08',
    championId: 4,
    websiteIds: [3],
    applicationIds: [2],
    notes: 'Employee relations and benefits.'
  },
  {
    id: 103,
    name: 'Research & Development',
    headId: 6,
    managerId: 6,
    lastContactDate: '2025-11-25',
    championId: 6,
    websiteIds: [4],
    applicationIds: [3],
    notes: 'Clinical trials and academic research.'
  }
];

export const mockWebsites: Website[] = [
  {
    id: 1,
    departmentId: 101,
    contactId: 1,
    managerId: 2,
    lastContactDate: '2025-12-12',
    owner: 'IT Dept',
    url: 'https://it.utmb.edu',
    archived: false,
    accessibilityReviewed: true,
    siteimproveScore: 95,
    manualReview: true,
    remediationPlan: 'Minor contrast fixes pending.',
    notes: 'Main IT portal.'
  },
  {
    id: 2,
    departmentId: 101,
    contactId: 1,
    managerId: 2,
    lastContactDate: '2025-11-01',
    owner: 'IT Dept',
    url: 'https://helpdesk.utmb.edu',
    archived: false,
    accessibilityReviewed: true,
    siteimproveScore: 88,
    manualReview: false,
    remediationPlan: 'Scheduled for Q1 2026.',
    notes: 'Support ticketing system.'
  },
  {
    id: 3,
    departmentId: 102,
    contactId: 4,
    managerId: 4,
    lastContactDate: '2025-12-05',
    owner: 'HR Dept',
    url: 'https://hr.utmb.edu',
    archived: false,
    accessibilityReviewed: false,
    siteimproveScore: 72,
    manualReview: false,
    remediationPlan: 'Needs comprehensive audit.',
    notes: 'Employee handbook and benefits.'
  },
  {
    id: 4,
    departmentId: 103,
    contactId: 6,
    managerId: 6,
    lastContactDate: '2025-10-15',
    owner: 'Research Dept',
    url: 'https://research.utmb.edu',
    archived: false,
    accessibilityReviewed: true,
    siteimproveScore: 91,
    manualReview: true,
    remediationPlan: 'Complete.',
    notes: 'Public research publications.'
  }
];

export const mockApplications: Application[] = [
  {
    id: 1,
    departmentId: 101,
    contactName: 'John Doe',
    vendorId: 501,
    lastContactDate: '2025-12-01',
    vpatOrAcr: true,
    url: 'https://app.it-tools.com',
    notes: 'Network monitoring tool.'
  },
  {
    id: 2,
    departmentId: 102,
    contactName: 'Emily Davis',
    vendorId: 502,
    lastContactDate: '2025-11-20',
    vpatOrAcr: false,
    url: 'https://payroll.hr-systems.com',
    notes: 'Payroll processing. Vendor promised VPAT by Jan 2026.'
  },
  {
    id: 3,
    departmentId: 103,
    contactName: 'Sarah Wilson',
    vendorId: 503,
    lastContactDate: '2025-10-30',
    vpatOrAcr: true,
    url: 'https://lab-manager.science-tech.com',
    notes: 'Lab inventory management.'
  }
];

export const mockData: MockData = {
  people: mockPeople,
  departments: mockDepartments,
  websites: mockWebsites,
  applications: mockApplications
};
