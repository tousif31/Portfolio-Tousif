import { 
  users, introduction, socials, skills, projects, achievements, contactMessages, aiConfig,
  type User, type InsertUser, type Introduction, type InsertIntroduction,
  type Socials, type InsertSocials, type Skill, type InsertSkill,
  type Project, type InsertProject, type Achievement, type InsertAchievement,
  type ContactMessage, type InsertContactMessage, type AiConfig, type InsertAiConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Introduction methods
  getIntroduction(): Promise<Introduction | undefined>;
  updateIntroduction(data: Partial<InsertIntroduction>): Promise<Introduction>;

  // Socials methods
  getSocials(): Promise<Socials | undefined>;
  updateSocials(data: Partial<InsertSocials>): Promise<Socials>;

  // Skills methods
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  // Projects methods
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Achievements methods
  getAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement>;
  deleteAchievement(id: number): Promise<void>;

  // Contact messages methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<ContactMessage>;

  // AI Config methods
  getAiConfig(): Promise<AiConfig | undefined>;
  updateAiConfig(data: Partial<InsertAiConfig>): Promise<AiConfig>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getIntroduction(): Promise<Introduction | undefined> {
    const [intro] = await db.select().from(introduction).limit(1);
    return intro || undefined;
  }

  async updateIntroduction(data: Partial<InsertIntroduction>): Promise<Introduction> {
    const existing = await this.getIntroduction();
    if (existing) {
      const [updated] = await db
        .update(introduction)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(introduction.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(introduction)
        .values(data as InsertIntroduction)
        .returning();
      return created;
    }
  }

  async getSocials(): Promise<Socials | undefined> {
    const [social] = await db.select().from(socials).limit(1);
    return social || undefined;
  }

  async updateSocials(data: Partial<InsertSocials>): Promise<Socials> {
    const existing = await this.getSocials();
    if (existing) {
      const [updated] = await db
        .update(socials)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(socials.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(socials)
        .values(data as InsertSocials)
        .returning();
      return created;
    }
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order, skills.category);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill> {
    const [updated] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order, desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.order, desc(achievements.createdAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db.insert(achievements).values(achievement).returning();
    return created;
  }

  async updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement> {
    const [updated] = await db
      .update(achievements)
      .set(achievement)
      .where(eq(achievements.id, id))
      .returning();
    return updated;
  }

  async deleteAchievement(id: number): Promise<void> {
    await db.delete(achievements).where(eq(achievements.id, id));
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async markMessageAsRead(id: number): Promise<ContactMessage> {
    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }

  async getAiConfig(): Promise<AiConfig | undefined> {
    const [config] = await db.select().from(aiConfig).limit(1);
    return config || undefined;
  }

  async updateAiConfig(data: Partial<InsertAiConfig>): Promise<AiConfig> {
    const existing = await this.getAiConfig();
    if (existing) {
      const [updated] = await db
        .update(aiConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(aiConfig.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(aiConfig)
        .values(data as InsertAiConfig)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
