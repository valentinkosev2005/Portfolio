import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  client?: string;
  year?: string;
  services?: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

// Site content types
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'url' | 'boolean' | 'json';
  created_at: string;
  updated_at: string;
}