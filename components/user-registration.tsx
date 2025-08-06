"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet } from "@/components/connect-wallet"
import { chatDAppAddress, chatDAppABI } from "@/lib/contract"
import { User, ImageIcon } from "lucide-react"
import { NetworkInfo } from "@/components/network-info"
import { useNetworkCheck } from "@/hooks/use-network-check"

export function UserRegistration() {
  const { address } = useAccount()
  const { isCorrectNetwork } = useNetworkCheck()
  const [nickname, setNickname] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const handleRegister = async () => {
    if (!nickname.trim()) return

    writeContract({
      address: chatDAppAddress,
      abi: chatDAppABI,
      functionName: "register",
      args: [nickname, avatarUrl || ""],
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">欢迎使用聊天DApp</CardTitle>
          <CardDescription>请先注册您的个人资料</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NetworkInfo />

          <div className="flex justify-center mb-4">
            <ConnectWallet />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">昵称 *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nickname"
                placeholder="输入您的昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">头像URL (可选)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="avatar"
                placeholder="输入头像图片URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {avatarUrl && (
            <div className="flex justify-center">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt="头像预览"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}

          <Button
            onClick={handleRegister}
            disabled={!nickname.trim() || isPending || isConfirming || !isCorrectNetwork}
            className="w-full"
          >
            {isPending || isConfirming ? "注册中..." : "注册"}
          </Button>

          {hash && <p className="text-sm text-green-600 text-center">注册交易已提交，请等待确认...</p>}
        </CardContent>
      </Card>
    </div>
  )
}
