"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Coins } from "lucide-react"

export function BSCTestnetGuide() {
  const addBSCTestnet = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x61", // 97 in hex
            chainName: "BSC Testnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "tBNB",
              decimals: 18,
            },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ],
      })
    } catch (error) {
      console.error("添加网络失败:", error)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          BSC测试网设置
        </CardTitle>
        <CardDescription>此DApp运行在BSC测试网上，您需要添加网络并获取测试币</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={addBSCTestnet} variant="outline" className="w-full bg-transparent">
          添加BSC测试网到钱包
        </Button>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>网络信息：</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>网络名称: BSC Testnet</li>
            <li>Chain ID: 97</li>
            <li>RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/</li>
            <li>区块浏览器: https://testnet.bscscan.com/</li>
          </ul>
        </div>

        <Button
          variant="link"
          className="w-full p-0 h-auto text-blue-600"
          onClick={() => window.open("https://testnet.binance.org/faucet-smart", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          获取测试币 (BSC Faucet)
        </Button>
      </CardContent>
    </Card>
  )
}
