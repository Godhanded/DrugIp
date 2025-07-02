"use client"

import { useState } from "react"
import { Connector, useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { IoWalletSharp, IoCloseSharp } from "react-icons/io5"
import { FaWallet } from "react-icons/fa"
import { MdAccountBalanceWallet } from "react-icons/md"
import { RiWallet3Fill } from "react-icons/ri"
import { BiWallet } from "react-icons/bi"

interface WalletSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletSelector({ isOpen, onClose }: WalletSelectorProps) {
  const { connect, connectors, isPending } = useConnect()
  const [connectingId, setConnectingId] = useState<string | null>(null)

  const handleConnect = async (connector: Connector) => {
    try {
      setConnectingId(connector.id)
      await connect({ connector })
      onClose()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setConnectingId(null)
    }
  }

  const getWalletIcon = (connectorId: string, connectorName: string) => {
    // Check by connector ID first, then by name
    if (connectorId.includes("metaMask") || connectorName.toLowerCase().includes("metamask")) {
      return (
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <FaWallet className="w-3 h-3 text-white" />
        </div>
      )
    }
    if (connectorId.includes("coinbase") || connectorName.toLowerCase().includes("coinbase")) {
      return (
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <MdAccountBalanceWallet className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (connectorId.includes("walletConnect") || connectorName.toLowerCase().includes("walletconnect")) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <RiWallet3Fill className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (connectorId.includes("trust") || connectorName.toLowerCase().includes("trust")) {
      return (
        <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
          <BiWallet className="w-4 h-4 text-white" />
        </div>
      )
    }
    return <IoWalletSharp className="w-6 h-6 text-gray-600" />
  }

  const getWalletName = (connectorId: string, connectorName: string) => {
    // Check by connector ID first, then by name, fallback to connector name
    if (connectorId.includes("metaMask") || connectorName.toLowerCase().includes("metamask")) {
      return "MetaMask"
    }
    if (connectorId.includes("coinbase") || connectorName.toLowerCase().includes("coinbase")) {
      return "Coinbase Wallet"
    }
    if (connectorId.includes("walletConnect") || connectorName.toLowerCase().includes("walletconnect")) {
      return "WalletConnect"
    }
    if (connectorId.includes("trust") || connectorName.toLowerCase().includes("trust")) {
      return "Trust Wallet"
    }
    return connectorName
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[rgba(10,15,33,0.7)]  rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isPending || connectingId === connector.id}
              className="w-full flex items-center justify-between p-4 h-auto bg-gray-50 hover:bg-gray-100 text-black border border-gray-200"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {getWalletIcon(connector.id, connector.name)}
                <span className="font-medium">{getWalletName(connector.id, connector.name)}</span>
              </div>
              {connectingId === connector.id && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              )}
            </Button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          By connecting a wallet, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
