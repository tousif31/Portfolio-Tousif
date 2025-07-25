export interface Introduction {
  id: number;
  name: string;
  role: string;
  specialty?: string;
  bio: string;
  detailedBio?: string;
  profileImageUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  updatedAt?: string;
}

export interface Socials {
  id?: number;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface Skill {
  id?: number;
  name: string;
  category: string;
  iconUrl?: string;
  proficiency?: number;
  order?: number;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface Achievement {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
  description?: string;
  iconType?: string;
  order?: number;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
