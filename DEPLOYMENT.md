# 部署指南

## Netlify 部署

### 1. 自动部署设置

项目已配置 `netlify.toml` 文件，支持自动部署：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. 环境变量配置

在 Netlify 控制台中设置以下环境变量：

-   `VITE_DEEPSEEK_API_KEY`: 你的 DeepSeek API 密钥
-   `VITE_DEEPSEEK_BASE_URL`: API 基础 URL (默认: https://api.deepseek.com)

### 3. 部署步骤

1. 将代码推送到 GitHub 仓库
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建配置：
    - Build command: `npm run build`
    - Publish directory: `dist`
4. 在 Environment variables 中添加 API 配置
5. 点击 Deploy

### 4. 故障排除

#### 构建失败

-   确保 Node.js 版本为 18 或更高
-   检查依赖是否正确安装
-   查看构建日志中的具体错误信息

#### TypeScript 错误

如果遇到 TypeScript 类型检查错误，可以使用：

```bash
npm run build:check  # 带类型检查的构建
npm run build        # 跳过类型检查的构建（推荐用于部署）
```

#### API 调用失败

-   确认环境变量设置正确
-   检查 API 密钥是否有效
-   确认 CORS 设置允许浏览器访问

## 其他部署平台

### Vercel

1. 连接 GitHub 仓库
2. 设置环境变量
3. 使用默认的构建设置

### GitHub Pages

1. 修改 `vite.config.ts` 添加 base 路径
2. 使用 GitHub Actions 自动部署
3. 注意：GitHub Pages 不支持服务端环境变量

## 本地测试生产构建

```bash
# 构建
npm run build

# 预览
npm run preview
```

## 注意事项

1. **API 密钥安全**: 不要在代码中硬编码 API 密钥
2. **环境变量**: 确保生产环境中设置了正确的环境变量
3. **CORS**: 确认 API 服务支持浏览器跨域请求
4. **缓存**: 部署后可能需要清除浏览器缓存才能看到更新
