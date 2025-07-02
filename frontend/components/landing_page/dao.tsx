import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function DAO() {
    return(
        <section className="relative h-[40vh] flex items-center justify-items-center justify-center overflow-y-hidden">
            <div>
                <p className="font-inter text-light text-[18px] text-center md:w-full w-11/12 mx-auto md:mx-0">“Be the first to access the platform, contribute to the DAO, or<br/>experiment with AI agents.”</p>
                <Link href="/dao">
                    <Button className="bg-transparent border-[1px] border-white flex gap-1 text-white rounded-none  mx-auto p-5 mt-3">
                        <span className="uppercase  font-barlow font-[400]">get started</span>
                        <ChevronRight />
                    </Button>
                </Link>
    
                <Image
                  src="/gradients/dao.png"
                  alt="gradient"
                  width={1000}
                  height={1000}
                  className="absolute bottom-[-35rem] left-1/2 -translate-x-1/2"
                />
            </div>
        </section>
    )
}