export type ChampionStatus = 'No' | 'In Progress' | 'Yes';
export type LevelAccessStatus = 'No' | 'In Progress' | 'On hold' | 'Troubleshooting' | 'Complete';

export interface Person {
  id: number; // Autonumber
  firstName: string; // Short text
  lastName: string; // Short text
  departmentId: number; // Lookup
  managerId?: number; // Lookup
  lastContactDate?: string; // Date
  champion: ChampionStatus; // Choice
  levelAccessAccount: LevelAccessStatus; // Choice
  notes?: string; // Long Text
}

export interface Department {
  id: number; // Department ID
  name: string; // Short text
  headId?: number; // Lookup (People)
  managerId?: number; // Lookup
  lastContactDate?: string; // Date
  championId?: number; // Lookup
  websiteIds: number[]; // Lookup (Websites)
  applicationIds: number[]; // Lookup (Applications)
  notes?: string; // Long Text
}

export interface Website {
  id: number; // Autonumber
  departmentId: number; // Lookup
  contactId?: number; // People Lookup
  managerId?: number; // ID Lookup
  lastContactDate?: string; // Date
  owner?: string; // Owner
  url?: string; // Website URL
  archived: boolean; // Y/N
  accessibilityReviewed: boolean; // Y/N
  siteimproveScore?: number; // number
  manualReview: boolean; // Y/N
  remediationPlan?: string; // Remidation plan
  notes?: string; // Long Text
}

export interface Application {
  id: number; // Autonumber
  departmentId: number; // Lookup
  contactName: string; // Text
  vendorId?: number; // ID Lookup
  lastContactDate?: string; // Date
  vpatOrAcr: boolean; // Y/N
  url?: string; // Website URL
  notes?: string; // Long Text
}

export interface MockData {
  people: Person[];
  departments: Department[];
  websites: Website[];
  applications: Application[];
}
