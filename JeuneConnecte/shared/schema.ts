import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Membres table
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  photoUrl: text("photo_url"),
  churchRole: text("church_role"),
  externalRole: text("external_role"),
  neighborhood: text("neighborhood"),
  phone: text("phone"),
  isLeader: boolean("is_leader").notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Cotisations table
export const contributions = pgTable("contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  status: text("status").notNull().default("paid"),
  paidDate: timestamp("paid_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Présences table
export const attendances = pgTable("attendances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  serviceType: text("service_type").notNull(),
  date: date("date").notNull(),
  present: boolean("present").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Activités table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  responsibleId: varchar("responsible_id").references(() => members.id),
  status: text("status").notNull().default("upcoming"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Participants aux activités table
export const activityParticipants = pgTable("activity_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").notNull().references(() => activities.id, { onDelete: "cascade" }),
  memberId: varchar("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const membersRelations = relations(members, ({ many }) => ({
  contributions: many(contributions),
  attendances: many(attendances),
  activities: many(activities),
  activityParticipations: many(activityParticipants),
}));

export const contributionsRelations = relations(contributions, ({ one }) => ({
  member: one(members, {
    fields: [contributions.memberId],
    references: [members.id],
  }),
}));

export const attendancesRelations = relations(attendances, ({ one }) => ({
  member: one(members, {
    fields: [attendances.memberId],
    references: [members.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  responsible: one(members, {
    fields: [activities.responsibleId],
    references: [members.id],
  }),
  participants: many(activityParticipants),
}));

export const activityParticipantsRelations = relations(activityParticipants, ({ one }) => ({
  activity: one(activities, {
    fields: [activityParticipants.activityId],
    references: [activities.id],
  }),
  member: one(members, {
    fields: [activityParticipants.memberId],
    references: [members.id],
  }),
}));

// Insert schemas
export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendances).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertActivityParticipantSchema = createInsertSchema(activityParticipants).omit({
  id: true,
  createdAt: true,
});

// Types
export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;

export type Attendance = typeof attendances.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type ActivityParticipant = typeof activityParticipants.$inferSelect;
export type InsertActivityParticipant = z.infer<typeof insertActivityParticipantSchema>;

// Service types enum
export const SERVICE_TYPES = {
  TUESDAY_MEDITATION: "Mardi - Méditation",
  THURSDAY_EXHORTATION: "Jeudi - Exhortation",
  SUNDAY_WORSHIP: "Dimanche - Louange et Adoration",
  ACTIVITIES: "Activités",
} as const;

// Contribution amounts
export const CONTRIBUTION_AMOUNTS = {
  MEMBER: 500,
  LEADER: 1000,
} as const;
