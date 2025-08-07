// "use client"

// import { useAccount, useReadContract } from "wagmi"
// import { chatDAppAddress, chatDAppABI } from "@/lib/contract"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { MessageCircle, Users, Circle } from 'lucide-react'
// import { useUserProfile } from "@/hooks/use-user-profile"
// import { useState, useEffect } from "react"
// import { useConversations } from "@/hooks/useConversations"
// import { useXMTP } from "@/contexts/XMTPContext"

// interface FriendsListProps {
//   onStartChat: (friendAddress: string) => void
// }

// export function FriendsList({ onStartChat }: FriendsListProps) {
//   const { address } = useAccount()
//   const { profile: myProfile } = useUserProfile(address)
//   const { client: xmtpClient, initializing: loadingXmtpClient } = useXMTP()
//   const { conversations, loading: loadingConversations } = useConversations()
//   const [friendXmtpStatus, setFriendXmtpStatus] = useState<Record<string, boolean>>({})

//   const { data: friends, isLoading } = useReadContract({
//     address: chatDAppAddress,
//     abi: chatDAppABI,
//     functionName: "getFriends",
//     args: address ? [address] : undefined,
//   })

//   // Check if friend is on XMTP network by finding their inbox ID
//   useEffect(() => {
//     if (!xmtpClient || !friends || loadingXmtpClient) return

//     const checkXmtpStatus = async () => {
//       const statuses: Record<string, boolean> = {}
//       for (const friendAddr of friends) {
//         try {
//           // 使用 findInboxIdByIdentifier 查询 inboxId
//           const inboxId = await xmtpClient.findInboxIdByIdentifier({
//             identifier: friendAddr.toLowerCase(),
//             identifierKind: 'Ethereum',
//           })
//           statuses[friendAddr] = !!inboxId // 如果 inboxId 存在，则 XMTP 可用
//         } catch (e) {
//           console.error(`检查 ${friendAddr} 的 XMTP 状态失败:`, e)
//           statuses[friendAddr] = false
//         }
//       }
//       setFriendXmtpStatus(statuses)
//     }

//     void checkXmtpStatus()
//   }, [xmtpClient, friends, loadingXmtpClient])

//   if (isLoading || loadingConversations || loadingXmtpClient) {
//     return (
//       <div className="p-4">
//         <div className="animate-pulse space-y-3">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//               <div className="flex-1">
//                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (!friends || friends.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//         <p className="text-sm">还没有好友</p>
//         <p className="text-xs mt-1">点击"添加"按钮添加好友</p>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 space-y-2">
//       <h3 className="text-sm font-medium text-gray-700 mb-3">好友列表 ({friends.length})</h3>
//       {friends.map((friendAddress) => (
//         <FriendItem
//           key={friendAddress}
//           friendAddress={friendAddress}
//           onStartChat={onStartChat}
//           isOnXmtp={friendXmtpStatus[friendAddress]}
//         />
//       ))}
//     </div>
//   )
// }

// function FriendItem({
//   friendAddress,
//   onStartChat,
//   isOnXmtp,
// }: {
//   friendAddress: `0x${string}`
//   onStartChat: (address: string) => void
//   isOnXmtp?: boolean
// }) {
//   const { profile } = useUserProfile(friendAddress)

//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
//       <div className="flex items-center space-x-3">
//         <div className="relative">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
//             <AvatarFallback>{profile?.nickname?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
//           </Avatar>
//           {isOnXmtp && <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />}
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center space-x-2">
//             <p className="font-medium text-sm text-gray-900">{profile?.nickname || "未知用户"}</p>
//             <Badge variant={isOnXmtp ? "default" : "secondary"} className="text-xs px-1 py-0">
//               {isOnXmtp ? "XMTP 可用" : "XMTP 不可用"}
//             </Badge>
//           </div>
//           <p className="text-xs text-gray-500">
//             {friendAddress.slice(0, 6)}...{friendAddress.slice(-4)}
//           </p>
//         </div>
//       </div>
//       <Button size="sm" variant="ghost" onClick={() => onStartChat(friendAddress)} className="h-8 w-8 p-0">
//         <MessageCircle className="h-4 w-4" />
//       </Button>
//     </div>
//   )
// }

'use client'

