import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

export default function Result() {
    return(
        <section>
            <Card className="w-8/12 mx-auto">
                <CardHeader className="flex justify-between items-end ">
                    <div className="flex gap-4 items-center">
                        <div>
                            <Image
                              src="/logo/logo.png"
                              alt="logo"
                              width={100}
                              height={100}
                              className="w-10 h-auto"
                            />
                        </div>
                        <div className="flex gap-4 items-center">
                            <h1 className="text-white font-[400]">DeMol</h1>
                            <p className="text-white/50 text-[12px]">just now</p>
   
                        </div>
                    </div>
                    <div>
                        <Copy className="text-white/50 cursor-pointer" size={14} />
                    </div>
                </CardHeader>

                <CardContent className="pl-14">
                    <p className="text-white/50 text-[12px]">
                        {"I have analyzed the provided SMILES string CC(C)CC1=CC=C(C=C1)C(C)C(=O)O in detail. The molecule has a molecular weight of 206.28 g/mol, a logP value of 3.85, 1 hydrogen bond donor, and 2 hydrogen bond acceptors. These properties fall within the acceptable ranges defined by Lipinski's Rule of Five, suggesting good drug-likeness. Additionally, no major structural alerts were identified. Based on this assessment, the molecule appears to be a promising drug candidate worthy of further exploration. I will now proceed with tokenizing this IP by minting an NFT on the blockchain."}
                    </p>
                </CardContent>

                <CardFooter className="flex gap-2 pl-14">
                    <Badge className="rounded-lg text-[14px] p-1 px-4 bg-[#007341]/50 text-[#07FFB0]">Eligible</Badge>
                    <Badge className="rounded-lg text-[14px] p-1 px-4">Transaction Completed</Badge>
                </CardFooter>
            </Card>
            <div className="w-8/12 mx-auto pt-2">
                <div className="flex gap-2 items-center">
                    <p className="flex gap-5 text-[14px] text-white/61">
                        <span>Txn hash</span>
                        <span>0x03343b7ea992dab3b9591...</span>
                    </p>
                    <Copy size={10}/>
                </div>
            </div>
            <div>
                <p className="text-black text-[14px] text-center pt-6">0x03343b7ea992dab3b9591d4b9c16469b83e56d5e0a8c39dfd3bb45083c47cdcf\n\n\u2705</p>
            </div>
        </section>
    )
}