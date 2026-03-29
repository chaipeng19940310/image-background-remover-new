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

  const handleReset = useCallback(() => {
    if (prevOriginalUrl.current) URL.revokeObjectURL(prevOriginalUrl.current)
    if (prevTransparentUrl.current) URL.revokeObjectURL(prevTransparentUrl.current)
    prevOriginalUrl.current = null
    prevTransparentUrl.current = null
    setOriginalUrl(null)
    setTransparentUrl(null)
    setError(null)
    setStatus('idle')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">📸</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900">证件照换底色</h1>
            <p className="text-xs text-gray-400">免费 · 在线 · 3秒搞定 · 图片不上传至服务器</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* 上传区（idle 和 error 状态显示） */}
        {(status === 'idle' || status === 'error') && (
          <div className="flex flex-col gap-3">
            <Uploader onUpload={handleUpload} disabled={false} />

            {status === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-400 text-xl mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                  <p className="text-red-400 text-xs mt-1">请检查图片后重新上传</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading 状态 */}
        {status === 'loading' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-gray-700 font-medium">正在智能抠图中...</p>
              <p className="text-gray-400 text-sm mt-1">通常需要 3-5 秒，请稍候</p>
            </div>
          </div>
        )}

        {/* 结果区 */}
        {status === 'done' && originalUrl && transparentUrl && (
          <div className="flex flex-col gap-5">
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
                className="text-sm text-gray-400 hover:text-blue-500 transition-colors underline underline-offset-2"
              >
                ↩ 重新上传一张
              </button>
            </div>
          </div>
        )}

        {/* 首页使用说明卡片 */}
        {status === 'idle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[
              { icon: '📤', title: '上传照片', desc: '支持 JPG / PNG / WEBP，最大 10MB，拖拽或点击选择' },
              { icon: '✂️', title: 'AI 自动抠图', desc: '智能识别人像，精准去除背景，无需手动操作' },
              { icon: '🎨', title: '选色下载', desc: '红底、蓝底、白底随意换，支持自定义颜色' },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{step.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* 常见证件照底色说明 */}
        {status === 'idle' && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h2 className="text-sm font-semibold text-blue-800 mb-3">📋 常见证件照底色参考</h2>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 shrink-0 border border-red-200" />
                红底：居民身份证、驾照
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-700 shrink-0 border border-blue-200" />
                蓝底：护照、签证、考试报名
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-white shrink-0 border border-gray-300" />
                白底：简历、学历证书
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full shrink-0 border border-gray-300" style={{ backgroundColor: '#060B27' }} />
                深蓝底：部分签证要求
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-5">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-400 space-y-1">
          <p>
            抠图技术由{' '}
            <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors">
              Remove.bg
            </a>{' '}
            提供
          </p>
          <p>您的图片不会被保存，处理完毕后立即删除，请放心使用</p>
        </div>
      </footer>
    </div>
  )
}
