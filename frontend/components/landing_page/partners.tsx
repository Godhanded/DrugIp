import Image from "next/image"
import Link from "next/link"

export default function Partners() {
    const logo =[
        {
            name: "chainlink",
            image: "/logo/chainlink.png",
            link: "https://github.com/Godhanded/DrugIp/blob/de80c51e0fa104df45a057fc0a807834c07604b5/DrugIp/src/DrugIp.sol#L145"
        },
        {
            name: "elizaos",
            image: "/logo/elizaos.png",
            link:"https://github.com/Godhanded/DrugIp/blob/de80c51e0fa104df45a057fc0a807834c07604b5/ElizaOs/src/custom-plugins/actions/getSmiles.ts#L146"
        },  
        {
            name: "avalanche",
            image: "/logo/avalanche.png",
            link:"https://testnet.snowscan.xyz/address/0x37D925e493c3df57A0164e6Fe7a4d67b94261C7c#code"
        },  
        {
            name: "aws",
            image: "/logo/aws.png",
            link:"https://github.com/Godhanded/DrugIp/blob/de80c51e0fa104df45a057fc0a807834c07604b5/ElizaOs/src/custom-plugins/actions/analyzeMolecule.ts#L236"
        },
        {
            name: "supabase",
            image: "/logo/supabase.png",
            link: ""
        },
        {
            name: "netlify",
            image: "/logo/netlify.png",
            link: ""
        }
    ]
    return(
        <section className="bg-[#FFFFFF0D] md:py-8 py-14 w-full">
            <div className="grid  md:flex justify-items-center justify-center items-center md:gap-16 gap-10">
                {logo.map((partner, index) => (
                    <Link href={partner.link} key={index} target="_blank">
                    <Image
                      key={index}
                      src={partner.image}
                      alt={partner.name}
                      width={1000}
                      height={1000}
                      quality={100}
                      className="h-5 w-auto flex-shrink-0 flex-nowrap"
                    />
                    </Link>
                ))}
            </div>
        </section>
    )
}