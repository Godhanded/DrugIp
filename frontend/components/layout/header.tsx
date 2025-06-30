"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IoWalletSharp } from "react-icons/io5"
import { MdAccountBalanceWallet } from "react-icons/md"
import { BiLogOut } from "react-icons/bi"
import MobileNav from "@/components/layout/mobileNav"
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { avalancheFuji, sepolia } from "wagmi/chains"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropDown"
import { WalletSelector } from "@/components/ui/walletSelector"

export default function Header() {

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [showWalletSelector, setShowWalletSelector] = useState(false)


  const navLinks = [
    {
      title: "try it out",
      link: "/action",
      out:false
    },
    {
      out:true,
      title: "Demo Video",
      link: "https://www.youtube.com/watch?v=vr6uVH4u8zQ",
    },
    {
      out: true,
      title: "github",
      link: "https://github.com/Godhanded/DrugIp/tree/main",
    },
    {
      title: "dao",
      link: "/dao",
      out: false
    }
  ]

  const handleConnectClick = () => {
    setShowWalletSelector(true)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleSwitchChain = (targetChainId: number) => {
    if (chainId !== targetChainId) {
      switchChain({ chainId: targetChainId })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getCurrentChainName = () => {
    switch (chainId) {
      case avalancheFuji.id:
        return "Avalanche Fuji"
      case sepolia.id:
        return "Ethereum Sepolia"
      default:
        return "Unknown Network"
    }
  }

  const isCorrectChain = chainId === avalancheFuji.id || chainId === sepolia.id

  return (
    <header className="w-11/12 mx-auto py-4 md:grid md:grid-cols-3 flex md:justify-normal justify-between items-center bg-transparent">
      <div className="flex justify-start items-center gap-6">
        <Link href="/" >
           <Image
             src="/logo/logo.png"
             alt="DeMol"
             width={600}
             height={600}
             quality={100}
             className="w-10 h-10"
           />
        </Link>
        <Link href="https://bolt.new/">
          <Image
            src="logo/boltnew.png"
            alt="bolt.new"
            width={600}
            height={600}
            className="w-10 h-10"
          />
        </Link>
      </div>

      <nav className="hidden md:flex justify-center gap-8">
        {navLinks.map((nav, index) => (
          <Link key={index} href={nav.link} target={nav.out ==true?"_blank":undefined}
  rel={nav.out ? "noopener noreferrer" : undefined} >
            <span
              className={`uppercase transition-colors duration-300 font-montserrat md:text-[14px] font-thin`}
            >
              {nav.title}
            </span>
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex justify-end">
          {!isConnected ? (
            <Button
              onClick={handleConnectClick}
              className="uppercase text-white gap-2 bg-transparent border-[1px] border-white p-1 rounded-none hover:bg-white hover:text-black transition-colors"
            >
              <span className="font-semibold font-barlow tracking-tight">Connect Wallet</span>
              <IoWalletSharp />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="uppercase text-white gap-2 bg-transparent border-[1px] border-white p-1 rounded-none hover:bg-white hover:text-black transition-colors">
                  <MdAccountBalanceWallet />
                  <span className="font-semibold font-barlow tracking-tight">{formatAddress(address!)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[rgba(10,15,33,0.9)]" align="end">
                <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">Address:</div>
                  <div className="text-muted-foreground font-mono text-xs break-words">{address}</div>
                </div>

                <DropdownMenuSeparator />

                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">Network:</div>
                  <div className={`text-xs ${isCorrectChain ? "text-green-600" : "text-red-600"}`}>
                    {getCurrentChainName()}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleSwitchChain(avalancheFuji.id)}
                  className={chainId === avalancheFuji.id ? "bg-muted" : ""}
                >
                  <span className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${chainId === avalancheFuji.id ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    Avalanche Fuji
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSwitchChain(sepolia.id)}
                  className={chainId === sepolia.id ? "bg-muted" : ""}
                >
                  <span className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${chainId === sepolia.id ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    Ethereum Sepolia
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
                  <BiLogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>

      <div className="md:hidden">
        <MobileNav />
      </div>
  
      <WalletSelector isOpen={showWalletSelector} onClose={() => setShowWalletSelector(false)} />
    </header>
  )
}
