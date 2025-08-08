'use client'

import { ChatWindow } from '@/components/chat-window'
import { useXMTP } from '@/contexts/XMTPContext'
import { useConversation } from '@/hooks/useConversation'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react' // Added useMemo
import { useMobile } from '@/hooks/use-mobile'
import { useConversations } from '@/hooks/useConversations'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useToast } from '@/hooks/use-toast'
import { DmConversation, Group } from '@xmtp/browser-sdk'
import { isValidEthereumAddress, isValidInboxId } from '@/helpers/strings' // 导入新的辅助函数
import { MobileLayout } from '@/components/mobile-layout' // Import MobileLayout
import { Button } from '@/components/ui/button' // Import Button
import { ArrowLeft } from 'lucide-react' // Import ArrowLeft icon

interface ConversationPageProps {
  params: {
    conversationId: string
  }
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = params
  const { client: xmtpClient } = useXMTP()
  const {
    getConversationById,
    loading: loadingConversations,
    newDm,
    newDmWithIdentifier,
  } = useConversations()
  const { address: myAddress } = useAccount()
  const router = useRouter()
  const isMobile = useMobile()
  const { toast } = useToast()

  const [conversation, setConversation] = useState<
    DmConversation | Group | undefined
  >(undefined)
  const [loadingConversation, setLoadingConversation] = useState(true)

  // Determine peer address for DMs to fetch friend profile
  const peerAddress = ''
  // const peerAddress = useMemo(() => {
  //   if (conversation instanceof DmConversation) {
  //     return conversation.peerAddress
  //   }
  //   return undefined
  // }, [conversation])

  const { profile: friendProfile } = useUserProfile(
    peerAddress as `0x${string}`
  )

  useEffect(
    () => {
      const fetchAndSetupConversation = async () => {
        setLoadingConversation(true)
        if (!xmtpClient) {
          router.push('/')
        }

        const targetConvo = await newDm(conversationId)
        setConversation(targetConvo)
        setLoadingConversation(false)

        // try {
        //   let convo: DmConversation | Group | undefined

        //   // 1. 尝试作为现有 XMTP 会话 ID 获取
        //   convo = await getConversationById(conversationId)
        //   console.log('获取到的现有会话:', convo)
        //   if (convo) {
        //     // console.log('获取到的现有会话:', convo)
        //     // setConversation(convo)
        //     // // If the URL is an address/inboxId but we found a topic, replace the URL
        //     // if (
        //     //   isValidEthereumAddress(conversationId) ||
        //     //   isValidInboxId(conversationId)
        //     // ) {
        //     //   router.replace(`/conversations/${convo.id}`)
        //     // }
        //   } else {
        //     // // 2. 如果不是现有会话 ID，尝试作为 inboxId 或 Ethereum 地址创建 DM
        //     // let targetConvo: DmConversation | undefined
        //     // if (isValidEthereumAddress(conversationId)) {
        //     //   console.log('尝试通过以太坊地址创建DM:', conversationId)
        //     //   targetConvo = await newDmWithIdentifier({
        //     //     identifier: conversationId,
        //     //     identifierKind: 'Ethereum',
        //     //   })
        //     // } else if (isValidInboxId(conversationId)) {
        //     //   console.log('尝试通过Inbox ID创建DM:', conversationId)
        //     //   targetConvo = await newDm(conversationId)
        //     // }
        //     // if (targetConvo) {
        //     //   console.log('成功创建新DM:', targetConvo)
        //     //   setConversation(targetConvo)
        //     //   // 成功创建 DM，将 URL 替换为实际的 XMTP 会话 ID (topic)
        //     //   router.replace(`/conversations/${targetConvo.id}`)
        //     // }
        //     // else {
        //     //   // 3. 既不是现有会话ID，也不是有效的 inboxId/Ethereum地址
        //     //   console.warn(
        //     //     `无效的会话ID或地址，无法找到或创建会话: ${conversationId}`
        //     //   )
        //     //   toast({
        //     //     title: '无效的链接',
        //     //     description: '无法找到或创建会话。请检查地址或会话ID。',
        //     //     variant: 'destructive',
        //     //   })
        //     //   router.push('/')
        //     //   return
        //     // }
        //   }
        // } catch (error) {
        //   console.error(`加载或创建会话失败 (ID: ${conversationId}):`, error)
        //   toast({
        //     title: '错误',
        //     description: '加载会话时发生错误。请重试或检查网络。',
        //     variant: 'destructive',
        //   })
        //   router.push('/')
        //   return
        // } finally {
        //   setLoadingConversation(false)
        // }
      }
      void fetchAndSetupConversation()
    },
    [
      // xmtpClient,
      // conversationId,
      // getConversationById,
      // newDm,
      // newDmWithIdentifier,
      // router,
      // toast,
    ]
  )

  // 使用 useConversation hook
  const {
    messages,
    getMessages,
    streamMessages,
    loading: loadingMessages,
    send,
    sending,
  } = useConversation(conversation) // 传入获取到的会话对象

  // 如果 XMTP 客户端未连接或会话未找到，显示加载状态
  if (!xmtpClient || loadingConversation || !conversation) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>加载会话中...</p>
        </div>
      </div>
    )
  }

  const mainContent = (
    <ConversationProvider conversation={conversation}>
      <ChatWindow
        conversation={conversation}
        messages={messages}
        loadingMessages={loadingMessages}
        send={send}
        xmtpClient={xmtpClient}
        getMessages={getMessages}
        streamMessages={streamMessages}
        sending={sending}
        myAddress={myAddress}
        friendProfile={friendProfile} // 传递好友资料 (可能为 null)
      />
    </ConversationProvider>
  )

  // For mobile, we use MobileLayout to show a back button and title
  if (isMobile) {
    return (
      <MobileLayout
        sidebar={null} // Sidebar is not shown on this page in mobile
        main={mainContent}
        showBackButton={true}
        onBack={() => router.push('/')} // Go back to main chat app
        title={friendProfile?.nickname || '聊天'}
      />
    )
  }

  // For desktop, just render the chat window directly
  return <div className='h-screen'>{mainContent}</div>
}
