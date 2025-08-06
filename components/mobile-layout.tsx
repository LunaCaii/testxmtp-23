"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ArrowLeft } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface MobileLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  showBackButton?: boolean
  onBack?: () => void
  title?: string
}

export function MobileLayout({ sidebar, main, showBackButton, onBack, title }: MobileLayoutProps) {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isMobile) {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r">{sidebar}</div>
        <div className="flex-1">{main}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 移动端头部 */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                {sidebar}
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-lg font-semibold">{title || "聊天DApp"}</h1>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">{main}</div>
    </div>
  )
}
