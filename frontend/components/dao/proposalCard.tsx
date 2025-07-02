import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { Proposal } from '@/utils/supabase'

interface ProposalCardProps {
  proposal: Proposal
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
          </div>
          <div>
            <h3 className="text-white font-semibold">{proposal.molecule_id}</h3>
            <p className="text-gray-400 text-sm">Proposal #{proposal.proposal_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Clock size={16} />
          <span>{proposal.days_left} days left</span>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {proposal.description}
      </p>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
          {proposal.chain}
        </Badge>
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">{proposal.votes} Votes</span>
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
              <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <span className="text-gray-400 text-sm">+2</span>
          </div>
        </div>
      </div>
    </div>
  )
}