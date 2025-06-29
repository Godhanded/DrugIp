"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IoWalletSharp } from "react-icons/io5"
import MobileNav from "@/components/layout/mobileNav"

export default function Header() {
  // const pathname = usePathname()

  const navLinks = [
    {
      title: "try it out",
      link: "/action"
    },
    {
      title: "about",
      link: "#about"
    },
    {
      title: "github",
      link: "#github"
    },
    {
      title: "dao",
      link: "#dao"
    }
  ]

  return (
    <header className="w-11/12 mx-auto py-4 md:grid md:grid-cols-3 flex md:justify-normal justify-between items-center bg-transparent">
      <div className="flex justify-start">
        <Image
          src="/logo/logo.png"
          alt="DeMol"
          width={600}
          height={600}
          quality={100}
          className="w-10 h-10"
        />
      </div>

      <nav className="hidden md:flex justify-center gap-8">
        {navLinks.map((nav, index) => (
          <Link key={index} href={nav.link}>
            <span className={`uppercase hover:text-primary transition-colors duration-300 font-montserrat md:text-[14px] font-thin`}>
              {nav.title}
            </span>
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex justify-end">
        <Button  className="uppercase text-white gap-2 bg-transparent border-[1px] border-white p-1 rounded-none">
          <span className="font-semibold font-barlow tracking-tight">connect wallet</span>
          <IoWalletSharp />
        </Button>
      </div>

      <div className="md:hidden">
        <MobileNav/>
      </div>
    </header>
  )
}
