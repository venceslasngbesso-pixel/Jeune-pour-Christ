import { 
  members, 
  contributions, 
  attendances, 
  activities, 
  activityParticipants,
  type Member,
  type InsertMember,
  type Contribution,
  type InsertContribution,
  type Attendance,
  type InsertAttendance,
  type Activity,
  type InsertActivity,
  type ActivityParticipant,
  type InsertActivityParticipant,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export type ContributionWithMember = Contribution & { memberName: string };
export type AttendanceWithMember = Attendance & { memberName: string };
export type ActivityWithDetails = Activity & { 
  responsibleName: string | null; 
  participants: { id: string; memberId: string; name: string; photoUrl: string | null }[]; 
  participantCount: number; 
};
export type ActivityParticipantWithName = ActivityParticipant & { name: string; photoUrl: string | null };

export interface DashboardStats {
  totalMembers: number;
  monthlyContributions: number;
  attendanceRate: number;
  upcomingActivities: number;
}

export interface ContributionStats {
  total: number;
  thisMonth: number;
  totalMembers: number;
  upToDate: number;
}

export interface MonthlyChartData {
  month: string;
  amount: number;
}

export interface IStorage {
  // Members
  getMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: string): Promise<boolean>;

  // Contributions
  getContributions(): Promise<ContributionWithMember[]>;
  getContributionsByMember(memberId: string): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionStats(): Promise<ContributionStats>;
  getMonthlyChart(year: number): Promise<MonthlyChartData[]>;

  // Attendances
  getAttendances(): Promise<AttendanceWithMember[]>;
  getAttendancesByMember(memberId: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  bulkCreateAttendances(attendances: InsertAttendance[]): Promise<Attendance[]>;

  // Activities
  getActivities(): Promise<ActivityWithDetails[]>;
  getActivity(id: string): Promise<ActivityWithDetails | undefined>;
  getUpcomingActivities(): Promise<ActivityWithDetails[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: string): Promise<boolean>;

  // Activity Participants
  addActivityParticipant(participant: InsertActivityParticipant): Promise<ActivityParticipant>;
  removeActivityParticipant(activityId: string, memberId: string): Promise<boolean>;
  getActivityParticipants(activityId: string): Promise<ActivityParticipantWithName[]>;

  // Dashboard Stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  // Members
  async getMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db.insert(members).values(insertMember).returning();
    return member;
  }

  async updateMember(id: string, updateData: Partial<InsertMember>): Promise<Member | undefined> {
    const [member] = await db
      .update(members)
      .set(updateData)
      .where(eq(members.id, id))
      .returning();
    return member || undefined;
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await db.delete(members).where(eq(members.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Contributions
  async getContributions(): Promise<ContributionWithMember[]> {
    const result = await db
      .select({
        id: contributions.id,
        memberId: contributions.memberId,
        memberName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        amount: contributions.amount,
        month: contributions.month,
        year: contributions.year,
        status: contributions.status,
        paidDate: contributions.paidDate,
        createdAt: contributions.createdAt,
      })
      .from(contributions)
      .leftJoin(members, eq(contributions.memberId, members.id))
      .orderBy(desc(contributions.paidDate));
    
    return result;
  }

  async getContributionsByMember(memberId: string): Promise<Contribution[]> {
    return await db
      .select()
      .from(contributions)
      .where(eq(contributions.memberId, memberId))
      .orderBy(desc(contributions.paidDate));
  }

  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const [result] = await db.insert(contributions).values(contribution).returning();
    return result;
  }

  async getContributionStats(): Promise<ContributionStats> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [totalResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${contributions.amount}), 0)` })
      .from(contributions);

    const [monthResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${contributions.amount}), 0)` })
      .from(contributions)
      .where(
        and(
          eq(contributions.month, currentMonth),
          eq(contributions.year, currentYear)
        )
      );

    const [memberCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(members)
      .where(eq(members.status, "active"));

    const [upToDateCount] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${contributions.memberId})` })
      .from(contributions)
      .where(
        and(
          eq(contributions.month, currentMonth),
          eq(contributions.year, currentYear),
          eq(contributions.status, "paid")
        )
      );

    return {
      total: Number(totalResult?.total || 0),
      thisMonth: Number(monthResult?.total || 0),
      totalMembers: Number(memberCount?.count || 0),
      upToDate: Number(upToDateCount?.count || 0),
    };
  }

  async getMonthlyChart(year: number): Promise<MonthlyChartData[]> {
    const result = await db
      .select({
        month: contributions.month,
        amount: sql<number>`COALESCE(SUM(${contributions.amount}), 0)`,
      })
      .from(contributions)
      .where(eq(contributions.year, year))
      .groupBy(contributions.month)
      .orderBy(contributions.month);

    const monthNames = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const chartData = monthNames.map((name, index) => ({
      month: name,
      amount: 0,
    }));

    result.forEach((row) => {
      if (row.month && row.month >= 1 && row.month <= 12) {
        chartData[row.month - 1].amount = row.amount || 0;
      }
    });

    return chartData;
  }

  // Attendances
  async getAttendances(): Promise<AttendanceWithMember[]> {
    const result = await db
      .select({
        id: attendances.id,
        memberId: attendances.memberId,
        memberName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        serviceType: attendances.serviceType,
        date: attendances.date,
        present: attendances.present,
        createdAt: attendances.createdAt,
      })
      .from(attendances)
      .leftJoin(members, eq(attendances.memberId, members.id))
      .orderBy(desc(attendances.date));

    return result;
  }

  async getAttendancesByMember(memberId: string): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendances)
      .where(eq(attendances.memberId, memberId))
      .orderBy(desc(attendances.date));
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const [result] = await db.insert(attendances).values(attendance).returning();
    return result;
  }

  async bulkCreateAttendances(attendanceList: InsertAttendance[]): Promise<Attendance[]> {
    if (attendanceList.length === 0) return [];
    return await db.insert(attendances).values(attendanceList).returning();
  }

  // Activities
  async getActivities(): Promise<ActivityWithDetails[]> {
    const result = await db
      .select({
        id: activities.id,
        title: activities.title,
        description: activities.description,
        date: activities.date,
        responsibleId: activities.responsibleId,
        responsibleName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        status: activities.status,
        createdAt: activities.createdAt,
      })
      .from(activities)
      .leftJoin(members, eq(activities.responsibleId, members.id))
      .orderBy(desc(activities.date));

    const activitiesWithParticipants = await Promise.all(
      result.map(async (activity) => {
        const participants = await this.getActivityParticipants(activity.id);
        return {
          ...activity,
          participants,
          participantCount: participants.length,
        };
      })
    );

    return activitiesWithParticipants;
  }

  async getActivity(id: string): Promise<ActivityWithDetails | undefined> {
    const [activity] = await db
      .select({
        id: activities.id,
        title: activities.title,
        description: activities.description,
        date: activities.date,
        responsibleId: activities.responsibleId,
        responsibleName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        status: activities.status,
        createdAt: activities.createdAt,
      })
      .from(activities)
      .leftJoin(members, eq(activities.responsibleId, members.id))
      .where(eq(activities.id, id));

    if (!activity) return undefined;

    const participants = await this.getActivityParticipants(id);
    return {
      ...activity,
      participants,
      participantCount: participants.length,
    };
  }

  async getUpcomingActivities(): Promise<ActivityWithDetails[]> {
    const now = new Date();
    const result = await db
      .select({
        id: activities.id,
        title: activities.title,
        description: activities.description,
        date: activities.date,
        responsibleId: activities.responsibleId,
        responsibleName: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        status: activities.status,
        createdAt: activities.createdAt,
      })
      .from(activities)
      .leftJoin(members, eq(activities.responsibleId, members.id))
      .where(sql`${activities.date} >= ${now}`)
      .orderBy(activities.date)
      .limit(5);

    const activitiesWithParticipants = await Promise.all(
      result.map(async (activity) => {
        const participants = await this.getActivityParticipants(activity.id);
        return {
          ...activity,
          participants,
          participantCount: participants.length,
        };
      })
    );

    return activitiesWithParticipants;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [result] = await db.insert(activities).values(activity).returning();
    return result;
  }

  async updateActivity(id: string, updateData: Partial<InsertActivity>): Promise<Activity | undefined> {
    const [activity] = await db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();
    return activity || undefined;
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Activity Participants
  async addActivityParticipant(participant: InsertActivityParticipant): Promise<ActivityParticipant> {
    const [result] = await db.insert(activityParticipants).values(participant).returning();
    return result;
  }

  async removeActivityParticipant(activityId: string, memberId: string): Promise<boolean> {
    const result = await db
      .delete(activityParticipants)
      .where(
        and(
          eq(activityParticipants.activityId, activityId),
          eq(activityParticipants.memberId, memberId)
        )
      );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getActivityParticipants(activityId: string): Promise<ActivityParticipantWithName[]> {
    const result = await db
      .select({
        id: activityParticipants.id,
        memberId: activityParticipants.memberId,
        name: sql<string>`${members.firstName} || ' ' || ${members.lastName}`,
        photoUrl: members.photoUrl,
      })
      .from(activityParticipants)
      .leftJoin(members, eq(activityParticipants.memberId, members.id))
      .where(eq(activityParticipants.activityId, activityId));

    return result;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [memberCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(members)
      .where(eq(members.status, "active"));

    const [monthContributions] = await db
      .select({ total: sql<number>`COALESCE(SUM(${contributions.amount}), 0)` })
      .from(contributions)
      .where(
        and(
          eq(contributions.month, currentMonth),
          eq(contributions.year, currentYear)
        )
      );

    const [totalAttendances] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(attendances);

    const [presentAttendances] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(attendances)
      .where(eq(attendances.present, true));

    const attendanceRate = totalAttendances?.count 
      ? Math.round(((Number(presentAttendances?.count) || 0) / Number(totalAttendances.count)) * 100)
      : 0;

    const [upcomingCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(activities)
      .where(sql`${activities.date} >= ${now}`);

    return {
      totalMembers: Number(memberCount?.count || 0),
      monthlyContributions: Number(monthContributions?.total || 0),
      attendanceRate,
      upcomingActivities: Number(upcomingCount?.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();
