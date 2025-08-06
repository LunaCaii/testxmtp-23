"use client"

import { useChainId } from "wagmi"
import { useEffect, useState } from "react"

export function useNetworkCheck() {
  const chainId = useChainId()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  useEffect(() => {
    // BSC测试网的Chain ID是97
    setIsCorrectNetwork(chainId === 97)
  }, [chainId])

  return {
    isCorrectNetwork,
    currentChainId: chainId,
    requiredChainId: 97,
    networkName: chainId === 97 ? "BSC测试网" : `网络 ${chainId}`,
  }
}
