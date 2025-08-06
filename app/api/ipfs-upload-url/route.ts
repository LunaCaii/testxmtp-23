import { NextResponse } from "next/server"
import { pinata } from "@/lib/pinata-server" // 导入服务器端 Pinata 实例

// 强制动态渲染，确保每次请求都生成新的签名URL
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // 生成一个30秒内有效的签名上传URL
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // URL有效期（秒）
    })

    return NextResponse.json({ url: url }, { status: 200 }) // 返回签名上传URL
  } catch (error) {
    console.error("生成签名上传URL失败:", error)
    // 返回一个结构化的JSON错误响应
    return NextResponse.json({ error: "生成签名上传URL失败，请检查服务器日志。" }, { status: 500 })
  }
}
