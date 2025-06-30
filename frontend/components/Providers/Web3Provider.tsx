"use client"

import type React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { avalancheFuji, sepolia } from "wagmi/chains"
import { metaMask, coinbaseWallet, injected } from "wagmi/connectors"
import "@rainbow-me/rainbowkit/styles.css"

const config = createConfig({
  chains: [avalancheFuji, sepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: "DeMol" }),
    // walletConnect({ projectId: "YOUR_PROJECT_ID" }), // Replace with your actual project ID
    injected({ target: "trust" }),
  ],
  transports: {
    [avalancheFuji.id]: http(),
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={avalancheFuji}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
