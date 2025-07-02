import { Card } from "@/components/ui/card"
import { Search, TestTubeDiagonal } from "lucide-react"
import { MoleculeGenerationModal } from "@/components/ui/moleculeGenerationModal"
import { useState } from "react";

export default function Action({ onNext }: { onNext: () => void }) {

   const [showGenerationModal, setShowGenerationModal] = useState(false)

  return (
    <section>
      <div>
        <h1 className="font-inter md:text-[24px] text-[18px] grid text-center">
          <span className="font-[400]">
            AI Agents for <span className="text-[#FF12C4]">Molecule </span>Discovery & Evaluation
          </span>
          <span className="text-white/61 font-[300]">
            Discover, analyze and tokenize.
          </span>
        </h1>

        <div className="flex justify-center gap-6 pt-6 w-5/12 mx-auto">
          <Card className="w-5/12 shadow-sm cursor-pointer" onClick={onNext}>
            <Search className="text-[#FFD147]" />
            <p>
              <span className="font-[400] inter text-white text-[18px] font-inter">
                Analyze<br/>Molecule
              </span>
            </p>
          </Card>
          <Card className="w-5/12 shadow-sm cursor-pointer" onClick={() => setShowGenerationModal(true)}>
            <TestTubeDiagonal className="text-[#BD9AF8]" />
            <p>
              <span className="font-[400] inter text-white text-[18px] font-inter">
                Molecule<br/>Generation
              </span>
            </p>
          </Card>
        </div>
      </div>
       <MoleculeGenerationModal onNext={onNext} isOpen={showGenerationModal} onClose={() => setShowGenerationModal(false)} />
    </section>
  );
}
