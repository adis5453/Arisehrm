import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to get user profile with proper typing
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth_user_id', userId)
    .eq('is_active', true)
    .single()
  
  return { data, error }
}

// Helper function to create user profile with proper typing
export const createUserProfile = async (profile: Database['public']['Tables']['user_profiles']['Insert']) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single()
  
  return { data, error }
}

// Helper function to update user profile with proper typing
export const updateUserProfile = async (
  userId: string, 
  updates: Database['public']['Tables']['user_profiles']['Update']
) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('auth_user_id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Helper function to create user session with proper typing
export const createUserSession = async (session: Database['public']['Tables']['user_sessions']['Insert']) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .insert(session)
    .select()
    .single()
  
  return { data, error }
}

// Helper function to log failed login attempt with proper typing
export const logFailedLoginAttempt = async (attempt: Database['public']['Tables']['failed_login_attempts']['Insert']) => {
  const { data, error } = await supabase
    .from('failed_login_attempts')
    .insert(attempt)
    .select()
    .single()
  
  return { data, error }
}

// Helper function to update user preferences with proper typing
export const updateUserPreferences = async (
  userId: string, 
  updates: Database['public']['Tables']['user_preferences']['Update']
) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      employee_id: userId, // Assuming employee_id is same as user_id for now
      ...updates
    })
    .select()
    .single()
  
  return { data, error }
}

// Helper function to update user theme with proper typing
export const updateUserTheme = async (
  userId: string, 
  updates: Database['public']['Tables']['user_themes']['Update']
) => {
  const { data, error } = await supabase
    .from('user_themes')
    .upsert({
      user_id: userId,
      employee_id: userId, // Assuming employee_id is same as user_id for now
      ...updates
    })
    .select()
    .single()
  
  return { data, error }
}

