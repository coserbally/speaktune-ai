# PWA Assets 指南

此文件夹包含 Progressive Web App (PWA) 所需的资源。

## ✅ 已完成配置

### 必需文件：
- **manifest.json** ✓ - 已创建
  - PWA 清单文件，定义应用元数据

- **图标文件** ✓ - 已生成占位符文件：
  - `pwa-192x192.png` - 基本应用图标（192x192px）
  - `pwa-512x512.png` - 大型应用图标（512x512px）
  - `pwa-maskable-192x192.png` - 可遮罩图标用于自适应图标（192x192px）
  - `pwa-maskable-512x512.png` - 可遮罩图标用于自适应图标（512x512px）
  - `apple-touch-icon.png` - iOS 主屏幕图标（180x180px）
  - `favicon.svg` - 网站图标

- **robots.txt** ✓ - SEO 配置

### 配置文件：
- **vite.config.ts** ✓ - Vite PWA 插件配置
- **index.html** ✓ - PWA meta 标签和 manifest 引用

## 🎨 自定义图标

当前图标是占位符文件，请替换为您的实际应用图标：

### 选项 1：使用在线工具（推荐）
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)

### 选项 2：使用命令行工具
```bash
# 安装工具
npm install -g pwa-asset-generator

# 生成图标（替换 logo.png 为您的 logo 文件）
pwa-asset-generator logo.png ./public
```

### 选项 3：手动创建
- 使用设计工具创建 PNG 格式的图标
- 确保尺寸正确并替换现有文件

## 🚀 构建和测试

```bash
# 构建 PWA
npm run build

# 在本地测试
npm run preview
```

## 📱 PWA 功能

- ✅ 离线支持（Service Worker 自动缓存）
- ✅ 可安装到主屏幕
- ✅ 自动更新
- ✅ 响应式设计
- ✅ Google Fonts 缓存优化

## 🔍 验证 PWA

1. 构建项目后，在浏览器中打开
2. 打开开发者工具 → Application → Service Workers
3. 检查 Manifest 是否正确加载
4. 测试离线功能

## 📊 构建输出

构建成功后会生成：
- `dist/sw.js` - Service Worker 文件
- `dist/manifest.webmanifest` - Web App Manifest
- `dist/workbox-*.js` - Workbox 运行时

## 🆘 故障排除

- 如果图标不显示，检查文件路径和尺寸
- 如果 Service Worker 不工作，清除浏览器缓存
- 如果安装失败，检查 manifest.json 配置


## 离线支持

该 PWA 配置包括：
- 自动缓存所有 JavaScript、CSS、HTML、图像和字体文件
- Google Fonts 的缓存策略
- 自动 Service Worker 更新

## 更多信息

- [MDN - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [vite-plugin-pwa 文档](https://vite-plugin-pwa.netlify.app/)
