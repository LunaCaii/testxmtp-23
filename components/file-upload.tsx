"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadToIPFS, validateFile, type FileUploadResult } from "@/lib/ipfs"
import { PaperclipIcon, XIcon, Upload } from "lucide-react"

interface FileUploadProps {
  onFileUploaded: (result: FileUploadResult) => void
  disabled?: boolean
}

export function FileUpload({ onFileUploaded, disabled }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // 验证文件
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 85))
      }, 300)

      const result = await uploadToIPFS(selectedFile)

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        onFileUploaded(result)
        setUploading(false)
        setProgress(0)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "上传失败")
      setUploading(false)
      setProgress(0)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {!selectedFile ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full sm:w-auto"
        >
          <PaperclipIcon className="h-4 w-4 mr-2" />
          选择文件
        </Button>
      ) : (
        <div className="space-y-3">
          {/* 文件预览 */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                alt="预览"
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* 上传按钮 */}
          <div className="flex space-x-2">
            <Button onClick={handleUpload} disabled={uploading} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "上传中..." : "上传到IPFS"}
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-gray-500 text-center">
            {progress < 85 ? `${progress}% 准备上传...` : progress < 100 ? "上传到IPFS中..." : "上传完成！"}
          </p>
        </div>
      )}

      {error && (
        <Alert>
          <XIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• 支持图片和视频文件</p>
        <p>• 最大文件大小: 50MB</p>
        <p>• 文件将永久存储在IPFS网络</p>
      </div>
    </div>
  )
}
