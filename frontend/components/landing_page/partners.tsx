import Image from "next/image"

export default function Partners() {
    const logo =[
        {
            name: "chainlink",
            image: "/logo/chainlink.png"
        },
        {
            name: "elizaos",
            image: "/logo/elizaos.png"
        },  
        {
            name: "avalanche",
            image: "/logo/avalanche.png"
        },  
        {
            name: "aws",
            image: "/logo/aws.png"
        },
    ]
    return(
        <section className="bg-[#FFFFFF0D] md:py-8 py-14 w-full">
            <div className="grid  md:flex justify-items-center justify-center items-center md:gap-16 gap-10">
                {logo.map((partner, index) => (
                    <Image
                      key={index}
                      src={partner.image}
                      alt={partner.name}
                      width={1000}
                      height={1000}
                      quality={100}
                      className="h-5 w-auto flex-shrink-0 flex-nowrap"
                    />
                ))}
            </div>
        </section>
    )
}