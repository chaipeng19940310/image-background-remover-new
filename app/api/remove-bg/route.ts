export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image_file') as File | null

    if (!imageFile) {
      return Response.json({ error: '请上传图片文件' }, { status: 400 })
    }

    // 格式校验
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      return Response.json({ error: '仅支持 JPG、PNG、WEBP 格式的图片' }, { status: 400 })
    }

    // 大小校验（10MB）
    if (imageFile.size > 10 * 1024 * 1024) {
      return Response.json({ error: '图片大小不能超过 10MB' }, { status: 400 })
    }

    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return Response.json({ error: '服务配置错误，请联系管理员' }, { status: 500 })
    }

    // 构建发往 Remove.bg 的请求
    const removeBgForm = new FormData()
    removeBgForm.append('image_file', imageFile)
    removeBgForm.append('size', 'auto')
    removeBgForm.append('type', 'person')

    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgForm,
    })

    if (!removeBgRes.ok) {
      const errText = await removeBgRes.text()
      console.error('Remove.bg error:', removeBgRes.status, errText)

      if (removeBgRes.status === 402) {
        return Response.json({ error: '服务繁忙（额度不足），请稍后重试' }, { status: 503 })
      }
      if (removeBgRes.status === 403) {
        return Response.json({ error: '服务配置错误，请联系管理员' }, { status: 500 })
      }
      return Response.json({ error: '抠图处理失败，请重试' }, { status: 500 })
    }

    // 直接返回透明 PNG
    const pngBuffer = await removeBgRes.arrayBuffer()
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('remove-bg route error:', err)
    return Response.json({ error: '服务器错误，请稍后重试' }, { status: 500 })
  }
}
