import Image from "next/image"
import { Button } from "@/components/ui/button"
import {  ChevronRight } from "lucide-react"
import { Card, CardHeader, CardDescription }  from "@/components/ui/card"
import Link from "next/link"

export default function Introduction() {
    return(
        <section className="md:w-10/12  w-11/12 mx-auto text-white">
            <h1 className="text-center font-inter md:text-[24px] text-[18px] font-light pt-16">Welcome to the Future of Drug Discovery<br/>& DeFi</h1>

            <div className="md:flex items-center relative md:pt-0 pt-12">
                <div className="md:w-8/12">
                    <Card className="">
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#FF12C4] w-[4px] h-[50px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-3xl text-white">DeMol Team</h1>
                            </div>
                        </CardHeader>
                        <CardDescription>
                            <span className="text-[#C4C4C4] font-inter text-[18px]">We are building a radical new infrastructure where decentralized AI agents, DeFi primitives and verifiable machine learning combine to accelerate and democratize drug discovery—on-chain.</span>
                        </CardDescription>
                    </Card>
                </div>
                <div className="">
                    {/* <Image
                       src="/gradients/introduction.png"
                       alt="gradient"
                       width={100}
                       height={10}
                       quality={100}
                       className="absolute bottom-[-10rem] right-[-20rem] w-full"
                
                    /> */}
                    <Image
                      src="/images/tempImagelGCkyV1.png"
                      alt="image"
                      height={700}
                      width={700}
                      quality={100}
                      className=""
                    />
                </div>

            </div>

            <div>
              <h2 className="text-[18px] text-center font-light md:w-full w-9/12 mx-auto">“Tokenizes real-world drug IP for on-chain ownership”</h2>
              <Image 
                src="/images/chemFormula.png"
                alt="formula"
                width={800}
                height={800}
                quality={100}
                className="block mx-auto h-20 w-auto mt-5 "
              />
            </div>

            <div>
                <Link href="/action">
                    <Button className="bg-transparent border-[1px] border-white flex gap-1 text-white rounded-none  mx-auto p-5 mt-10">
                        <span className="uppercase  font-barlow font-[400]">get started</span>
                        <ChevronRight />
                    </Button>
                </Link>
            </div>

        </section>
    )

}