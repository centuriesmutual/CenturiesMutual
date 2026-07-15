export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'additional_information'
  | 'approved'
  | 'declined'
  | 'active'

export type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type InsuranceApplication = {
  id: string
  user_id: string
  application_status: ApplicationStatus
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  date_of_birth: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ApplicationDocument = {
  id: string
  application_id: string
  storage_path: string
  filename: string
  mime_type: string | null
  uploaded_at: string
  lead_id: string | null
  marketing_id: string | null
  producer_id: string | null
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      insurance_applications: {
        Row: InsuranceApplication
        Insert: {
          id?: string
          user_id: string
          application_status?: ApplicationStatus
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          date_of_birth?: string | null
          notes?: string | null
        }
        Update: {
          application_status?: ApplicationStatus
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          date_of_birth?: string | null
          notes?: string | null
        }
      }
      application_documents: {
        Row: ApplicationDocument
        Insert: {
          id?: string
          application_id: string
          storage_path: string
          filename: string
          mime_type?: string | null
          lead_id?: string | null
          marketing_id?: string | null
          producer_id?: string | null
        }
        Update: {
          filename?: string
          mime_type?: string | null
          lead_id?: string | null
          marketing_id?: string | null
          producer_id?: string | null
        }
      }
    }
  }
}
