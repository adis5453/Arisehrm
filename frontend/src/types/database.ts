// Database table types for Supabase operations
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          auth_user_id: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          role_id: number
          department_id: string | null
          position_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          profile_photo_url?: string
          phone_number?: string
          date_of_birth?: string
          hire_date?: string
          salary?: number
          manager_id?: string
          emergency_contact?: {
            name: string
            relationship: string
            phone: string
          }
          address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          preferences?: {
            language: string
            timezone: string
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
            }
          }
        }
        Insert: {
          id?: string
          auth_user_id: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          role_id: number
          department_id?: string | null
          position_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          profile_photo_url?: string
          phone_number?: string
          date_of_birth?: string
          hire_date?: string
          salary?: number
          manager_id?: string
          emergency_contact?: {
            name: string
            relationship: string
            phone: string
          }
          address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          preferences?: {
            language: string
            timezone: string
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
            }
          }
        }
        Update: {
          id?: string
          auth_user_id?: string
          employee_id?: string
          first_name?: string
          last_name?: string
          email?: string
          role_id?: number
          department_id?: string | null
          position_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          profile_photo_url?: string
          phone_number?: string
          date_of_birth?: string
          hire_date?: string
          salary?: number
          manager_id?: string
          emergency_contact?: {
            name: string
            relationship: string
            phone: string
          }
          address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          preferences?: {
            language: string
            timezone: string
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
            }
          }
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          session_token: string
          device_info: Record<string, any>
          browser_fingerprint: string
          user_agent: string
          device_type: string
          ip_address: string
          country: string
          city: string
          is_trusted_device: boolean
          risk_score: number
          security_flags: string[]
          expires_at: string
          last_activity: string
          created_at: string
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          user_id: string
          employee_id: string
          session_token: string
          device_info?: Record<string, any>
          browser_fingerprint: string
          user_agent: string
          device_type: string
          ip_address: string
          country: string
          city: string
          is_trusted_device?: boolean
          risk_score?: number
          security_flags?: string[]
          expires_at: string
          last_activity: string
          created_at?: string
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          session_token?: string
          device_info?: Record<string, any>
          browser_fingerprint?: string
          user_agent?: string
          device_type?: string
          ip_address?: string
          country?: string
          city?: string
          is_trusted_device?: boolean
          risk_score?: number
          security_flags?: string[]
          expires_at?: string
          last_activity?: string
          created_at?: string
          metadata?: Record<string, any>
        }
      }
      failed_login_attempts: {
        Row: {
          id: string
          email: string
          ip_address: string
          user_agent: string
          device_fingerprint: string
          country: string
          attempt_type: string
          failure_reason: string
          risk_indicators: string[]
          is_bot_suspected: boolean
          is_brute_force: boolean
          created_at: string
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          email: string
          ip_address: string
          user_agent: string
          device_fingerprint: string
          country: string
          attempt_type: string
          failure_reason: string
          risk_indicators?: string[]
          is_bot_suspected?: boolean
          is_brute_force?: boolean
          created_at?: string
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          email?: string
          ip_address?: string
          user_agent?: string
          device_fingerprint?: string
          country?: string
          attempt_type?: string
          failure_reason?: string
          risk_indicators?: string[]
          is_bot_suspected?: boolean
          is_brute_force?: boolean
          created_at?: string
          metadata?: Record<string, any>
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_id: string
          timezone: string
          language: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_themes: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          theme: 'light' | 'dark' | 'auto'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_id: string
          theme: 'light' | 'dark' | 'auto'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          theme?: 'light' | 'dark' | 'auto'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Export the database type
export type SupabaseDatabase = Database['public']['Tables']
