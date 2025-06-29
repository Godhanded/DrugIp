import Image from "next/image"
import Link from "next/link"
import { FaXTwitter , FaLinkedin} from "react-icons/fa6";

export default function Footer() {
    return(
        <footer className="bg-[#010515] py-16">
            <div className="w-10/12 mx-auto md:flex gap-32">
                <div className="flex-shrink-0 flex-nowrap md:pb-0 pb-10">
                    <Image
                       src="/logo/footerLogo.png"
                       alt="logo"
                       width={200}
                       height={200}
                       quality={100}
                       className="w-auto h-10"
                    />
                    <p className="text-[14px] font-light pt-5">Built at the edge of science and decentralization.</p>
                </div>

                <div className="w-full grid md:grid-cols-3 md:gap-0 gap-10 items-start">
                    <div className="grid gap-1 text-[14px]">
                        <h1 className="uppercase font-[500]  text-base text-[#C4C4C4] pb-2 ">product</h1>
                        <Link href="#">Features</Link>
                        <Link href="#">How it works</Link>
                        <Link href="#">Roadmap</Link>
                        <Link href="#">FAQ</Link>
                    </div>

                    <div className="grid gap-1 text-[14px]">
                        <h1 className="uppercase font-[500] text-base text-[#C4C4C4] pb-2">developers</h1>
                        <Link href="#">Github</Link>
                        <Link href="#">Documentation</Link>
                    </div>

                    <div className="grid gap-1 text-[14px]">
                        <h1 className="uppercase font-[500] text-base text-[#C4C4C4] pb-2">company</h1>
                        <Link href="#">About us</Link>
                        <Link href="#">Terms of use</Link>
                        <Link href="#">Privacy policy</Link>
                    </div>
                </div>
            </div>

            <div className="w-[95%] mx-auto md:border-t-[1px] md:border-b-[1px] py-3 mt-10">
                <div className="w-10/12 mx-auto md:flex justify-between">
                    <p className="font-thin text-[12px] md:pb-0 pb-10">Copyright &copy;2025 DeMol. All rights reserved.</p>
                    <div className="flex gap-5 text-[#CACACA]">
                        <FaXTwitter/>
                        <FaLinkedin className="border-x-[1px]"/>
                    </div>
                </div>
            </div>
             
        </footer>
    )
}