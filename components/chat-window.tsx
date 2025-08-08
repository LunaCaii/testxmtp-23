'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/file-upload'
import { MediaMessage } from '@/components/media-message'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useMobile } from '@/hooks/use-mobile'
import { Send, Circle, Paperclip } from 'lucide-react'
import type {
  DecodedMessage,
  Conversation,
  ContentTypeId,
} from '@xmtp/browser-sdk' // Import ContentTypeId
import {
  getContentTypeMedia,
  type MediaContent,
} from '@/lib/xmtp-content-types' // Import getContentTypeMedia
import type { FileUploadResult } from '@/lib/ipfs'
import type { UserProfile as UserProfileType } from '@/hooks/use-user-profile'

interface ChatWindowProps {
  conversation: Conversation // XMTP 会话对象
  // friendAddress: string
  messages: DecodedMessage[] // 从 useConversation 传入的消息
  loadingMessages: boolean // 从 useConversation 传入的加载状态
  getMessages: any
  streamMessages: any
  send: any
  xmtpClient: any
  // send: (
  //   content: string | MediaContent,
  //   contentType?: ContentTypeId
  // ) => Promise<void> // From useConversation
  sending: boolean // From useConversation
  myAddress: `0x${string}` | undefined // My address
  friendProfile: UserProfileType | null // Friend profile
}

export function ChatWindow({
  conversation,
  getMessages,
  streamMessages,
  // friendAddress,
  messages,
  loadingMessages,
  send,
  sending,
  myAddress,
  friendProfile,
  xmtpClient,
}: ChatWindowProps) {
  const isMobile = useMobile()
  const [newMessage, setNewMessage] = useState('')
  const [showFileUpload, setShowFileUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { profile: myProfile } = useUserProfile(myAddress)

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchData = async () => {
      // 获取消息
      await getMessages({}, true)

      // 启动消息流
      await streamMessages()

      // // 清理函数
      // return () => {
      //   streamMessagesReturn()
      // }
    }

    // 调用异步函数
    fetchData()
  }, [])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !myAddress) return
    // if (!newMessage.trim() || !myAddress || !friendAddress) return

    try {
      await send(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }

  const handleFileUploaded = async (result: FileUploadResult) => {
    // if (!myAddress || !friendAddress) return
    if (!myAddress) return

    const mediaContent: MediaContent = {
      url: result.url,
      name: result.name,
      size: result.size,
      mimeType: result.type,
      cid: result.cid,
    }

    try {
      await send(mediaContent, getContentTypeMedia()) // Call function to get instance
      setShowFileUpload(false)
    } catch (error) {
      console.error('发送媒体消息失败:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // XMTP client does not have a direct "online" status, but we can check if the conversation exists
  const isOnline = !!conversation // Simplified to "online" if conversation exists or can be created

  return (
    <div className='flex flex-col h-full'>
      {/* Chat Header */}
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* <div className='relative'>
              <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}>
                <AvatarImage
                  src={friendProfile?.avatarUrl || '/placeholder.svg'}
                />
                <AvatarFallback>
                  {friendProfile?.nickname?.slice(0, 2).toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <Circle className='absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500' />
              )}
            </div> */}
            <div>
              <h2
                className={`font-medium text-gray-900 ${
                  isMobile ? 'text-sm' : ''
                }`}
              >
                会话ID: {conversation.id}
                {/* {friendProfile?.nickname || '未知用户'} */}
              </h2>
              {/* <p
                className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
              >
                {friendAddress.slice(0, 6)}...{friendAddress.slice(-4)}
              </p> */}
            </div>
          </div>

          <Badge
            variant={isOnline ? 'default' : 'secondary'}
            className='text-xs'
          >
            {isOnline ? 'XMTP 可用' : 'XMTP 不可用'}
          </Badge>
        </div>
      </div>

      {/* Message List */}
      <div
        className={`flex-1 overflow-y-auto space-y-4 bg-gray-50 ${
          isMobile ? 'p-3' : 'p-4'
        }`}
      >
        {loadingMessages ? (
          <div className='text-center text-gray-500 mt-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
            <p>加载消息中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='text-center text-gray-500 mt-8'>
            <p>还没有消息</p>
            <p className='text-sm mt-1'>发送第一条消息开始对话吧！</p>
          </div>
        ) : (
          messages.map((message) => {
            // 使用 senderInboxId 和 xmtpClient.inboxId 判断消息的发送者
            const isOwnMessage = message.senderInboxId === xmtpClient.inboxId
            const messageContent = message.content

            let displayContent: React.ReactNode
            // if (message.contentType.sameAs(getContentTypeMedia())) {
            //   // 如果是媒体消息
            //   const media = messageContent as MediaContent
            //   displayContent = (
            //     <MediaMessage
            //       url={media.url}
            //       name={media.name}
            //       type={media.mimeType}
            //       size={media.size}
            //       isOwn={isOwnMessage}
            //     />
            //   )
            // } else {
            //   // 如果是文本消息
            //   displayContent = (
            //     <p className='text-sm'>{String(messageContent)}</p>
            //   )
            // }
            displayContent = <p className='text-sm'>{String(messageContent)}</p>

            // 格式化发送时间
            const messageTime = new Date(
              Number(message.sentAtNs.toString().slice(0, -6))
            ).toLocaleTimeString()

            return (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-end space-x-2 ${
                    isMobile ? 'max-w-[85%]' : 'max-w-xs lg:max-w-md'
                  }`}
                >
                  {!isOwnMessage && (
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={friendProfile?.avatarUrl || '/placeholder.svg'}
                      />
                      <AvatarFallback className='text-xs'>
                        {friendProfile?.nickname?.slice(0, 1).toUpperCase() ||
                          '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {displayContent}
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {messageTime}
                    </p>
                  </div>
                  {isOwnMessage && (
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={myProfile?.avatarUrl || '/placeholder.svg'}
                      />
                      <AvatarFallback className='text-xs'>
                        {myProfile?.nickname?.slice(0, 1).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {showFileUpload && (
        <div className='bg-white border-t border-gray-200 p-4'>
          <FileUpload
            onFileUploaded={handleFileUploaded}
            disabled={loadingMessages || sending}
          />
        </div>
      )}

      {/* Message Input */}
      <div className='bg-white border-t border-gray-200 p-4'>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={`${isMobile ? 'px-2' : 'px-3'}`}
            disabled={loadingMessages || sending}
          >
            <Paperclip className='h-4 w-4' />
          </Button>
          <Input
            placeholder='输入消息...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className='flex-1'
            disabled={loadingMessages || sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loadingMessages || sending}
            className='px-4'
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            消息通过XMTP实时同步
          </p>
          {isOnline && <p className='text-xs text-green-600'>XMTP 可用</p>}
        </div>
      </div>
    </div>
  )
}
