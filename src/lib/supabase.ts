// Supabase configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create Supabase client if we have valid credentials
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url' && supabaseAnonKey !== 'your_supabase_anon_key')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  current_school?: string
  target_schools?: string
  current_gpa?: string
  high_school_gpa?: string
  graduation_year?: number
  major?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  school_name: string
  application_deadline: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  application_id?: string
  title: string
  type: 'essay' | 'transcript' | 'recommendation' | 'other'
  file_url?: string
  content?: string
  status: 'draft' | 'review' | 'approved' | 'needs_revision'
  feedback?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  application_id?: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  consultant_id?: string
  subject: string
  content: string
  is_read: boolean
  created_at: string
}