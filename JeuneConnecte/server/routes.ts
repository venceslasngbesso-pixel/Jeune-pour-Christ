import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMemberSchema, 
  insertContributionSchema, 
  insertAttendanceSchema, 
  insertActivitySchema,
  insertActivityParticipantSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Members Routes
  app.get("/api/members", async (_req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating member:", error);
      res.status(500).json({ error: "Failed to create member" });
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(req.params.id, validatedData);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating member:", error);
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const success = await storage.deleteMember(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Contributions Routes
  app.get("/api/contributions", async (_req, res) => {
    try {
      const contributions = await storage.getContributions();
      res.json(contributions);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  app.get("/api/contributions/member/:memberId", async (req, res) => {
    try {
      const contributions = await storage.getContributionsByMember(req.params.memberId);
      res.json(contributions);
    } catch (error) {
      console.error("Error fetching member contributions:", error);
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  app.get("/api/contributions/stats", async (_req, res) => {
    try {
      const stats = await storage.getContributionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching contribution stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/contributions/monthly-chart/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ error: "Invalid year" });
      }
      const chart = await storage.getMonthlyChart(year);
      res.json(chart);
    } catch (error) {
      console.error("Error fetching monthly chart:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.post("/api/contributions", async (req, res) => {
    try {
      const validatedData = insertContributionSchema.parse(req.body);
      const contribution = await storage.createContribution(validatedData);
      res.status(201).json(contribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating contribution:", error);
      res.status(500).json({ error: "Failed to create contribution" });
    }
  });

  // Attendances Routes
  app.get("/api/attendances", async (_req, res) => {
    try {
      const attendances = await storage.getAttendances();
      res.json(attendances);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      res.status(500).json({ error: "Failed to fetch attendances" });
    }
  });

  app.get("/api/attendances/member/:memberId", async (req, res) => {
    try {
      const attendances = await storage.getAttendancesByMember(req.params.memberId);
      res.json(attendances);
    } catch (error) {
      console.error("Error fetching member attendances:", error);
      res.status(500).json({ error: "Failed to fetch attendances" });
    }
  });

  app.post("/api/attendances", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(validatedData);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating attendance:", error);
      res.status(500).json({ error: "Failed to create attendance" });
    }
  });

  app.post("/api/attendances/bulk", async (req, res) => {
    try {
      const schema = z.array(insertAttendanceSchema);
      const validatedData = schema.parse(req.body);
      const attendances = await storage.bulkCreateAttendances(validatedData);
      res.status(201).json(attendances);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating bulk attendances:", error);
      res.status(500).json({ error: "Failed to create attendances" });
    }
  });

  // Activities Routes
  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/upcoming", async (_req, res) => {
    try {
      const activities = await storage.getUpcomingActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching upcoming activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(req.params.id, validatedData);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating activity:", error);
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const success = await storage.deleteActivity(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // Activity Participants Routes
  app.get("/api/activities/:activityId/participants", async (req, res) => {
    try {
      const participants = await storage.getActivityParticipants(req.params.activityId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching activity participants:", error);
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.post("/api/activities/:activityId/participants", async (req, res) => {
    try {
      const validatedData = insertActivityParticipantSchema.parse({
        ...req.body,
        activityId: req.params.activityId,
      });
      const participant = await storage.addActivityParticipant(validatedData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error adding participant:", error);
      res.status(500).json({ error: "Failed to add participant" });
    }
  });

  app.delete("/api/activities/:activityId/participants/:memberId", async (req, res) => {
    try {
      const success = await storage.removeActivityParticipant(
        req.params.activityId,
        req.params.memberId
      );
      if (!success) {
        return res.status(404).json({ error: "Participant not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error removing participant:", error);
      res.status(500).json({ error: "Failed to remove participant" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
