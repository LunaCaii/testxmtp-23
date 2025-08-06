"use client"

import type {
  Conversation,
  DecodedMessage,
  SafeListMessagesOptions,
  ContentTypeId, // Import ContentTypeId
} from "@xmtp/browser-sdk"
import { useState, useEffect, useCallback } from "react"
import { useXMTP, type ContentTypes } from "@/contexts/XMTPContext"
import { getContentTypeMedia, type MediaContent } from "@/lib/xmtp-content-types" // Import getContentTypeMedia

export const useConversation = (conversation?: Conversation<ContentTypes>) => {
  const { client } = useXMTP()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<DecodedMessage<ContentTypes>[]>([])

  const getMessages = useCallback(
    async (options?: SafeListMessagesOptions, syncFromNetwork = false) => {
      if (!client || !conversation) {
        return []
      }

      setMessages([])
      setLoading(true)

      if (syncFromNetwork) {
        await sync()
      }

      try {
        const msgs = (await conversation.messages(options)) ?? [] // Use .messages()
        setMessages(msgs)
        return msgs
      } finally {
        setLoading(false)
      }
    },
    [client, conversation],
  )

  const sync = useCallback(async () => {
    if (!client || !conversation) {
      return
    }

    setSyncing(true)

    try {
      await conversation.sync()
    } finally {
      setSyncing(false)
    }
  }, [client, conversation])

  // Modified send function to handle string and MediaContent
  const send = useCallback(
    async (content: string | MediaContent, contentType: ContentTypeId = getContentTypeMedia()) => {
      if (!client || !conversation) {
        return
      }

      setSending(true)

      try {
        if (typeof content === "string") {
          await conversation.send(content)
        } else {
          await conversation.send(content, { contentType })
        }
      } finally {
        setSending(false)
      }
    },
    [client, conversation],
  )

  const streamMessages = useCallback(async () => {
    const noop = () => {}
    if (!client || !conversation) {
      return noop
    }

    const onValue = (message: DecodedMessage<ContentTypes>) => {
      setMessages((prev) => {
        // Avoid duplicates and sort
        if (prev.some((m) => m.id === message.id)) {
          return prev
        }
        return [...prev, message].sort((a, b) => a.sent.getTime() - b.sent.getTime())
      })
    }

    const stream = await conversation.streamMessages({
      // Use .streamMessages()
      onMessage: onValue, // Use onMessage
    })

    return stream
      ? () => {
          void stream.return() // Use stream.return()
        }
      : noop
  }, [client, conversation])

  // Initial message load and stream setup
  useEffect(() => {
    if (conversation) {
      void getMessages() // Initial load of historical messages
      const stopStreaming = streamMessages() // Start message stream
      return () => {
        void stopStreaming.then((stop) => stop()) // Clean up stream
      }
    }
  }, [conversation, getMessages, streamMessages])

  return {
    getMessages,
    loading,
    messages,
    send,
    sending,
    streamMessages,
    sync,
    syncing,
  }
}
