"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getFileType } from "@/lib/ipfs"
import { Download, Play, ImageIcon } from "lucide-react"

interface MediaMessageProps {
  url: string
  name: string
  type: string
  size: number
  isOwn: boolean
}

export function MediaMessage({ url, name, type, size, isOwn }: MediaMessageProps) {
  const [imageError, setImageError] = useState(false)
  const fileType = getFileType(type)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (fileType === "image" && !imageError) {
    return (
      <div className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer rounded-lg overflow-hidden max-w-xs">
              <img
                src={url || "/placeholder.svg"}
                alt={name}
                className="w-full h-auto max-h-64 object-cover hover:opacity-90 transition-opacity"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-2">
            <img
              src={url || "/placeholder.svg"}
              alt={name}
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={() => setImageError(true)}
            />
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between text-xs">
          <span className={`${isOwn ? "text-blue-100" : "text-gray-500"}`}>
            {name} ({formatFileSize(size)})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className={`h-6 w-6 p-0 ${isOwn ? "text-blue-100 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  if (fileType === "video") {
    return (
      <div className="space-y-2">
        <div className="rounded-lg overflow-hidden max-w-xs">
          <video controls className="w-full h-auto max-h-64" preload="metadata">
            <source src={url} type={type} />
            您的浏览器不支持视频播放
          </video>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={`${isOwn ? "text-blue-100" : "text-gray-500"}`}>
            {name} ({formatFileSize(size)})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className={`h-6 w-6 p-0 ${isOwn ? "text-blue-100 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  // 文件类型不支持预览时的回退显示
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg border ${isOwn ? "border-blue-300" : "border-gray-300"}`}
    >
      <div className={`p-2 rounded ${isOwn ? "bg-blue-500" : "bg-gray-200"}`}>
        {fileType === "image" ? (
          <ImageIcon className={`h-4 w-4 ${isOwn ? "text-white" : "text-gray-600"}`} />
        ) : (
          <Play className={`h-4 w-4 ${isOwn ? "text-white" : "text-gray-600"}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isOwn ? "text-blue-100" : "text-gray-900"}`}>{name}</p>
        <p className={`text-xs ${isOwn ? "text-blue-200" : "text-gray-500"}`}>{formatFileSize(size)}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className={`h-8 w-8 p-0 ${isOwn ? "text-blue-100 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}
