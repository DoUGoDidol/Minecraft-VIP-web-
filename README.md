# BLOCKVERSE — 方块宇宙

一个以 Minecraft 方块世界为灵感的高视觉交互展示网站。纯静态前端，无需后端、数据库或 API 密钥。

## 功能一览

- **沉浸式启动动画**：模拟区块生成进度与启动状态
- **像素方块主视觉**：CSS 3D 方块、漂浮动画、轨道与荧光标记
- **动态点击粒子**：按钮、卡片和方块交互会触发像素粒子
- **光标光晕与悬浮倾斜**：桌面端微交互
- **世界维度档案**：主世界、下界、末地的独立场景
- **方块图鉴**：分类筛选、即时搜索、点击查看详细数据
- **生物档案**：苦力怕、末影人、狐狸、蜜蜂之间切换
- **合成实验室**：切换配方并播放合成反馈动画
- **命令终端**：支持 `help`、`world`、`inventory`、`time set day`、`summon creeper`、`clear`
- **可选环境音**：用户主动开启后才通过 Web Audio API 合成音效
- **移动端适配**：手机导航、响应式卡片与工作台布局
- **无障碍考虑**：语义化结构、按钮标签、减少动态效果偏好支持

## 本地运行

最简单：直接打开 `index.html`。

也可以在项目目录启动本地静态服务器：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，例如 `blockverse`。
2. 上传此项目中的全部文件，确保 `index.html` 位于仓库根目录。
3. 进入仓库 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. Branch 选择 `main`，目录选择 `/ (root)`，保存。
6. 等待 GitHub Pages 构建完成，页面会显示公开网址。

也可以通过 Git 命令推送：

```bash
git init
git add .
git commit -m "Build BLOCKVERSE interactive Minecraft-inspired showcase"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/blockverse.git
git push -u origin main
```

将 `YOUR-USERNAME` 替换成自己的 GitHub 用户名。

## 文件结构

```text
blockverse/
├── index.html
├── README.md
├── LICENSE
├── .nojekyll
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css
└── js/
    ├── app.js
    └── effects.js
```

## 版权与说明

这是非官方粉丝概念作品，旨在介绍和致敬方块沙盒游戏的创造精神。Minecraft 是 Mojang Studios / Microsoft 的商标。本项目与 Mojang 或 Microsoft 没有官方关联。页面中的场景、图标与方块插画主要由 CSS 和 SVG 自行绘制，不包含游戏原始资源文件。

## 自定义建议

- 站点标题与介绍：编辑 `index.html`
- 配色、动效与响应式布局：编辑 `css/style.css`
- 方块、生物、配方和命令逻辑：编辑 `js/app.js`
- 粒子、启动画面、光标与声音：编辑 `js/effects.js`
