'use client'

import { useState, useCallback, useRef } from 'react'
import Uploader from '@/components/Uploader'
import ColorPicker from '@/components/ColorPicker'
import Preview from '@/components/Preview'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [transparentUrl, setTransparentUrl] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState('#E60012')
  const prevOriginalUrl = useRef<string | null>(null)
  const prevTransparentUrl = useRef<string | null>(null)

  const handleUpload = useCallback(async (file: File) => {
    // 清理旧的 object URLs
    if (prevOriginalUrl.current) URL.revokeObjectURL(prevOriginalUrl.current)
    if (prevTransparentUrl.current) URL.revokeObjectURL(prevTransparentUrl.current)

    const localUrl = URL.createObjectURL(file)
    prevOriginalUrl.current = localUrl
    setOriginalUrl(localUrl)
    setTransparentUrl(null)
    setError(null)
    setStatus('loading')

    try {
      const form = new FormData()
      form.append('image_file', file)

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: '处理失败，请重试' }))
        throw new Error(data.error || '处理失败，请重试')
      }

      const blob = await res.blob()
      const tUrl = URL.createObjectURL(blob)
      prevTransparentUrl.current = tUrl
      setTransparentUrl(tUrl)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试')
      setStatus('error')
    }
  }, [])

  const handleReset = () => {
    if (prevOriginalUrl.current) URL.revokeObjectURL(prevOriginalUrl.current)
    if (prevTransparentUrl.current) URL.revokeObjectURL(prevTransparentUrl.current)
    prevOriginalUrl.current = null
    prevTransparentUrl.current = null
    setOriginalUrl(null)
    setTransparentUrl(null)
    setError(null)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">📸</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900">证件照换底色</h1>
            <p className="text-xs text-gray-500">免费 · 在线 · 3秒搞定</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* 上传区 */}
        {status === 'idle' || status === 'error' ? (
          <div className="flex flex-col gap-3">
            <Uploader onUpload={handleUpload} disabled={status === 'loading'} />
            {status === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                <div>
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-1 text-xs text-red-500 underline"
                  >
                    重新上传
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">正在抠图处理，请稍候...</p>
          </div>
        )}

        {/* 结果区 */}
        {status === 'done' && originalUrl && transparentUrl && (
          <div className="flex flex-col gap-6">
            {/* 底色选择 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ColorPicker value={bgColor} onChange={setBgColor} />
            </div>

            {/* 预览 + 下载 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <Preview
                originalUrl={originalUrl}
                transparentUrl={transparentUrl}
                bgColor={bgColor}
              />
            </div>

            {/* 重新上传 */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                重新上传一张
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        {status === 'idle' && (
          <div className="grid grid-cols-3 gap-4 mt-2">
            {[
              { icon: '📤', title: '上传照片', desc: '支持JPG/PNG/WEBP，最大10MB' },
              { icon: '✂️', title: '自动抠图', desc: 'AI智能识别人像，精准去除背景' },
              { icon: '🎨', title: '选色下载', desc: '红蓝白多种底色，一键下载' },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{step.icon}</div>
                <div className="font-medium text-gray-800 text-sm">{step.title}</div>
                <div className="text-xs text-gray-400 mt-1">{step.desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-4">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-400">
          抠图技术由{' '}
          <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            Remove.bg
          </a>{' '}
          提供 · 图片不会被保存，处理完即删除
        </div>
      </footer>
    </div>
  )
}
