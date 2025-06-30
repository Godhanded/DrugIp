import {Card, CardHeader, CardContent } from "@/components/ui/card"
export default function Features() {
    return(
        <section className="w-10/12 mx-auto py-16 text-white">
            <div className="grid md:grid-cols-3 gap-10 items-center">
                <div>
                    <p className="text-inter w-10/12 pb-1">Drug discovery today is costly, centralized, and slow. We’re reimagining it entirely</p>
                    <p className="font-anton text-[#c4c4c4] pb-5">The Vision</p>
                    <Card>
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#9945FF] w-[4px] h-[40px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-xl text-white">Chainlink</h1>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="grid gap-3 text-white">
                                <span>Chainlink’s oracle network powers secure automation, on-chain minting, and cross-chain interactions via CCIP—ensuring seamless connectivity and trustless execution.</span>
                                <span className="font-[400] text-2xl">1,000+</span>
                                <span className="uppercase text-[#c4c4c4]">automated data triggers</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-8">
                    <Card>
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#1FCFF1] w-[4px] h-[40px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-xl  text-white">Intelligent ML agents</h1>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="grid gap-3  text-white">
                                <span>These agents can rapidly generate and evaluate molecules for properties like toxicity and Drug-likeness.</span>
                                <span className="font-[400] text-2xl">10M+</span>
                                <span className="uppercase text-[#c4c4c4]">molecules scored per day</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#4B45FF] w-[4px] h-[40px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-xl  text-white">Avalanche</h1>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="grid gap-3  text-white">
                                <span>Built on Avalanche to enable high-speed, low-cost, and eco-efficient on-chain science—ideal for deploying scalable, data-rich AI and DeFi infrastructure.</span>
                                <span className="font-[400] text-2xl">{"<"}1s</span>
                                <span className="uppercase text-[#c4c4c4]">finality for every transaction</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-8">
                    <Card>
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#19FB9B] w-[4px] h-[40px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-xl  text-white">ELiZA OS</h1>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="grid gap-3  text-white">
                                <span>ELiZA OS provides a decentralized, tamper-proof environment where autonomous AI agents operate under cryptographic guarantees</span>
                                <span className="font-[400] text-2xl">100%</span>
                                <span className="uppercase text-[#c4c4c4]">verifiable agent execution</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex gap-3 items-center">
                            <div className="bg-[#FFD512] w-[4px] h-[40px] rounded-full"></div>
                            <div>
                                <h1 className="font-[400] text-xl  text-white">AWS</h1>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="grid gap-3  text-white">
                                <span>AWS S3 for scalable storage of molecular data and NFT metadata, ensuring secure and reliable access across the platform.</span>
                                <span className="font-[400] text-2xl">1M+</span>
                                <span className="uppercase text-[#c4c4c4]">metadata records stored for NFTs</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}