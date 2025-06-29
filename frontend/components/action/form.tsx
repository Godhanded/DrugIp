import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, Search } from "lucide-react"

export default function Form({ onNext }: { onNext: () => void }) {
  return (
    <section className="font-inter grid gap-3">
      <div className="grid gap-1">
        <Badge className="text-[14px] font-inter mx-auto flex rounded-full">
          <span>Tokenize Molecule</span>
          <Search className="mr-2 h-4 w-4" />
        </Badge>
        <p className="text-[18px] font-[300] text-center">
          Tokenize valid drug molecules found eligible by our Artificial Intelligence
        </p>
      </div>
      <div className="bg-transparent border-[1px] border-white rounded-lg flex p-2 w-4/12 mx-auto">
        <Input
          type="text"
          placeholder="Input a smile string"
          className="bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0 focus:border-none"
        />
        <Button className="bg-white/5" onClick={onNext}>
          <Send />
        </Button>
      </div>
    </section>
  );
}
