"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@/components/connect-wallet"
import { FriendsList } from "@/components/friends-list"
import { AddFriend } from "@/components/add-friend"
import { UserProfile } from "@/components/user-profile"
import { IPFSStatus } from "@/components/ipfs-status"
import { MobileLayout } from "@/components/mobile-layout"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, UserPlus, Settings } from "lucide-react"
import { NetworkInfo } from "@/components/network-info"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

type View = "friends" | "add-friend" | "profile"

export function ChatApp() {
  const { address } = useAccount()
  const isMobile = useMobile()
  const [currentView, setCurrentView] = useState<View>("friends")
  const router = useRouter()

  const handleStartChat = (friendAddress: string) => {
    // Navigate to dynamic route
    router.push(`/conversations/${friendAddress}`)
  }

  const sidebar = (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">聊天DApp</h1>
          {!isMobile && <ConnectWallet />}
        </div>

        {/* Network and Service Status */}
        <div className="space-y-2 mb-4">
          <NetworkInfo />
          <div className="flex justify-center space-x-2">
            <IPFSStatus />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={currentView === "friends" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("friends")}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            好友
          </Button>
          <Button
            variant={currentView === "add-friend" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("add-friend")}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            添加
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {currentView === "friends" && <FriendsList onStartChat={handleStartChat} />}
        {currentView === "add-friend" && <AddFriend />}
        {currentView === "profile" && <UserProfile />}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {isMobile && (
          <div className="mb-3">
            <ConnectWallet />
          </div>
        )}
        <Button
          variant={currentView === "profile" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentView("profile")}
          className="w-full flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          个人设置
        </Button>
      </div>
    </div>
  )

  const main = (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500 px-4">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">选择一个好友开始聊天</h3>
        <p className="text-sm">从好友列表中选择一个好友开始对话</p>
        <p className="text-xs mt-2 text-gray-400">支持发送图片和视频，存储在IPFS</p>
      </div>
    </div>
  )

  return <MobileLayout sidebar={sidebar} main={main} />
}
