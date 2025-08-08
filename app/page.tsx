"use client"

import { useAccount } from "wagmi"
import { ConnectWallet } from "@/components/connect-wallet"
import { ChatApp } from "@/components/chat-app"
import { UserRegistration } from "@/components/user-registration"
import { useUserProfile } from "@/hooks/use-user-profile"
import { BSCTestnetGuide } from "@/components/bsc-testnet-guide"
import pkg from "@xmtp/browser-sdk/package.json";
import { useConnectXmtp } from "@/hooks/useConnectXmtp" // 导入 XMTP 连接 hook

export default function Home() {
  const { address, isConnected } = useAccount()
  const { profile, isLoading: isLoadingProfile } = useUserProfile(address)
  const { client: xmtpClient, loading: xmtpLoading, connect: connectXmtp } = useConnectXmtp() // 使用 XMTP 连接 hook

  // 如果钱包未连接
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">去中心化聊天DApp</h1>
          <p className="text-lg text-gray-600">连接您的钱包开始使用</p>

          <BSCTestnetGuide />

          <ConnectWallet />
        </div>
      </div>
    )
  }

  // 如果正在加载用户资料或 XMTP 客户端
  if (isLoadingProfile || xmtpLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果用户未注册
  if (!profile?.isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <UserRegistration />
      </div>
    )
  }

  // 如果 XMTP 客户端未连接，尝试连接
  if (!xmtpClient) {
    // 可以在这里显示一个连接 XMTP 的按钮或提示
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">去中心化聊天DApp</h1>
          <p className="text-lg text-gray-600">XMTP 客户端未连接。</p>
          <p className="text-sm text-gray-600">请确保您的钱包已连接到正确的网络，并允许签名。</p>
          <ConnectWallet /> {/* 确保钱包已连接 */}
          <button
            onClick={connectXmtp}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            连接 XMTP
          </button>
        </div>
      </div>
    )
  }

  // 如果一切就绪，显示聊天应用
  return (
    <div className="min-h-screen bg-gray-50">
      <ChatApp />
    </div>
  )
}

console.log("[xmtp.chat] XMTP Browser SDK version:", pkg.version);
