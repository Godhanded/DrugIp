// import { corsHeaders } from '../_shared/cors'
// /* eslint-disable */

// Deno.serve(async (req: Request) => {
//   if (req.method === 'OPTIONS') {
//     return new Response(null, {
//       status: 200,
//       headers: corsHeaders,
//     })
//   }

//   try {
//     // Create Supabase client
//     const supabaseUrl = Deno.env.get('SUPABASE_URL')!
//     const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
//     const { createClient } = await import('npm:@supabase/supabase-js@2')
//     const supabase = createClient(supabaseUrl, supabaseServiceKey)

//     // Get URL parameters for filtering/pagination
//     const url = new URL(req.url)
//     const search = url.searchParams.get('search')
//     const limit = parseInt(url.searchParams.get('limit') || '50')
//     const offset = parseInt(url.searchParams.get('offset') || '0')

//     let query = supabase
//       .from('proposals')
//       .select('*')
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1)

//     // Add search filter if provided
//     if (search) {
//       query = query.or(`molecule_id.ilike.%${search}%,title.ilike.%${search}%`)
//     }

//     const { data, error } = await query

//     if (error) {
//       console.error('Database error:', error)
//       return new Response(
//         JSON.stringify({ error: 'Failed to fetch proposals' }),
//         {
//           status: 500,
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         }
//       )
//     }

//     return new Response(
//       JSON.stringify(data),
//       {
//         status: 200,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       }
//     )
//   } catch (error) {
//     console.error('Error fetching proposals:', error)
//     return new Response(
//       JSON.stringify({ error: 'Internal server error' }),
//       {
//         status: 500,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       }
//     )
//   }
// })