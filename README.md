# 证件照换底色

免费在线证件照换底色工具，支持红底、蓝底、白底，AI 自动抠图，即时预览，高质量下载。

## 技术栈

- Next.js 14 (App Router)
- React + Tailwind CSS
- Remove.bg API（AI 抠图）
- 部署：Cloudflare Pages

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Remove.bg API Key：

```
REMOVE_BG_API_KEY=your_api_key_here
```

> 前往 [https://www.remove.bg/api](https://www.remove.bg/api) 注册并获取 API Key（免费账号每月 50 次）

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 部署到 Cloudflare Pages

### 1. 安装 Wrangler（如未安装）

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 构建 & 部署

```bash
npm run pages:build
npm run pages:deploy
```

或直接连接 GitHub 仓库到 Cloudflare Pages（推荐）：

1. 将项目推送到 GitHub
2. 在 [Cloudflare Pages](https://pages.cloudflare.com/) 创建新项目
3. 连接 GitHub 仓库
4. 构建命令：`npm run pages:build`
5. 输出目录：`.vercel/output/static`
6. 在 **Settings → Environment variables** 中添加：
   - `REMOVE_BG_API_KEY` = 你的 API Key

## 功能说明

| 功能 | 说明 |
|------|------|
| 上传 | 支持拖拽/点击，JPG/PNG/WEBP，最大 10MB |
| 抠图 | 调用 Remove.bg API，AI 人像识别 |
| 换底色 | 预设红/蓝/白/深蓝，支持自定义颜色 |
| 下载 | JPG（质量95%）或透明 PNG |
| 隐私 | 图片不存储，处理完即丢弃 |

## 项目结构

```
├── app/
│   ├── api/remove-bg/route.ts   # API 路由（Edge Runtime）
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # 主页面
├── components/
│   ├── ColorPicker.tsx          # 底色选择器
│   ├── Preview.tsx              # Canvas 合成预览
│   └── Uploader.tsx             # 上传组件
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── wrangler.toml
```

## 注意事项

- Remove.bg 免费账号每月 50 次请求，超出需付费
- Cloudflare Workers 单次请求内存上限 128MB，超大图片可能失败
- API Key 请勿提交到代码仓库（已在 .gitignore 中排除 .env.local）
