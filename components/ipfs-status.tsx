"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff } from "lucide-react"

export function IPFSStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    const checkIPFSConnection = async () => {
      try {
        // 检查Pinata连接
        if (process.env.NEXT_PUBLIC_PINATA_JWT) {
          const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
          })
          setIsConnected(response.ok)
        } else {
          // 检查公共IPFS网关
          const response = await fetch("https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme", {
            method: "HEAD",
          })
          setIsConnected(response.ok)
        }
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkIPFSConnection()
    const interval = setInterval(checkIPFSConnection, 30000) // 每30秒检查一次

    return () => clearInterval(interval)
  }, [])

  if (isConnected === null) {
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Cloud className="h-3 w-3" />
        <span>检查中...</span>
      </Badge>
    )
  }

  return (
    <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
      {isConnected ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
      <span>IPFS {isConnected ? "已连接" : "离线"}</span>
    </Badge>
  )
}
