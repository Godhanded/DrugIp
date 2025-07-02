import { corsHeaders } from '../_shared/cors'

interface CreateProposalRequest {
  molecule_id: string
  title: string
  description: string
  chain?: string
}

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

app.options('*', (req, res) => {
  res.set(corsHeaders)
  res.sendStatus(200)
})

app.post('/', async (req, res): Promise<void> => {
  try {
    const body: Partial<CreateProposalRequest> = req.body

    const { molecule_id, title, description, chain = 'Multichain' } = body

    if (!molecule_id || !title || !description) {
      res.status(400).set(corsHeaders).json({ error: 'Missing required fields: molecule_id, title, description' })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
     res.status(500).set(corsHeaders).json({ error: 'Server misconfiguration: missing Supabase credentials' })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

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
      console.error('Supabase insert error:', error)
      res.status(500).set(corsHeaders).json({ error: 'Failed to create proposal' })
    }

    res.status(201).set(corsHeaders).json({ data, message: 'Proposal created successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    res.status(500).set(corsHeaders).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
