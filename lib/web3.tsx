"use client"

import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { WagmiProvider } from "wagmi"
import { polygon, sepolia, bscTestnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

// 1. 获取项目ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id"

// 2. 创建wagmiConfig
const metadata = {
  name: "去中心化聊天DApp",
  description: "基于区块链的去中心化聊天应用",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [bscTestnet, sepolia, polygon] as const
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. 创建modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

// 4. 创建query client
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
