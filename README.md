# Wrap Studio - Vercel 版本

AI 礼品包装纸生成器（使用 Replicate API）

## 部署步骤

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署
```bash
cd wrap-studio-vercel
vercel --prod
```

### 4. 配置环境变量
在 Vercel Dashboard 中添加环境变量：
- `REPLICATE_API_TOKEN` = 你的 Replicate Token

## 项目结构

```
wrap-studio-vercel/
├── api/
│   └── generate.js     # 后端 API，调用 Replicate
├── public/
│   └── index.html      # 前端页面
├── vercel.json         # Vercel 配置
├── package.json        # 依赖
└── .env.local          # 本地环境变量（不上传）
```

## API 端点

### POST /api/generate

请求体：
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "style": "kawaii"
}
```

响应：
```json
{
  "success": true,
  "imageUrl": "https://...",
  "style": "kawaii"
}
```

## 技术栈

- Frontend: React + Tailwind CSS
- Backend: Vercel Serverless Functions (Node.js)
- AI: Replicate API (Stable Diffusion)

## 成本

- Vercel: 免费（每月 100GB 流量）
- Replicate: 新用户 $5 免费额度，之后约 $0.01-0.02/张图
