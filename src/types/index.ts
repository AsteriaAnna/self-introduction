export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  content: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  location?: string;
  content: string;
}

export interface Keyword {
  name: string;
  count: number;
  type: 'skill' | 'tool' | 'domain';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'experience';
  weight: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface JDMatchResult {
  keywords: string[];
  matchedProjects: string[];
  matchedExperiences: string[];
  matchScore: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
}
