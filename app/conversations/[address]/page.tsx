"use client"

import { ChatWindow } from "@/components/chat-window"
import { useXMTP } from "@/contexts/XMTPContext"
import { useConversation } from "@/hooks/useConversation"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useConversations } from "@/hooks/useConversations" // Import useConversations
import { ConversationProvider } from "@/contexts/ConversationContext" // Import ConversationProvider

interface ConversationPageProps {
  params: {
    address: string // 好友的钱包地址
  }
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { address: friendAddress } = params
  const { client: xmtpClient } = useXMTP() // Removed conversations, loadingConversations from useXMTP
  const { conversations, loading: loadingConversations, newDm } = useConversations() // Use useConversations
  const { address: myAddress } = useAccount()
  const router = useRouter()
  const isMobile = useMobile()

  // Find the corresponding conversation
  const conversation = conversations.find((convo) => convo.peerAddress.toLowerCase() === friendAddress.toLowerCase())

  // Use useConversation hook
  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
    streamMessages,
    getMessages,
  } = useConversation(conversation)

  const { profile: friendProfile } = useUserProfile(friendAddress as `0x${string}`)

  // If XMTP client is not connected or conversation not found, redirect to home
  useEffect(() => {
    if (!xmtpClient && !loadingConversations) {
      router.push("/")
    } else if (!conversation && !loadingConversations && xmtpClient) {
      // If conversation does not exist, try to create a new one
      const createNewConversation = async () => {
        try {
          const newConvo = await newDm(friendAddress) // Use newDm from useConversations
          console.log("新会话已创建:", newConvo?.peerAddress)
          // The useConversations hook should automatically update the conversations state
        } catch (e) {
          console.error("创建新会话失败:", e)
          // If creation fails, might need to prompt user or redirect
          router.push("/")
        }
      }
      void createNewConversation()
    }
  }, [xmtpClient, conversation, loadingConversations, friendAddress, router, newDm]) // Added newDm to dependencies

  if (!xmtpClient || !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载会话中...</p>
        </div>
      </div>
    )
  }

  // ChatWindow now directly receives conversation object and send method
  return (
    <ConversationProvider conversation={conversation}>
      {" "}
      {/* Wrap ChatWindow with ConversationProvider */}
      <ChatWindow
        conversation={conversation}
        friendAddress={friendAddress}
        messages={messages}
        loadingMessages={loadingMessages}
        send={send}
        sending={sending}
        myAddress={myAddress}
        friendProfile={friendProfile}
      />
    </ConversationProvider>
  )
}
