import { Person, Department, Website, Application, MockData } from '../types/schema';

// Helper to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Helper to pick random item from array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Margaret', 'Anthony', 'Betty', 'Donald', 'Sandra', 'Mark', 'Ashley', 'Paul', 'Dorothy', 'Steven', 'Kimberly', 'Andrew', 'Emily', 'Kenneth', 'Donna', 'Joshua', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const departmentNames = [
  'Information Technology', 'Human Resources', 'Research & Development', 'Clinical Operations', 'Finance', 
  'Marketing & Communications', 'Facilities Management', 'Legal Affairs', 'Academic Affairs', 'Student Services',
  'Pathology', 'Radiology', 'Surgery', 'Pediatrics', 'Internal Medicine', 'Neurology', 'Oncology', 
  'Emergency Medicine', 'Pharmacy', 'Nursing Administration', 'Health Information Management', 'Biomedical Engineering',
  'Compliance & Audit', 'Patient Experience', 'Telemedicine'
];

// Generate 50 People
export const mockPeople: Person[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  firstName: pick(firstNames),
  lastName: pick(lastNames),
  departmentId: Math.floor(Math.random() * 25) + 100, // IDs 100-124
  managerId: Math.random() > 0.8 ? undefined : Math.floor(Math.random() * 50) + 1,
  lastContactDate: randomDate(new Date(2024, 0, 1), new Date(2025, 12, 31)),
  champion: pick(['No', 'In Progress', 'Yes', 'No', 'No']),
  levelAccessAccount: pick(['No', 'In Progress', 'On hold', 'Troubleshooting', 'Complete', 'Complete', 'No']),
  notes: Math.random() > 0.7 ? 'Generated mock person note.' : undefined
}));

// Generate 25 Departments
export const mockDepartments: Department[] = departmentNames.map((name, i) => ({
  id: 100 + i,
  name: name,
  headId: Math.floor(Math.random() * 50) + 1,
  managerId: Math.floor(Math.random() * 50) + 1,
  lastContactDate: randomDate(new Date(2025, 0, 1), new Date(2025, 12, 31)),
  championId: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 1 : undefined,
  websiteIds: [], // Will populate after websites are created
  applicationIds: [], // Will populate after apps are created
  notes: `Department of ${name}`
}));

// Generate 60 Websites
export const mockWebsites: Website[] = Array.from({ length: 60 }, (_, i) => {
  const deptId = 100 + Math.floor(Math.random() * 25);
  const site = {
    id: i + 1,
    departmentId: deptId,
    contactId: Math.floor(Math.random() * 50) + 1,
    managerId: Math.floor(Math.random() * 50) + 1,
    lastContactDate: randomDate(new Date(2025, 5, 1), new Date(2025, 12, 31)),
    owner: `${pick(firstNames)} ${pick(lastNames)}`,
    url: `https://${pick(['www', 'portal', 'intranet', 'secure', 'app', 'docs'])}.utmb.edu/${pick(['hr', 'it', 'research', 'clinical', 'patient', 'staff'])}/${i}`,
    archived: Math.random() > 0.9,
    accessibilityReviewed: Math.random() > 0.4,
    siteimproveScore: Math.floor(Math.random() * 40) + 60, // 60-100
    manualReview: Math.random() > 0.7,
    remediationPlan: Math.random() > 0.6 ? 'Pending audit review' : undefined,
    notes: Math.random() > 0.8 ? 'Legacy site, needs migration' : undefined
  };
  
  // Link back to department
  const dept = mockDepartments.find(d => d.id === deptId);
  if (dept) dept.websiteIds.push(site.id);
  
  return site;
});

// Generate 40 Applications
export const mockApplications: Application[] = Array.from({ length: 40 }, (_, i) => {
  const deptId = 100 + Math.floor(Math.random() * 25);
  const app = {
    id: i + 1,
    departmentId: deptId,
    contactName: `${pick(firstNames)} ${pick(lastNames)}`,
    vendorId: 500 + i,
    lastContactDate: randomDate(new Date(2025, 3, 1), new Date(2025, 12, 31)),
    vpatOrAcr: Math.random() > 0.3,
    url: `https://${pick(['app', 'cloud', 'saas', 'system'])}.vendor${i}.com`,
    notes: Math.random() > 0.5 ? 'Vendor contract renewal in 2026' : undefined
  };

  // Link back to department
  const dept = mockDepartments.find(d => d.id === deptId);
  if (dept) dept.applicationIds.push(app.id);

  return app;
});

export const mockData: MockData = {
  people: mockPeople,
  departments: mockDepartments,
  websites: mockWebsites,
  applications: mockApplications
};
