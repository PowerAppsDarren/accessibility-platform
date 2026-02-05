import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Departments table - organizational units within UTMB
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  departmentHeadId: int("departmentHeadId"), // References people.id
  managerId: int("managerId"), // References people.id
  lastContactDate: date("lastContactDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * People table - personnel records
 */
export const people = mysqlTable("people", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  departmentId: int("departmentId"), // References departments.id
  lastContactDate: date("lastContactDate"),
  champion: mysqlEnum("champion", ["No", "In Progress", "Yes"]).default("No"),
  levelAccessAccount: mysqlEnum("levelAccessAccount", [
    "No",
    "In Progress",
    "On hold",
    "Troubleshooting",
    "Complete"
  ]).default("No"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Person = typeof people.$inferSelect;
export type InsertPerson = typeof people.$inferInsert;

/**
 * Websites table - web properties managed by UTMB
 */
export const websites = mysqlTable("websites", {
  id: int("id").autoincrement().primaryKey(),
  url: varchar("url", { length: 500 }),
  departmentId: int("departmentId"), // References departments.id
  contactId: int("contactId"), // References people.id
  managerId: int("managerId"), // References people.id
  lastContactDate: date("lastContactDate"),
  ownerId: int("ownerId"), // References people.id
  archived: boolean("archived").default(false),
  accessibilityReviewed: boolean("accessibilityReviewed").default(false),
  siteimproveScore: int("siteimproveScore"),
  manualReview: boolean("manualReview").default(false),
  remediationPlan: text("remediationPlan"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Website = typeof websites.$inferSelect;
export type InsertWebsite = typeof websites.$inferInsert;

/**
 * Applications table - software applications and vendor compliance
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  url: varchar("url", { length: 500 }),
  departmentId: int("departmentId"), // References departments.id
  contactName: varchar("contactName", { length: 255 }),
  vendorId: int("vendorId"),
  lastContactDate: date("lastContactDate"),
  vpatOrAcr: boolean("vpatOrAcr").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;