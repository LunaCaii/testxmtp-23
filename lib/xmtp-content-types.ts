import { ContentTypeId } from "@xmtp/browser-sdk"

// 导出一个函数，该函数在被调用时返回 ContentTypeId 实例
export const getContentTypeMedia = (): ContentTypeId => {
  return new ContentTypeId({
    authorityId: "xmtp.org",
    typeId: "media",
    versionMajor: 1,
    versionMinor: 0,
  })
}

// 媒体内容的接口，用于在 XMTP 消息中传输
export interface MediaContent {
  url: string
  name: string
  size: number
  mimeType: string
  cid: string
}
