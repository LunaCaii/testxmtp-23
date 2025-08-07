"use client"

import type { Conversation, Identifier, SafeCreateGroupOptions, SafeListConversationsOptions } from "@xmtp/browser-sdk"
import { useState, useEffect, useCallback } from "react" // Added useEffect, useCallback
import { useXMTP, type ContentTypes } from "@/contexts/XMTPContext"

export const useConversations = () => {
  const { client } = useXMTP()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [conversations, setConversations] = useState<Conversation<ContentTypes>[]>([])

  // Throw error if client is not initialized, but only after initial render
  useEffect(() => {
    if (!client) {
      // This error will be caught by the error boundary or higher-level logic
      // For now, we'll just log it to avoid crashing the app during SSR
      console.error("XMTP client not initialized when useConversations is used.")
    }
  }, [client])

  const list = useCallback(
    async (options?: SafeListConversationsOptions, syncFromNetwork = false) => {
      if (!client) return [] // Return empty array if client is not ready

      if (syncFromNetwork) {
        await sync()
      }

      setLoading(true)

      try {
        const convos = await client.conversations.list(options)
        setConversations(convos)
        return convos
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const sync = useCallback(async () => {
    if (!client) return

    setSyncing(true)

    try {
      await client.conversations.sync()
    } finally {
      setSyncing(false)
    }
  }, [client]) // Added client to dependencies

  const syncAll = useCallback(async () => {
    if (!client) return

    setSyncing(true)

    try {
      await client.conversations.syncAll()
    } finally {
      setSyncing(false)
    }
  }, [client]) // Added client to dependencies

  const getConversationById = useCallback(
    async (conversationId: string) => {
      if (!client) return undefined

      setLoading(true)

      try {
        const conversation = await client.conversations.getConversationById(conversationId)
        return conversation
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const getMessageById = useCallback(
    async (messageId: string) => {
      if (!client) return undefined

      setLoading(true)

      try {
        const message = await client.conversations.getMessageById(messageId)
        return message
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const newGroup = useCallback(
    async (inboxIds: string[], options?: SafeCreateGroupOptions) => {
      if (!client) return undefined

      setLoading(true)

      try {
        const conversation = await client.conversations.newGroup(inboxIds, options)
        return conversation
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const newGroupWithIdentifiers = useCallback(
    async (identifiers: Identifier[], options?: SafeCreateGroupOptions) => {
      if (!client) return undefined

      setLoading(true)

      try {
        const conversation = await client.conversations.newGroupWithIdentifiers(identifiers, options)
        return conversation
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const newDm = useCallback(
    async (inboxId: string) => {
      if (!client) return undefined

      setLoading(true)

      try {
        const conversation = await client.conversations.newDm(inboxId)
        return conversation
      } finally {
        setLoading(false)
      }
    },
    [client],
  ) // Added client to dependencies

  const newDmWithIdentifier = async (identifier: Identifier) => {
    if (!client) return undefined
    setLoading(true);

    try {
      const conversation =
        await client.conversations.newDmWithIdentifier(identifier);
      return conversation;
    } finally {
      setLoading(false);
    }
  };

  const stream = useCallback(async () => {
    const noop = () => { }
    if (!client) {
      return noop
    }

    const onValue = (conversation: Conversation<ContentTypes>) => {
      const shouldAdd =
        conversation.metadata?.conversationType === "dm" || conversation.metadata?.conversationType === "group"
      if (shouldAdd) {
        setConversations((prev) =>
          [conversation, ...prev].filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i),
        )
      }
    }

    const stream = await client.conversations.stream({
      onValue,
    })

    return () => {
      void stream.end()
    }
  }, [client]) // Added client to dependencies

  // Initial load and stream of conversations
  useEffect(() => {
    if (client) {
      void list() // Initial load
      const stopStreaming = stream() // Start streaming
      return () => {
        void stopStreaming.then((stop) => stop()) // Clean up stream
      }
    }
  }, [client, list, stream]) // Added client, list, stream to dependencies

  return {
    conversations,
    getConversationById,
    getMessageById,
    list,
    loading,
    newDm,
    newDmWithIdentifier,
    newGroup,
    newGroupWithIdentifiers,
    stream,
    sync,
    syncAll,
    syncing,
  }
}
