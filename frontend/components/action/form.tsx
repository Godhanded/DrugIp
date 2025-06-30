"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, Search } from "lucide-react"
import { useAccount } from "wagmi"
import { Alert, AlertDescription } from "@/components/ui/alerts"
import { AlertTriangle } from "lucide-react"

export type llmRes = {
  user: string
  text: string
  action: string
}

export type modelRes = {
  text: string
  content: {
  analysis: {
    eligible: boolean
    lipinski_pass: boolean
    logp: number
    mw: number
    num_h_acceptors: number
    num_h_donors: number
    qed: number
    sa_score: number
    tox_pred: {
      "NR-AR": number
      "NR-AhR": number
      "SR-ARE": number
      "SR-p53": number
    }
    tox_score: number
    timestamp: string
    passesThreshold: boolean
  }}
}

interface FormProps {
  onNext: () => void
  setRes: (res: [llmRes, modelRes]) => void
}

export default function Form({ onNext, setRes }: FormProps) {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  const handleSubmit = async () => {
    // Check if wallet is connected
    if (!isConnected || !address) {
      setError("Please connect your wallet first")
      return
    }

    // Check if input is not empty
    if (!inputValue.trim()) {
      setError("Please enter a SMILE string")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://godand0-drugip.sliplane.app/6306c3f9-cec9-04c1-8aae-14b86e4870f9/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: address,
          text: inputValue.trim(),
          userName: address,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log(responseData)
      // Call setRes with the response data
      setRes(responseData)

      // Call onNext to proceed to the next step
      onNext()
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <section className="font-inter grid gap-3">
      <div className="grid gap-1">
        <Badge className="text-[14px] font-inter mx-auto flex rounded-full">
          <span>Tokenize Molecule</span>
          <Search className="mr-2 h-4 w-4" />
        </Badge>
        <p className="text-[18px] font-[300] text-center">
          Tokenize valid drug molecules found eligible by our Artificial Intelligence
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50 w-4/12 mx-auto">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <Alert className="border-yellow-200 bg-yellow-50 w-4/12 mx-auto">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Please connect your wallet to submit molecules
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-transparent border-[1px] border-white rounded-lg flex p-2 w-4/12 mx-auto">
        <Input
          type="text"
          placeholder="Input a smile string"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !isConnected}
          className="bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0 focus:border-none"
        />
        <Button
          className="bg-white/5 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading || !isConnected || !inputValue.trim()}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send />
          )}
        </Button>
      </div>

      {/* Connected Wallet Info */}
      {isConnected && address && (
        <p className="text-xs text-white/70 text-center">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </section>
  )
}