import { useAccount, useReadContract } from 'wagmi'
import { chatDAppAddress, chatDAppABI } from '@/lib/contract'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Users, Circle } from 'lucide-react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useState, useEffect } from 'react'
import { useConversations } from '@/hooks/useConversations'
import { useXMTP } from '@/contexts/XMTPContext'

interface FriendsListProps {
  onStartChat: (friendAddress: string) => void
}

export function FriendsList({ onStartChat }: FriendsListProps) {
  const { address } = useAccount()
  const { profile: myProfile } = useUserProfile(address)
  const { client: xmtpClient, initializing: loadingXmtpClient } = useXMTP()
  const { conversations, loading: loadingConversations } = useConversations()
  const [friendXmtpStatus, setFriendXmtpStatus] = useState<
    Record<string, boolean>
  >({})

  const { data: friends, isLoading } = useReadContract({
    address: chatDAppAddress,
    abi: chatDAppABI,
    functionName: 'getFriends',
    args: address ? [address] : undefined,
  })

  // Check if friend is on XMTP network by finding their inbox ID
  useEffect(() => {
    if (!xmtpClient || !friends || loadingXmtpClient) return

    const checkXmtpStatus = async () => {
      const statuses: Record<string, boolean> = {}
      for (const friendAddr of friends) {
        try {
          // 使用 findInboxIdByIdentifier 查询 inboxId
          const inboxId = await xmtpClient.findInboxIdByIdentifier({
            identifier: friendAddr.toLowerCase(),
            identifierKind: 'Ethereum',
          })
          statuses[friendAddr] = !!inboxId // 如果 inboxId 存在，则 XMTP 可用
        } catch (e) {
          console.error(`检查 ${friendAddr} 的 XMTP 状态失败:`, e)
          statuses[friendAddr] = false
        }
      }
      setFriendXmtpStatus(statuses)
    }

    void checkXmtpStatus()
  }, [xmtpClient, friends, loadingXmtpClient])

  if (isLoading || loadingConversations || loadingXmtpClient) {
    return (
      <div className='p-4'>
        <div className='animate-pulse space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
              <div className='flex-1'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2 mt-1'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!friends || friends.length === 0) {
    return (
      <div className='p-4 text-center text-gray-500'>
        <Users className='h-12 w-12 mx-auto mb-3 text-gray-300' />
        <p className='text-sm'>还没有好友</p>
        <p className='text-xs mt-1'>点击"添加"按钮添加好友</p>
      </div>
    )
  }

  return (
    <div className='p-4 space-y-2'>
      <h3 className='text-sm font-medium text-gray-700 mb-3'>
        好友列表 ({friends.length})
      </h3>
      {friends.map((friendAddress) => (
        <FriendItem
          key={friendAddress}
          friendAddress={friendAddress}
          onStartChat={onStartChat}
          isOnXmtp={friendXmtpStatus[friendAddress]}
        />
      ))}
    </div>
  )
}

function FriendItem({
  friendAddress,
  onStartChat,
  isOnXmtp,
}: {
  friendAddress: `0x${string}`
  onStartChat: (address: string) => void
  isOnXmtp?: boolean
}) {
  const { profile } = useUserProfile(friendAddress)

  return (
    <div className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100'>
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={profile?.avatarUrl || '/placeholder.svg'} />
            <AvatarFallback>
              {profile?.nickname?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          {isOnXmtp && (
            <Circle className='absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500' />
          )}
        </div>
        <div className='flex-1'>
          <div className='flex items-center space-x-2'>
            <p className='font-medium text-sm text-gray-900'>
              {profile?.nickname || '未知用户'}
            </p>
            <Badge
              variant={isOnXmtp ? 'default' : 'secondary'}
              className='text-xs px-1 py-0'
            >
              {isOnXmtp ? 'XMTP 可用' : 'XMTP 不可用'}
            </Badge>
          </div>
          <p className='text-xs text-gray-500'>
            {friendAddress.slice(0, 6)}...{friendAddress.slice(-4)}
          </p>
        </div>
      </div>
      <Button
        size='sm'
        variant='ghost'
        onClick={() => onStartChat(friendAddress)}
        className='h-8 w-8 p-0'
      >
        <MessageCircle className='h-4 w-4' />
      </Button>
    </div>
  )
}
