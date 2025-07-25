import { pgTable, text, serial, integer, boolean, timestamp, jsonb, bytea } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const introduction = pgTable("introduction", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  specialty: text("specialty"),
  bio: text("bio").notNull(),
  detailedBio: text("detailed_bio"),
  profileImageUrl: text("profile_image_url"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socials = pgTable("socials", {
  id: serial("id").primaryKey(),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend, backend, tools
  iconUrl: text("icon_url"),
  proficiency: integer("proficiency").default(80), // 1-100
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  certificateUrl: text("certificate_url"),
  description: text("description"),
  iconType: text("icon_type").default("trophy"), // trophy, certificate, award, medal, etc.
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiConfig = pgTable("ai_config", {
  id: serial("id").primaryKey(),
  systemPrompt: text("system_prompt").default("You are a helpful AI assistant that provides feedback on portfolios and career advice."),
  apiKey: text("api_key"),
  enabled: boolean("enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertIntroductionSchema = createInsertSchema(introduction).omit({
  id: true,
  updatedAt: true,
});

export const insertSocialsSchema = createInsertSchema(socials).omit({
  id: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertAiConfigSchema = createInsertSchema(aiConfig).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Introduction = typeof introduction.$inferSelect;
export type InsertIntroduction = z.infer<typeof insertIntroductionSchema>;
export type Socials = typeof socials.$inferSelect;
export type InsertSocials = z.infer<typeof insertSocialsSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type AiConfig = typeof aiConfig.$inferSelect;
export type InsertAiConfig = z.infer<typeof insertAiConfigSchema>;
