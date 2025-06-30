import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Proposal = {
  id: string
  molecule_id: string
  title: string
  description: string
  proposal_number: number
  votes: number
  days_left: number
  chain: string
  created_at: string
  updated_at: string
}