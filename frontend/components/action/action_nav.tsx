import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ActionNav () {
    return(
        <div className="w-11/12 mx-auto py-4 md:grid md:grid-cols-3 flex md:justify-normal justify-between items-center bg-transparent">
            <div>
                <Image
                  src="/logo/footerLogo.png"
                  alt="DeMol"
                  width={100}
                  height={100}
                  className="w-auto h-10"
                />
            </div>

            <div className="flex justify-center gap-8">
                <Link href="#">Home</Link>
                <Link href="#">DAO</Link>
            </div>

            <div className="flex justify-end">
                <Button className="bg-transparent rounded-none border-[1px] text-white border-white"></Button>
            </div>
        </div>
    )
}