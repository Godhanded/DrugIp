import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import {llmRes, modelRes} from "@/components/action/form";

interface ResultProps {
  res: [llmRes, modelRes] 
}

export default function Result({res}: ResultProps) {
    const txhash= res[1].text.match(/TxHash:\s*(0x[a-fA-F0-9]{64})/)


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
                        {res![0]?.text}
                    </p>
                </CardContent>
                <CardContent className="pl-14">
                    <p className="text-white/50 text-[12px]">
                        {res![1]?.text}
                    </p>
                </CardContent>

                <CardFooter className="flex gap-2 pl-14">
                    <Badge className="rounded-lg text-[14px] p-1 px-4 bg-[#007341]/50 text-[#07FFB0]">Eligible</Badge>
                    <Badge className="rounded-lg text-[14px] p-1 px-4">Transaction {res[1]?.content.analysis.eligible? "Completed: IP minted to holding wallet": "Failed as drug candidate did not meet minimum viability score after further analysis"}</Badge>
                </CardFooter>
            </Card>
            <div className="w-8/12 mx-auto pt-2">
                <div className="flex gap-2 items-center">
                    <p className="flex gap-5 text-[14px] text-white/61">
                        <span>Txn hash</span>
                        <span>{txhash? txhash[1].substring(0,23):""}...</span>
                    </p>
                    <Copy size={10}/>
                </div>
            </div>
            <div>
                <p className="text-black text-[14px] text-center pt-6">{txhash? `${txhash[1]}\n\n`:"" }\u2705</p>
            </div>
        </section>
    )
}