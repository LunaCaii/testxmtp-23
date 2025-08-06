"use client"

import { PinataSDK } from "pinata" // 导入 Pinata SDK

export interface FileUploadResult {
  cid: string
  url: string
  name: string
  size: number
  type: string
}

// 在客户端初始化 Pinata SDK，不带 JWT，因为它将使用签名 URL
// PinataSDK 构造函数需要一个对象，即使是空的
const clientPinata = new PinataSDK({})

// 上传文件到IPFS (使用Pinata的签名URL和SDK方法)
export const uploadToIPFS = async (file: File): Promise<FileUploadResult> => {
  try {
    console.log("开始获取签名上传URL...")

    // 1. 从我们的API路由获取签名上传URL
    const urlRequest = await fetch("/api/ipfs-upload-url")
    if (!urlRequest.ok) {
      const errorData = await urlRequest.json() // 尝试解析JSON错误
      throw new Error(`获取签名URL失败: ${errorData.error || urlRequest.statusText}`)
    }
    const { url: signedUploadUrl } = await urlRequest.json()

    console.log("已获取签名URL，开始通过Pinata SDK上传文件到IPFS...")

    // 2. 使用 Pinata SDK 的 file().url() 方法上传文件
    // 这个方法会处理底层的 PUT 请求，并返回 Pinata 期望的响应格式
    const uploadResult = await clientPinata.upload.public.file(file).url(signedUploadUrl)

    console.log("IPFS上传成功:", uploadResult)

    return {
      cid: uploadResult.cid, // Pinata SDK 返回的 CID
      url: `https://gateway.pinata.cloud/ipfs/${uploadResult.cid}`, // 使用公共网关URL访问文件
      name: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (error) {
    console.error("文件上传过程中发生错误:", error)
    // 抛出更具体的错误信息
    if (error instanceof Error) {
      throw new Error(`文件上传失败: ${error.message}`)
    } else {
      throw new Error("文件上传失败，请检查网络连接或稍后重试。")
    }
  }
}

// 检查文件类型和大小
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ]

  if (file.size > maxSize) {
    return { valid: false, error: "文件大小不能超过50MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "不支持的文件类型" }
  }

  return { valid: true }
}

// 获取文件类型
export const getFileType = (mimeType: string): "image" | "video" | "other" => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  return "other"
}
