"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export function ConnectWallet() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          <LogOut className="h-4 w-4 mr-2" />
          断开连接
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => open()} className="bg-blue-600 hover:bg-blue-700">
      <Wallet className="h-4 w-4 mr-2" />
      连接钱包
    </Button>
  )
}
