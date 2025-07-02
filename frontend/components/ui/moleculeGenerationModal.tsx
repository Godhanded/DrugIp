"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IoCloseSharp, IoCopySharp, IoCheckmarkSharp } from "react-icons/io5"
import { BiDna } from "react-icons/bi"
import { MdAnalytics } from "react-icons/md"

interface MoleculeGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: ()=> void
}

interface MoleculeResponse {
  smiles: string[]
}

export function MoleculeGenerationModal({ isOpen, onClose,onNext }: MoleculeGenerationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [moleculeData, setMoleculeData] = useState<MoleculeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const fetchMolecule = async () => {
    setIsLoading(true)
    setError(null)
    setMoleculeData(null)

    try {
      const response = await fetch("https://p01--smiles-scorer--gxf6ymhcdv59.code.run/gensmile/1")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: MoleculeResponse = await response.json()
      setMoleculeData(data)
    } catch (err) {
      console.error("Error fetching molecule:", err)
      setError(err instanceof Error ? err.message : "Failed to generate molecule. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (smile: string, index: number) => {
    try {
      await navigator.clipboard.writeText(smile)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // const handleModalOpen = () => {
  //   if (isOpen && !moleculeData && !isLoading) {
  //     fetchMolecule()
  //   }
  // }

  // Trigger fetch when modal opens
  if (isOpen && !moleculeData && !isLoading && !error) {
    fetchMolecule()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgba(10,15,33,0.7)] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <BiDna className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Generated Molecules</h2>
          </div>
          <button onClick={()=>{setMoleculeData(null); onClose()}} className="text-gray-500 hover:text-gray-700">
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Generating molecules...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-4">
                <BiDna className="w-12 h-12" />
              </div>
              <p className="text-red-600 text-center mb-4">{error}</p>
              <Button onClick={fetchMolecule} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
            </div>
          )}

          {moleculeData && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Generated {moleculeData.smiles.length} molecule{moleculeData.smiles.length > 1 ? "s" : ""}:
              </p>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {moleculeData.smiles.map((smile, index) => (
                  <div key={index} className="bg-transparent rounded-lg p-4 border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">SMILE String {index + 1}:</p>
                        <code className="text-sm font-mono bg-white p-2 rounded border block text-black break-all">{smile}</code>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(smile, index)}
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {copiedIndex === index ? (
                          <>
                            <IoCheckmarkSharp className="w-4 h-4 mr-1 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <IoCopySharp className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {moleculeData && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <p className="text-sm text-gray-600">Ready to analyze your molecules?</p>
              <div className="flex gap-3">
                <Button onClick={fetchMolecule} variant="outline">
                  Generate New
                </Button>
               
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=>{ onNext(); onClose()}}>
                    <MdAnalytics className="w-4 h-4 mr-2" />
                    Analyze Molecules
                  </Button>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
