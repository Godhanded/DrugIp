"use client"

import { useAccount, useChainId } from "wagmi"
import { avalancheFuji, sepolia } from "wagmi/chains"
import { Alert, AlertDescription } from "@/components/ui/alerts"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function WalletStatus() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">Please connect your wallet to continue</AlertDescription>
      </Alert>
    )
  }

  const isCorrectChain = chainId === avalancheFuji.id || chainId === sepolia.id

  if (!isCorrectChain) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Please switch to Avalanche Fuji or Ethereum Sepolia network
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        Wallet connected to {chainId === avalancheFuji.id ? "Avalanche Fuji" : "Ethereum Sepolia"}
      </AlertDescription>
    </Alert>
  )
}
