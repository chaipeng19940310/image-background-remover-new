'use client'

import { useEffect, useRef, useCallback } from 'react'

interface PreviewProps {
  originalUrl: string
  transparentUrl: string
  bgColor: string
}

export default function Preview({ originalUrl, transparentUrl, bgColor }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const compose = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = transparentUrl
  }, [transparentUrl, bgColor])

  useEffect(() => {
    compose()
  }, [compose])

  const downloadJpg = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    const link = document.createElement('a')
    link.download = `证件照_${bgColor.replace('#', '')}.jpg`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadPng = async () => {
    try {
      const res = await fetch(transparentUrl)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = '证件照_透明底.png'
      link.href = blobUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch {
      // fallback：直接用 transparentUrl
      const link = document.createElement('a')
      link.download = '证件照_透明底.png'
      link.href = transparentUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 双图预览 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 原图 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">原图</span>
          <div className="rounded-xl overflow-hidden border border-gray-200 w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="原图"
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* 换色效果 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">换色效果</span>
          <div className="rounded-xl overflow-hidden border border-gray-200 w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* 下载按钮 */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={downloadJpg}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          ⬇ 下载 JPG
        </button>
        <button
          onClick={downloadPng}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm"
        >
          ⬇ 下载透明 PNG
        </button>
      </div>
    </div>
  )
}
