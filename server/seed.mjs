import { drizzle } from "drizzle-orm/mysql2";
import { departments, people, websites, applications } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

// Helper functions
const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Margaret', 'Anthony', 'Betty', 'Donald', 'Sandra', 'Mark', 'Ashley', 'Paul', 'Dorothy', 'Steven', 'Kimberly', 'Andrew', 'Emily', 'Kenneth', 'Donna', 'Joshua', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const departmentNames = [
  'Information Technology', 'Human Resources', 'Research & Development', 'Clinical Operations', 'Finance', 
  'Marketing & Communications', 'Facilities Management', 'Legal Affairs', 'Academic Affairs', 'Student Services',
  'Pathology', 'Radiology', 'Surgery', 'Pediatrics', 'Internal Medicine', 'Neurology', 'Oncology', 
  'Emergency Medicine', 'Pharmacy', 'Nursing Administration', 'Health Information Management', 'Biomedical Engineering',
  'Compliance & Audit', 'Patient Experience', 'Telemedicine'
];

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Insert Departments first (no foreign key dependencies)
  console.log('  → Inserting departments...');
  const deptData = departmentNames.map((name) => ({
    name: name,
    lastContactDate: randomDate(new Date(2025, 0, 1), new Date(2025, 12, 31)),
    notes: `Department of ${name}`
  }));
  await db.insert(departments).values(deptData);
  console.log(`  ✓ Inserted ${deptData.length} departments`);

  // 2. Insert People (references departments)
  console.log('  → Inserting people...');
  const peopleData = Array.from({ length: 50 }, () => ({
    firstName: pick(firstNames),
    lastName: pick(lastNames),
    departmentId: Math.floor(Math.random() * 25) + 1, // IDs 1-25
    lastContactDate: randomDate(new Date(2024, 0, 1), new Date(2025, 12, 31)),
    champion: pick(['No', 'In Progress', 'Yes', 'No', 'No']),
    levelAccessAccount: pick(['No', 'In Progress', 'On hold', 'Troubleshooting', 'Complete', 'Complete', 'No']),
    notes: Math.random() > 0.7 ? 'Generated mock person note.' : null
  }));
  await db.insert(people).values(peopleData);
  console.log(`  ✓ Inserted ${peopleData.length} people`);

  // 3. Insert Websites (references departments and people)
  console.log('  → Inserting websites...');
  const websiteData = Array.from({ length: 60 }, (_, i) => {
    const deptId = Math.floor(Math.random() * 25) + 1;
    const score = Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 60);
    return {
      url: `https://utmb-site-${i + 1}.edu`,
      departmentId: deptId,
      contactId: Math.floor(Math.random() * 50) + 1,
      managerId: Math.floor(Math.random() * 50) + 1,
      lastContactDate: randomDate(new Date(2025, 0, 1), new Date(2025, 12, 31)),
      ownerId: Math.floor(Math.random() * 50) + 1,
      archived: Math.random() > 0.9,
      accessibilityReviewed: Math.random() > 0.3,
      siteimproveScore: score,
      manualReview: Math.random() > 0.5,
      remediationPlan: score < 80 ? 'Needs accessibility improvements' : null,
      notes: Math.random() > 0.7 ? 'Generated website note.' : null
    };
  });
  await db.insert(websites).values(websiteData);
  console.log(`  ✓ Inserted ${websiteData.length} websites`);

  // 4. Insert Applications (references departments)
  console.log('  → Inserting applications...');
  const appData = Array.from({ length: 40 }, (_, i) => ({
    url: `https://app-${i + 1}.utmb.edu`,
    departmentId: Math.floor(Math.random() * 25) + 1,
    contactName: `${pick(firstNames)} ${pick(lastNames)}`,
    vendorId: Math.floor(Math.random() * 100) + 1,
    lastContactDate: randomDate(new Date(2025, 0, 1), new Date(2025, 12, 31)),
    vpatOrAcr: Math.random() > 0.5,
    notes: Math.random() > 0.7 ? 'Generated application note.' : null
  }));
  await db.insert(applications).values(appData);
  console.log(`  ✓ Inserted ${appData.length} applications`);

  console.log('✅ Database seeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
