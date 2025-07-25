import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticateToken, 
  requireAdmin, 
  hashPassword, 
  verifyPassword, 
  generateToken,
  type AuthRequest 
} from "./middleware/auth";
import { 
  insertIntroductionSchema, 
  insertSocialsSchema, 
  insertSkillSchema,
  insertProjectSchema,
  insertAchievementSchema,
  insertContactMessageSchema,
  insertAiConfigSchema
} from "@shared/schema";
import { generatePortfolioFeedback, analyzePortfolioSection } from "./services/gemini";
import { sendContactEmail, sendAutoReply } from "./services/email";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Public routes

  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Public portfolio data
  app.get("/api/introduction", async (req, res) => {
    try {
      const intro = await storage.getIntroduction();
      res.json(intro || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch introduction" });
    }
  });

  app.get("/api/socials", async (req, res) => {
    try {
      const socials = await storage.getSocials();
      res.json(socials || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch socials" });
    }
  });

  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Save to database
      const message = await storage.createContactMessage(validatedData);
      
      // Send emails
      try {
        await sendContactEmail(validatedData);
        await sendAutoReply(validatedData);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      res.json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // AI Chat

  
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generatePortfolioFeedback(message, context);
      res.json({ response });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  // Protected admin routes
  app.use("/api/admin/*", authenticateToken, requireAdmin);

  // Admin - Introduction
  app.put("/api/admin/introduction", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertIntroductionSchema.parse(req.body);
      const updated = await storage.updateIntroduction(validatedData);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update introduction" });
    }
  });

  // Admin - Socials
  app.put("/api/admin/socials", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertSocialsSchema.parse(req.body);
      const updated = await storage.updateSocials(validatedData);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update socials" });
    }
  });

  // Admin - Skills
  app.post("/api/admin/skills", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put("/api/admin/skills/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, validatedData);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/admin/skills/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Admin - Projects
  app.post("/api/admin/projects", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Admin - Achievements
  app.post("/api/admin/achievements", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  app.put("/api/admin/achievements/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAchievementSchema.partial().parse(req.body);
      const achievement = await storage.updateAchievement(id, validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update achievement" });
    }
  });

  app.delete("/api/admin/achievements/:id", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAchievement(id);
      res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });

  // Admin - Contact Messages
  app.get("/api/admin/contact-messages", async (req: AuthRequest, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.put("/api/admin/contact-messages/:id/read", async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Admin - AI Config
  app.get("/api/admin/ai-config", async (req: AuthRequest, res) => {
    try {
      const config = await storage.getAiConfig();
      res.json(config || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI config" });
    }
  });

  app.put("/api/admin/ai-config", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertAiConfigSchema.parse(req.body);
      const config = await storage.updateAiConfig(validatedData);
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI config" });
    }
  });

  // File upload
  app.post("/api/admin/upload", upload.single('image'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real application, you would upload to a cloud service like Cloudinary
      // For now, we'll return a placeholder URL
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Admin - Resume Upload
  app.post("/api/admin/upload-resume", authenticateToken, requireAdmin, upload.single('resume'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }
      // Move the file to client/public/resume.pdf
      const destPath = require('path').resolve(__dirname, '../client/public/resume.pdf');
      await fs.promises.copyFile(req.file.path, destPath);
      await fs.promises.unlink(req.file.path); // Remove temp upload
      res.json({ message: 'Resume uploaded successfully', url: '/resume.pdf' });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
