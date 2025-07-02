'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ProposalCard from '@/components/dao/proposalCard'
import CreateProposalDialog from '@/components/dao/createProposalDialog'
import { Proposal } from '@/utils/supabase'
import { getProposals } from '@/utils/proposals'

export default function Container() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProposals = async () => {
    setLoading(true)
    const data = await getProposals()
    setProposals(data)
    setFilteredProposals(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = proposals.filter((proposal) =>
        proposal.molecule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProposals(filtered)
    } else {
      setFilteredProposals(proposals)
    }
  }, [searchTerm, proposals])

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-8 py-8">
        <section className="font-inter text-center space-y-8 mb-12">
          <Badge className="bg-[#05CD3A] text-[#00E29A] rounded-full text-[14px] font-[300] mx-auto block">
            DAO 
          </Badge>

          <CreateProposalDialog onProposalCreated={fetchProposals} />

          <div className="border border-white/20 rounded-lg flex gap-2 items-center md:w-4/12 mx-auto px-4 py-2 bg-white/5 backdrop-blur-sm">
            <Search size={16} className="text-gray-400" />
            <Input
              placeholder="Search proposals by molecule ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent focus:outline-none text-white placeholder-gray-400"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400">Loading proposals...</div>
            </div>
          ) : filteredProposals.length > 0 ? (
            filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400">
                {searchTerm ? 'No proposals found matching your search.' : 'No proposals available.'}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
