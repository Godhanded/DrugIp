"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { createProposal } from '@/utils/proposals'

interface CreateProposalDialogProps {
  onProposalCreated: () => void
}

export default function CreateProposalDialog({ onProposalCreated }: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    moleculeId: '',
    title: '',
    description: '',
    chain: 'Multichain'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createProposal({
        molecule_id: formData.moleculeId,
        title: formData.title,
        description: formData.description,
        chain: formData.chain
      })

      if (!result) throw new Error('Failed to create proposal')

      // Clear form and close dialog
      setFormData({
        moleculeId: '',
        title: '',
        description: '',
        chain: 'Multichain'
      })
      setOpen(false)
      onProposalCreated()
    } catch (error) {
      console.error('Error creating proposal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white/5 text-white border border-gray-600 hover:bg-white/10 transition-colors">
          <Plus size={16} className="mr-2" />
          Create New Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Proposal</DialogTitle>
          <DialogDescription className="text-gray-400">
            Submit a new molecular research proposal to the DAO.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moleculeId" className="text-white">Molecule ID</Label>
            <Input
              id="moleculeId"
              value={formData.moleculeId}
              onChange={(e) => setFormData({ ...formData, moleculeId: e.target.value })}
              placeholder="e.g., AX-147"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief title for the proposal"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the molecular research proposal..."
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chain" className="text-white">Chain</Label>
            <Input
              id="chain"
              value={formData.chain}
              onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
              placeholder="Multichain"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? 'Creating...' : 'Create Proposal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
