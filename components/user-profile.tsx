"use client"

import { useAccount } from "wagmi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserProfile } from "@/hooks/use-user-profile"
import { User, Wallet } from "lucide-react"

export function UserProfile() {
  const { address } = useAccount()
  const { profile, isLoading } = useUserProfile(address)

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">个人资料</h3>

      <Card>
        <CardHeader className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">{profile?.nickname?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{profile?.nickname || "未知用户"}</CardTitle>
          <CardDescription>
            {address?.slice(0, 10)}...{address?.slice(-8)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Wallet className="h-4 w-4" />
            <span>钱包地址</span>
          </div>
          <p className="text-xs font-mono bg-gray-50 p-2 rounded border break-all">{address}</p>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>注册状态</span>
          </div>
          <p className="text-sm">
            {profile?.isRegistered ? (
              <span className="text-green-600">已注册</span>
            ) : (
              <span className="text-red-600">未注册</span>
            )}
          </p>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• 这是一个去中心化的聊天应用</p>
        <p>• 您的个人资料存储在区块链上</p>
        <p>• 消息暂时存储在本地浏览器中</p>
      </div>
    </div>
  )
}
