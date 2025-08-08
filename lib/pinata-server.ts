// 这个文件只在服务器端使用，因此不需要 'use client'
// "server only" // Next.js 14+ 推荐使用此注释来明确标记

import { PinataSDK } from "pinata"

// 确保 NEXT_PUBLIC_PINATA_JWT 环境变量在服务器端可用
if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
  throw new Error("NEXT_PUBLIC_PINATA_JWT 环境变量未设置。请在 Vercel 或 .env.local 中配置。")
}

export const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  // 您可以根据需要配置 Pinata Gateway，例如：
  // pinataGateway: "your-custom-gateway.mypinata.cloud", // 如果您有自定义网关
})
