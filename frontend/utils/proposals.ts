import { supabase } from '@/utils/supabase-client'
import { Proposal } from './supabase'

/**
 * Fetches all proposals from the database.
 */
export async function getProposals(): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching proposals:', error)
    return []
  }

  return data || []
}

/**
 * Creates a new proposal in the database.
 */
interface CreateProposalInput {
  molecule_id: string
  title: string
  description: string
  chain?: string
}

export async function createProposal(input: CreateProposalInput): Promise<Proposal | null> {
  const { molecule_id, title, description, chain = 'Multichain' } = input

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      molecule_id,
      title,
      description,
      chain,
      votes: 0,
      days_left: 6,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating proposal:', error)
    return null
  }

  return data
}
