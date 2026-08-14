# AnvilWiki ⚒️

> 一个开源的、为 Cloudflare Pages 原生优化的游戏 wiki 站点模板。
> 让新手零成本免费部署上线，性能好，适配 wiki 游戏站。
>
> An open-source game wiki site template, natively optimized for Cloudflare Pages.
> Free to deploy, beginner-friendly, fast, and built for game wikis.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Release](https://img.shields.io/github/v/release/PNGTRID/AnvilWiki?label=Release&color=brightgreen)](https://github.com/PNGTRID/AnvilWiki/releases)
[![Live Demo](https://img.shields.io/badge/Demo-anvilwiki.pages.dev-brightgreen)](https://anvilwiki.pages.dev/)

> Lighthouse 4×100 — 实测于 [anvilwiki.pages.dev](https://anvilwiki.pages.dev/)（2026-08-12）
<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/Performance-100-058627?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Performance" />
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/Accessibility-100-058627?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Accessibility" />
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/Best_Practices-100-058627?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Best Practices" />
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/SEO-100-058627?style=for-the-badge&logo=lighthouse&logoColor=white" alt="SEO" />
    </td>
  </tr>
</table>

---

## 📖 中文文档

### 这是什么？

AnvilWiki 是一个**游戏 wiki 站点模板**——用来快速搭建围绕某款游戏（Roblox、Steam 新游等）的攻略内容站，通过 SEO 获取流量，通过广告变现。

技术栈是 **Astro + Cloudflare Pages**：纯静态输出、零适配器、免费无限带宽、全球 CDN、零 JS 优先（首屏极快）。

### 核心特性

- ⚡ **极快**：Astro 零 JS 优先，Lighthouse 全 100（Performance / Accessibility / Best Practices / SEO）
- 🌐 **Cloudflare 原生**：纯静态输出，零适配器，免费无限带宽
- 🎨 **JSON 驱动首页**：6 种 displayType 模块化布局，换游戏只改 JSON 不改组件
- 🌍 **多语言开箱即用**：英文无前缀（SEO 最优），其他语言带前缀，缺失内容自动 fallback 英文
- 🔍 **SEO 工程化**：sitemap / JSON-LD（含 VideoGame）/ hreflang / robots / 文章 TOC / Quick Answer 摘要块，全部代码自动生成
- 🎯 **广告就绪**：内置 Google AdSense 广告组件（3 个广告位，env 驱动，默认关闭）
- 💬 **评论就绪**：内置 Giscus 评论（GitHub Discussions），默认关闭，填 env 即启用，见 [docs/comments.md](docs/comments.md)
- 🔄 **套用模板**：按文件组织的配置参考手册 + 交互式 CLI（`pnpm apply-template`）
- 🆓 **完全免费**：MIT 协议，Cloudflare Pages 免费部署
- 📝 **类型安全**：Content Collections + Zod schema，构建时发现字段错误

### 5 分钟快速开始

```bash
# 1. Fork 本仓库到你的 GitHub

# 2. 本地克隆 & 安装
git clone https://github.com/PNGTRID/AnvilWiki.git
cd anvilwiki
pnpm install

# 3. 启动开发服务器
pnpm dev
# 访问 http://localhost:4321

# 4. 改配置层（site.ts / navigation.ts / globals.css）+ 替换内容层（src/content/ / locales/）
#    或用交互式 CLI 自动化基础配置：
pnpm apply-template

# 5. 部署到 Cloudflare Pages
#    cloudflare.com → Pages → Create a project → Connect to Git → 选仓库
#    自动识别 Astro，构建命令 pnpm build，输出目录 dist
```

详细部署指南见 [`docs/deployment.md`](docs/deployment.md)。

### 文档导航

| 文档                                                           | 内容                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| [docs/PRD.md](docs/PRD.md)                                     | ⭐ **完整产品设计文档**（架构、数据模型、模块设计、路线图） |
| [docs/deployment.md](docs/deployment.md)                       | Cloudflare Pages 部署详细指南                               |
| [docs/apply-template.md](docs/apply-template.md)               | 配置参考手册（按文件组织）                                  |
| [docs/content-format.md](docs/content-format.md)               | MDX 文章格式规范                                            |
| [docs/seo.md](docs/seo.md)                                     | SEO 工程化说明                                              |
| [docs/comments.md](docs/comments.md)                           | Giscus 评论系统接入指南                                     |
| [docs/migration-from-nextjs.md](docs/migration-from-nextjs.md) | 从 Next.js 模板迁移指南                                     |

### 技术栈

| 技术                                                                           | 用途                |
| ------------------------------------------------------------------------------ | ------------------- |
| [Astro 5](https://astro.build)                                                 | 静态优先框架        |
| [Content Collections](https://docs.astro.build/en/guides/content-collections/) | 类型安全的内容管理  |
| [Tailwind CSS 3](https://tailwindcss.com)                                      | 原子化样式          |
| [Cloudflare Pages](https://pages.cloudflare.com)                               | 免费部署 + 无限带宽 |
| [pnpm](https://pnpm.io)                                                        | 包管理              |

---

## 📖 English Documentation

### What is this?

AnvilWiki is an **open-source game wiki site template** designed for building content sites around specific games (Roblox, Steam new releases, etc.), driving traffic via SEO, and monetizing with ads.

Built on **Astro + Cloudflare Pages**: pure static output, zero adapters, free unlimited bandwidth, global CDN, and zero-JS by default for blazing-fast first paint.

### Key Features

- ⚡ **Blazing fast**: Astro zero-JS by default, Lighthouse 4×100 (Performance / Accessibility / Best Practices / SEO)
- 🌐 **Cloudflare native**: Pure static output, zero adapters, free unlimited bandwidth
- 🎨 **JSON-driven homepage**: 6 displayTypes, swap games by editing JSON only
- 🌍 **i18n out of the box**: Default locale (English) has no prefix (SEO optimal), others prefixed, missing content falls back to English
- 🔍 **SEO engineering**: sitemap / JSON-LD (incl. VideoGame) / hreflang / robots / article TOC / Quick Answer summary blocks — all auto-generated
- 🎯 **Ads ready**: Built-in Google AdSense ad components (3 ad positions, env-driven, off by default)
- 💬 **Comments ready**: Built-in Giscus comments (GitHub Discussions), off by default, enable via env — see [docs/comments.md](docs/comments.md)
- 🔄 **Apply template**: File-organized config reference + interactive CLI (`pnpm apply-template`)
- 🆓 **Completely free**: MIT license, free Cloudflare Pages deployment
- 📝 **Type-safe**: Content Collections + Zod schema, catch field errors at build time

### Quick Start (5 min)

```bash
# 1. Fork this repo to your GitHub

# 2. Clone & install locally
git clone https://github.com/PNGTRID/AnvilWiki.git
cd anvilwiki
pnpm install

# 3. Start dev server
pnpm dev
# Visit http://localhost:4321

# 4. Edit config layer (site.ts / navigation.ts / globals.css) + replace content layer (src/content/ / locales/)
#    Or run the interactive CLI to automate base config:
pnpm apply-template

# 5. Deploy to Cloudflare Pages
#    cloudflare.com → Pages → Create a project → Connect to Git → select repo
#    Auto-detects Astro, build command pnpm build, output dir dist
```

See [`docs/deployment.md`](docs/deployment.md) for detailed guide.

### License

[MIT](LICENSE) — free for commercial use.

---

> **Status**: ✅ Live demo at **[anvilwiki.pages.dev](https://anvilwiki.pages.dev/)** — Lighthouse 4×100, CI green, fully deployed.
>
> **Features shipped**: Pagefind offline search · Astro Image (WebP/srcset) · Apply-template CLI · Full i18n (en/ja) · SEO (hreflang, JSON-LD incl. VideoGame, sitemap, article TOC, Quick Answer) · Google AdSense ads · Security headers · Giscus comments (opt-in) · Contact page
>
> 状态：✅ **[anvilwiki.pages.dev](https://anvilwiki.pages.dev/)** 已上线 — Lighthouse 全 100，CI 全绿。

---

## Design Notes

AnvilWiki's information architecture follows the industry-standard game wiki layout (Hero → QuickStart → Explore → CTA; article page with content + sticky aside), consistent with public sites and UI libraries. Visual design, code implementation, and all UI text are original. Built with Astro, Tailwind CSS, and Content Collections — no third-party framework runtime.

AnvilWiki 的信息架构遵循游戏 wiki 站的行业通行布局（首页 Hero → 快速入口 → 内容模块 → CTA；文章页正文 + 侧边栏）。视觉设计、代码实现和全部 UI 文案均为原创。基于 Astro、Tailwind CSS 和 Content Collections 构建，无第三方框架运行时。
