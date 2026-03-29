import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '证件照换底色 - 免费在线一键更换背景颜色',
  description: '免费在线证件照换底色工具，支持红底、蓝底、白底，一键更换，即时预览，高质量下载。无需注册，无需安装，3秒搞定。',
  keywords: '证件照换底色, 证件照背景, 换底色, 红底证件照, 蓝底证件照, 白底证件照, 在线换背景',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
