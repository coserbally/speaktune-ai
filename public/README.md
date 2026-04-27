# PWA Assets 指南

此文件夹包含 Progressive Web App (PWA) 所需的资源。

## 需要的文件

为了完全支持 PWA，请在此文件夹中添加以下文件：

### 必需文件：

1. **manifest.json** ✓ - 已创建
   - PWA 清单文件，定义应用元数据

2. **图标文件** - 需要添加
   - `pwa-192x192.png` - 基本应用图标（192x192px）
   - `pwa-512x512.png` - 大型应用图标（512x512px）
   - `pwa-maskable-192x192.png` - 可遮罩图标用于自适应图标（192x192px）
   - `pwa-maskable-512x512.png` - 可遮罩图标用于自适应图标（512x512px）
   - `apple-touch-icon.png` - iOS 主屏幕图标（180x180px）
   - `favicon.svg` - 网站图标

3. **屏幕截图**（可选）
   - `screenshot-540x720.png` - 竖屏截图
   - `screenshot-1280x720.png` - 横屏截图

## 生成 PWA 图标的推荐工具

### 选项 1：使用在线工具
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)

### 选项 2：使用命令行工具
```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.png ./pwa-icons
```

### 选项 3：手动创建
- 使用 Figma、Photoshop 或其他设计工具
- 导出为 PNG 格式

## Service Worker

Service Worker 由 vite-plugin-pwa 自动生成，无需手动创建。

## 测试 PWA

1. 构建项目：`npm run build`
2. 使用本地服务器测试：`npm run preview`
3. 在浏览器开发工具中检查 Application > Service Workers

## 离线支持

该 PWA 配置包括：
- 自动缓存所有 JavaScript、CSS、HTML、图像和字体文件
- Google Fonts 的缓存策略
- 自动 Service Worker 更新

## 更多信息

- [MDN - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [vite-plugin-pwa 文档](https://vite-plugin-pwa.netlify.app/)
