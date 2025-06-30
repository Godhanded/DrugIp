import { FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Header from "../layout/header";
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-y-hidden overflow-x-hidden">
      <Header/>
      <div className="w-11/12 mx-auto md:h-full h-[70vh] flex items-center md:justify-normal justify-center ">
        <div>
          <h2 className="font-inter pb-0 text-[18px] md:text-left text-center leading-tight text-white">
            The Future of Pharma is<br />
            Autonomous, Intelligent, and Open.
          </h2>
          <h1 className="font-anton font-[400] md:text-[200px] text-[100px] md:text-left text-center leading-[0.9] mt-[20px] mb-[30px] text-white">
            DeMol
          </h1>
          <div className="grid md:flex gap-3 w-6/12 md:mx-0 mx-auto">
            <Link href="/action">
              <Button className="bg-transparent border-[1px] border-white flex gap-1 text-white rounded-none">
                <span className="uppercase font-barlow font-semibold">get started</span>
                <ChevronRight />
              </Button>
            </Link>

            <Button className="bg-transparent border-[1px] border-white flex gap-1 text-white rounded-none">
              <span className="uppercase font-barlow font-semibold">twitter</span>
              <FaTwitter />
            </Button>
          </div>
        </div>
        <div>
          {/* gradient */}
         {/* <Image
            src="/gradients/heroGradient.png"
            alt="gradient"
            height={100000000}
            width={100000000}
            className=""
          /> */}
          <Image
            src="/images/Vector.png"
            alt="gradient"
            height={500}
            width={500}
            className="absolute md:top-[5rem] md:right-[10%] left-[-2rem] bottom-[4rem] md:w-[200px] w-[200px] h-auto overflow-y-visible mix-blend-normal"
          />
          <Image
            src="/images/Group-1.png"
            alt="gradient"
            height={1000}
            width={1000}
            className="md:block hidden absolute md:bottom-[-5rem] md:right-0 md:w-[250px] w-[150px] h-auto overflow-y-visible mix-blend-normal"
          />
          <Image
            src="/images/Group.png"
            alt="gradient"
            height={1000}
            width={1000}
            className="absolute md:top-[40%] md:right-[25%] right-[-5rem] bottom-[4rem] md:w-[250px] w-[200px] h-auto overflow-y-visible mix-blend-normal"
          />
        </div>
      </div>
    </section>
  );
}
