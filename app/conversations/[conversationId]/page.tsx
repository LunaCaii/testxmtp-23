'use client'

import { ChatWindow } from '@/components/chat-window'
import { useXMTP } from '@/contexts/XMTPContext'
import { useConversation } from '@/hooks/useConversation'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMobile } from '@/hooks/use-mobile'
import { useConversations } from '@/hooks/useConversations'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useToast } from '@/hooks/use-toast'
import { DmConversation, Group } from '@xmtp/browser-sdk'
import { isValidEthereumAddress, isValidInboxId } from '@/helpers/strings' // 导入新的辅助函数

interface ConversationPageProps {
  params: {
    conversationId: string // 这可能是 XMTP 会话的唯一 ID，也可能是 inboxId/Ethereum 地址
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

  const [conversation, setConversation] = useState<any>(undefined)
  const [friendAddress, setFriendAddress] = useState<string | undefined>(
    undefined
  ) // 对于 DM，这将是对等地址

  useEffect(() => {
    const fetchAndSetupConversation = async () => {
      if (!xmtpClient || !conversationId) {
        if (!xmtpClient && !loadingConversations) {
          router.push('/')
        }
        return
      }

      try {
        // 1. 首先尝试作为现有 XMTP 会话 ID 获取
        let convo = await getConversationById(conversationId)

        if (convo) {
          // 找到了现有会话
          console.log('获取到的会话:', convo)
          setConversation(convo)
          router.replace(`/conversations/${convo.id}`)
          // if (convo instanceof DmConversation) {
          //   setConversation(convo)
          //   // setFriendAddress(convo.peerAddress)
          // } else if (convo instanceof Group) {
          //   if (!convo.isActive) {
          //     console.warn(
          //       `Group conversation (ID: ${conversationId}) is inactive.`
          //     )
          //     toast({
          //       title: '群聊不活跃',
          //       description: '该群聊已不活跃，无法发送消息。',
          //       variant: 'destructive',
          //     })
          //     router.push('/')
          //     return
          //   }
          //   setConversation(convo)
          //   setFriendAddress(undefined) // 群聊没有单一的 friendAddress
          //   toast({
          //     title: '群聊功能',
          //     description: '当前版本已支持群聊，但部分高级功能仍在开发中。',
          //     variant: 'default',
          //   })
          // } else {
          //   console.error('Unexpected conversation type:', convo)
          //   toast({
          //     title: '错误',
          //     description: '无法识别的会话类型。',
          //     variant: 'destructive',
          //   })
          //   router.push('/')
          //   return
          // }
        } else {
          // 2. 如果不是现有会话 ID，尝试作为 inboxId 或 Ethereum 地址创建 DM
          let targetConvo: DmConversation | undefined

          if (isValidEthereumAddress(conversationId)) {
            targetConvo = await newDmWithIdentifier({
              identifier: conversationId,
              identifierKind: 'Ethereum',
            })
          } else if (isValidInboxId(conversationId)) {
            targetConvo = await newDm(conversationId)
          }

          if (targetConvo) {
            setConversation(targetConvo)
            // setFriendAddress(targetConvo.peerAddress)
            // 成功创建 DM，将 URL 替换为实际的 XMTP 会话 ID (topic)
            router.replace(`/conversations/${targetConvo.id}`)
          } else {
            // 3. 既不是现有会话ID，也不是有效的 inboxId/Ethereum地址
            // console.warn(`无效的会话ID或地址: ${conversationId}`)
            // toast({
            //   title: '无效的链接',
            //   description: '无法找到或创建会话。',
            //   variant: 'destructive',
            // })
            // router.push('/')
            return
          }
        }
      } catch (error) {
        console.error(`加载或创建会话失败 (ID: ${conversationId}):`, error)
        toast({
          title: '错误',
          description: '加载会话时发生错误。',
          variant: 'destructive',
        })
        router.push('/')
        return
      }
    }
    void fetchAndSetupConversation()
  }, [
    xmtpClient,
    conversationId,
    // getConversationById,
    // newDm,
    // newDmWithIdentifier,
    // router,
    // loadingConversations,
    // toast,
  ])

  // 使用 useConversation hook
  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
    streamMessages,
    getMessages,
  } = useConversation(conversation) // 传入获取到的会话对象

  // 只有当 friendAddress 存在时才获取 friendProfile
  const { profile: friendProfile } = useUserProfile(
    friendAddress as `0x${string}`
  )

  // 如果 XMTP 客户端未连接或会话未找到，显示加载状态
  if (!xmtpClient || !conversation) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>加载会话中...</p>
        </div>
      </div>
    )
  }

  return (
    <ConversationProvider conversation={conversation}>
      <ChatWindow
        conversation={conversation}
        friendAddress={friendAddress} // 传递从会话中获取的好友地址 (可能为 undefined)
        messages={messages}
        loadingMessages={loadingMessages}
        send={send}
        sending={sending}
        myAddress={myAddress}
        friendProfile={friendProfile} // 传递好友资料 (可能为 null)
      />
    </ConversationProvider>
  )
}
