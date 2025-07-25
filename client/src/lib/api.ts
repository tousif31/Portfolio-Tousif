import { apiRequest } from "@/lib/queryClient";
import type { 
  Introduction, 
  Socials, 
  Skill, 
  Project, 
  Achievement, 
  ContactMessage,
  AuthResponse
} from "@/types/portfolio";

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => authToken;

export const isAuthenticated = () => !!authToken;

// Enhanced API request with auth
const authenticatedRequest = async (method: string, url: string, data?: unknown) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  return response;
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Public API
export const publicApi = {
  getIntroduction: async (): Promise<Introduction> => {
    const response = await fetch('/api/introduction');
    return response.json();
  },

  getSocials: async (): Promise<Socials> => {
    const response = await fetch('/api/socials');
    return response.json();
  },

  getSkills: async (): Promise<Skill[]> => {
    const response = await fetch('/api/skills');
    return response.json();
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await fetch('/api/projects');
    return response.json();
  },

  getAchievements: async (): Promise<Achievement[]> => {
    const response = await fetch('/api/achievements');
    return response.json();
  },

  sendContactMessage: async (message: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): Promise<void> => {
    await apiRequest('POST', '/api/contact', message);
  },

  sendChatMessage: async (message: string, context?: string): Promise<{ response: string }> => {
    const response = await apiRequest('POST', '/api/ai/chat', { message, context });
    return response.json();
  },
};

// Admin API
export const adminApi = {
  // Introduction
  updateIntroduction: async (data: Partial<Introduction>): Promise<Introduction> => {
    const response = await authenticatedRequest('PUT', '/api/admin/introduction', data);
    return response.json();
  },

  // Socials
  updateSocials: async (data: Partial<Socials>): Promise<Socials> => {
    const response = await authenticatedRequest('PUT', '/api/admin/socials', data);
    return response.json();
  },

  // Skills
  createSkill: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
    const response = await authenticatedRequest('POST', '/api/admin/skills', skill);
    return response.json();
  },

  updateSkill: async (id: number, skill: Partial<Skill>): Promise<Skill> => {
    const response = await authenticatedRequest('PUT', `/api/admin/skills/${id}`, skill);
    return response.json();
  },

  deleteSkill: async (id: number): Promise<void> => {
    await authenticatedRequest('DELETE', `/api/admin/skills/${id}`);
  },

  // Projects
  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const response = await authenticatedRequest('POST', '/api/admin/projects', project);
    return response.json();
  },

  updateProject: async (id: number, project: Partial<Project>): Promise<Project> => {
    const response = await authenticatedRequest('PUT', `/api/admin/projects/${id}`, project);
    return response.json();
  },

  deleteProject: async (id: number): Promise<void> => {
    await authenticatedRequest('DELETE', `/api/admin/projects/${id}`);
  },

  // Achievements
  createAchievement: async (achievement: Omit<Achievement, 'id'>): Promise<Achievement> => {
    const response = await authenticatedRequest('POST', '/api/admin/achievements', achievement);
    return response.json();
  },

  updateAchievement: async (id: number, achievement: Partial<Achievement>): Promise<Achievement> => {
    const response = await authenticatedRequest('PUT', `/api/admin/achievements/${id}`, achievement);
    return response.json();
  },

  deleteAchievement: async (id: number): Promise<void> => {
    await authenticatedRequest('DELETE', `/api/admin/achievements/${id}`);
  },

  // Contact Messages
  getContactMessages: async (): Promise<ContactMessage[]> => {
    const response = await authenticatedRequest('GET', '/api/admin/contact-messages');
    return response.json();
  },

  markMessageAsRead: async (id: number): Promise<ContactMessage> => {
    const response = await authenticatedRequest('PUT', `/api/admin/contact-messages/${id}/read`);
    return response.json();
  },

  // AI Configuration
  getAIConfig: async (): Promise<{ systemPrompt: string; enabled: boolean }> => {
    const response = await authenticatedRequest('GET', '/api/admin/ai-config');
    return response.json();
  },

  updateAIConfig: async (data: { systemPrompt: string; enabled: boolean }): Promise<{ systemPrompt: string; enabled: boolean }> => {
    const response = await authenticatedRequest('PUT', '/api/admin/ai-config', data);
    return response.json();
  },

  // File Upload
  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};
