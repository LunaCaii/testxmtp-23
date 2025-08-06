"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { isAddress } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chatDAppAddress, chatDAppABI } from "@/lib/contract"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useNetworkCheck } from "@/hooks/use-network-check"
import { UserPlus, Search, CheckCircle, XCircle } from "lucide-react"

export function AddFriend() {
  const { address } = useAccount()
  const { isCorrectNetwork } = useNetworkCheck()
  const [friendAddress, setFriendAddress] = useState("")
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  // 检查用户是否已注册
  const { data: isRegistered } = useReadContract({
    address: chatDAppAddress,
    abi: chatDAppABI,
    functionName: "isUserRegistered",
    args: searchedAddress ? [searchedAddress as `0x${string}`] : undefined,
  })

  // 检查是否已经是好友
  const { data: areFriends } = useReadContract({
    address: chatDAppAddress,
    abi: chatDAppABI,
    functionName: "areFriends",
    args: address && searchedAddress ? [address, searchedAddress as `0x${string}`] : undefined,
  })

  const { profile } = useUserProfile(searchedAddress as `0x${string}`)

  const handleSearch = () => {
    if (isAddress(friendAddress)) {
      setSearchedAddress(friendAddress)
    } else {
      setSearchedAddress(null)
    }
  }

  const handleAddFriend = async () => {
    if (!searchedAddress || !isAddress(searchedAddress)) return

    writeContract({
      address: chatDAppAddress,
      abi: chatDAppABI,
      functionName: "addFriend",
      args: [searchedAddress as `0x${string}`],
    })
  }

  const canAddFriend =
    searchedAddress && isRegistered && !areFriends && searchedAddress.toLowerCase() !== address?.toLowerCase()

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">添加好友</h3>
        <p className="text-sm text-gray-600">输入好友的钱包地址来添加他们</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="address">钱包地址</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="address"
              placeholder="0x..."
              value={friendAddress}
              onChange={(e) => setFriendAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!friendAddress.trim() || !isCorrectNetwork} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 搜索结果 */}
        {searchedAddress && (
          <Card>
            <CardContent className="p-4">
              {!isAddress(searchedAddress) ? (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>无效的钱包地址格式</AlertDescription>
                </Alert>
              ) : searchedAddress.toLowerCase() === address?.toLowerCase() ? (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>不能添加自己为好友</AlertDescription>
                </Alert>
              ) : isRegistered === false ? (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>该用户尚未在BSC测试网上注册。请确保对方已经注册了账户。</AlertDescription>
                </Alert>
              ) : areFriends ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>已经是好友了</AlertDescription>
                </Alert>
              ) : isRegistered === undefined ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">检查注册状态中...</span>
                </div>
              ) : (
                // 用户已注册且不是好友的情况
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>{profile?.nickname?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{profile?.nickname || "未知用户"}</p>
                      <p className="text-sm text-gray-500">
                        {searchedAddress.slice(0, 10)}...{searchedAddress.slice(-8)}
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已在BSC测试网注册
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddFriend}
                    disabled={!canAddFriend || isPending || isConfirming || !isCorrectNetwork}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isPending || isConfirming ? "添加中..." : "添加好友"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {hash && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>添加好友交易已提交，请等待确认...</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
