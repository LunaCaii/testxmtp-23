"use client"

import { useAccount, useChainId } from "wagmi"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, AlertTriangle } from "lucide-react"

export function NetworkInfo() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected) return null

  const isBSCTestnet = chainId === 97

  return (
    <Alert className={`mb-4 ${isBSCTestnet ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
      {isBSCTestnet ? (
        <Info className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription className={isBSCTestnet ? "text-green-800" : "text-yellow-800"}>
        {isBSCTestnet ? (
          <>
            <strong>✅ 已连接到BSC测试网</strong>
            <br />
            网络ID: {chainId} - 这是正确的网络，可以正常使用所有功能。
          </>
        ) : (
          <>
            <strong>⚠️ 网络不匹配</strong>
            <br />
            当前网络ID: {chainId}。请切换到BSC测试网 (Chain ID: 97) 以使用此DApp。
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
