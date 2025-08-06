import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/lib/web3"
import dynamic from "next/dynamic" // 导入 dynamic

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "去中心化聊天DApp",
  description: "基于区块链的去中心化聊天应用",
    generator: 'v0.dev'
}

// 动态导入 XMTPProvider 并禁用 SSR
const DynamicXMTPProvider = dynamic(() => import("@/contexts/XMTPContext").then((mod) => mod.XMTPProvider), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载聊天服务...</p>
      </div>
    </div>
  ),
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Web3Provider>
          <DynamicXMTPProvider>{children}</DynamicXMTPProvider> {/* 使用动态导入的组件 */}
        </Web3Provider>
      </body>
    </html>
  )
}
