# AnvilWiki ⚒️

> 带 AI 内容工作流的游戏 wiki 模板——广告收入 100% 归你。
> 开源、Cloudflare Pages 原生优化、零成本免费部署上线。
>
> The game wiki template with an AI-native content workflow — 100% of your ad revenue.
> Open source, natively optimized for Cloudflare Pages, free to deploy.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Release](https://img.shields.io/github/v/release/PNGTRID/AnvilWiki?label=Release&color=brightgreen)](https://github.com/PNGTRID/AnvilWiki/releases)
[![Live Demo](https://img.shields.io/badge/Demo-anvilwiki.pages.dev-brightgreen)](https://anvilwiki.pages.dev/)
[![Docs](https://img.shields.io/badge/Docs-/landing/docs-8b5cf6)](https://anvilwiki.pages.dev/zh/landing/docs)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/PNGTRID/AnvilWiki)

> ⚠️ **Fork 部署前必读 / Before deploying a fork**:仓库里的 `wrangler.toml` 存在时,它是 Cloudflare Pages env 的**唯一真相源**,dashboard 的 Environment variables UI 会被完全忽略。fork 后要么跑 `pnpm apply-template`(自动把 `[vars]` 重置为你的域名并清空 demo 值),要么手动改 `[vars]` 或删除该文件。详见 [`docs/deployment.md`](docs/deployment.md)。
>
> ⚠️ The shipped `wrangler.toml`, when present, is the **sole source of truth** for your Cloudflare Pages env — the dashboard's Environment variables UI is ignored. Run `pnpm apply-template` after forking (it resets `[vars]` to your domain and clears demo values), or edit/delete the file yourself. See [`docs/deployment.md`](docs/deployment.md) for details.

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

## 🚀 快速链接

| 你想… | 去这里 |
|---|---|
| **零基础从零做一个赚钱的游戏站** | 📚 [学习手册(8 章)](https://anvilwiki.pages.dev/zh/landing/docs/learn)——每步写明「做什么/怎么做/你会看到什么」,含 13 个可复制提示词 |
| 看「从零到赚钱」的全部工作量 | 🗺️ [文档中心首页](https://anvilwiki.pages.dev/zh/landing/docs)——10 件事全景清单,逐项点入 |
| 深度定制 / 给模板写代码 | 🔧 [开发手册(6 章)](https://anvilwiki.pages.dev/zh/landing/docs/dev) |
| 看看做出来长什么样 | 🎮 [在线 Demo](https://anvilwiki.pages.dev/)——虚构游戏「Anvil Quest」的完整 wiki |

## 📖 中文文档

### 这是什么？

AnvilWiki 是一个**游戏 SEO 内容站模板**——用来快速搭建围绕某款游戏(Roblox、Steam 新游等)的攻略内容站,通过 SEO 获取流量,通过广告变现。**广告收入 100% 归你**:无平台抽成、无收入分成(对比 Fandom 等托管 wiki 的平台分成模式)。

技术栈是 **Astro + Cloudflare Pages**:纯静态输出、零适配器、免费无限带宽、全球 CDN、零 JS 优先(首屏极快)。

**适合谁**:想靠游戏内容做副业、会用浏览器但**不会编程**的人(学习手册就是按这个标准写的),以及想被 AI 工作流加速的内容创作者。

### 核心特性

- 📚 **零基础双手册(站内文档中心)**:学习手册 8 章 + 开发手册 6 章,中英双语,从选游戏到赚到钱每一步都是 SOP + 可复制的 AI 提示词;每章带手册目录树和本页目录
- 🤖 **AI 内容工作流**:Agent 技能随仓库分发(`.agent/skills/`,Agent Skills 开放标准)——对 ZCode / Claude Code / Codex 说「根据这些笔记写篇攻略」,产出直接通过构建质检
- 💰 **广告收入 100% 归你**:内置 AdSense 广告位(3 个位置,env 驱动,默认关闭)+ 赞助卡 + 联盟链接组件——无平台抽成
- 🔍 **SEO 工程化**:sitemap(含 lastmod)/ JSON-LD 全套 / hreflang / Quick Answer 摘要块 / llms.txt(AI 搜索),全部自动生成
- ⚡ **极快**:Astro 零 JS 优先,Lighthouse 4×100 开箱即得(开了广告也不掉分)
- 🆓 **零成本**:Cloudflare Pages 免费无限带宽 + 全球 CDN + SSL,永远没有服务器账单
- 🌍 **多语言开箱即用**:英文无前缀(SEO 最优),其他语言带前缀,缺失内容自动回退英文(直链永不 404)
- 🎮 **wiki 级内容呈现**:Boss 数据卡、兑换码一键复制、文章 TOC 滚动高亮、画廊灯箱、Giscus 评论(默认关闭)

### 5 分钟快速开始

```bash
# 1. Fork 本仓库,然后克隆(换成你的 GitHub 用户名)
git clone https://github.com/<你的用户名>/AnvilWiki.git
cd AnvilWiki

# 2. 安装依赖并启动(Node 22+ / pnpm 11)
pnpm install
pnpm dev          # 打开 http://localhost:4321

# 3. 一条问答式命令,把 demo 站换成你的游戏
pnpm apply-template

# 4. 部署:cloudflare.com → Pages → Connect to Git → 选仓库
#    自动识别 Astro:构建命令 pnpm build,输出目录 dist,环境变量 NODE_VERSION=22
```

**完全新手?别从这里开始**——先去[学习手册第 2 章](https://anvilwiki.pages.dev/zh/landing/docs/install-tools),它把终端、Node、Git、AI 助手怎么装、每步会看到什么,全部一步步写清了。

### 用 AI 直接生成内容(无需脚本)

fork 后用 ZCode / Claude Code / Codex / Cursor 打开仓库,直接对话即可产页。Agent 会自动加载仓库里的内容规范,生成后自动跑 `pnpm check-content && pnpm build` 自检。内置 3 个技能:

| 技能 | 用途 |
|---|---|
| `anvil-new-article` | 任意素材(口述/视频内容/原始数据)→ 合规 MDX 文章 |
| `anvil-update-codes` | 新兑换码/过期码 → 更新 codes 页并同步多语言 |
| `anvil-refresh` | 新鲜度巡检 → 输出「该更新什么」优先级清单 |

完整的提示词库(选品分析、产页、翻译、SEO 体检等 13 个模板)在[学习手册](https://anvilwiki.pages.dev/zh/landing/docs/learn)里,整段复制就能用。

### 文档导航

**首选:[站内文档中心](https://anvilwiki.pages.dev/zh/landing/docs)** —— 双手册(中英),手册 markdown 源码在 [`docs/handbook/`](docs/handbook/)(fork 后保留,可直接用提示词 SOP)。

仓库内参考文档(查阅式,按需取用):

| 文档 | 内容 |
|---|---|
| [docs/game-selection.md](docs/game-selection.md) | 选品漏斗 + 首日 10 页方法论 |
| [docs/apply-template.md](docs/apply-template.md) | 配置参考手册(按文件组织) |
| [docs/content-format.md](docs/content-format.md) | MDX 文章格式规范(字段表) |
| [docs/deployment.md](docs/deployment.md) | Cloudflare Pages 部署(含 wrangler.toml 大坑) |
| [docs/staying-up-to-date.md](docs/staying-up-to-date.md) | fork 后怎么同步上游 |
| [docs/development.md](docs/development.md) | 给模板写代码:架构、验证、发版 |
| [docs/README.md](docs/README.md) | 全部文档索引 + 四条阅读路径 |

### 为什么不用 Fandom / 自建 Next.js?

| | AnvilWiki | Fandom 类平台 | 自建 Next.js |
| --- | --- | --- | --- |
| 广告收入 | **100% 归你**(自带 AdSense 位) | 平台抽成 | 归你,但要自己接 |
| 每月成本 | **¥0**(Cloudflare Pages 免费无限带宽) | 免费(代价是失去控制权) | Vercel 免费额度有限 |
| Lighthouse | **4×100 开箱即得** | 平台决定 | 自己调优数周 |
| AI 产页 | **技能随仓库分发,对话即产页** | 无 | 自己搭 |
| 上手门槛 | **零基础手册 8 章** | 低但受制于人 | 高 |

### 常见问题

- **要花多少钱?** 托管 ¥0;唯一必要开销是域名(一年几十块,AdSense 审核需要)。
- **不会编程能做吗?** 能。学习手册按「完全零基础」标准写,每步都有「你会看到什么」;所有代码活交给 AI 助手。
- **多久有收入?** 黄金窗口是游戏爆发后 2-8 周,头 1-2 周收入为零是正常的——手册第 8 章讲怎么经营预期。
- **模板更新了,我的站会被覆盖吗?** 不会。三层分离设计,合并上游时你的游戏配置和文章永远保留(见 [docs/staying-up-to-date.md](docs/staying-up-to-date.md))。

### 用 AnvilWiki 建了站?欢迎提交 Showcase

提 PR 修改 `src/config/landing.ts` 的 showcase 数据即可——真实案例是这个模板最有力的证明。

### 交流群 / 技术栈

交流方式见[项目官网](https://anvilwiki.pages.dev/zh/landing)底部。技术栈:Astro 5(静态输出)+ Tailwind CSS 3 + MDX 4 + astro-icon/lucide + Content Layer API(Zod)+ Pagefind 搜索 + pnpm 11 / Node 22。

---

## 📖 English Documentation

**Start here: the [Learning Manual](https://anvilwiki.pages.dev/landing/docs/learn)** — 8 chapters, written for complete beginners, every step a SOP with copy-paste AI prompts. The [Development Manual](https://anvilwiki.pages.dev/landing/docs/dev) (6 chapters) covers deep customization. Both bilingual, with a [10-job whole-picture checklist](https://anvilwiki.pages.dev/landing/docs) at the docs hub.

### What is this?

AnvilWiki is an **open-source game wiki site template**: build a content site around a game (Roblox, Steam new releases…), pull traffic via SEO, monetize with ads — **100% of the ad revenue is yours**. Built on Astro + Cloudflare Pages: pure static, zero adapters, free unlimited bandwidth, Lighthouse 4×100 out of the box.

### Quick Start (5 min)

```bash
# 1. Fork this repo, then clone (replace with YOUR username)
git clone https://github.com/<your-username>/AnvilWiki.git
cd AnvilWiki

# 2. Install & run (Node 22+ / pnpm 11)
pnpm install
pnpm dev          # visit http://localhost:4321

# 3. One guided command swaps the demo for your game
pnpm apply-template

# 4. Deploy: cloudflare.com → Pages → Connect to Git
#    Astro auto-detected: build `pnpm build`, output `dist`, env NODE_VERSION=22
```

Complete beginner? Start from [Chapter 2 of the Learning Manual](https://anvilwiki.pages.dev/landing/docs/install-tools) instead — it walks you through installing every tool, with "what you'll see" on each step.

### Key Features

- 📚 **Two beginner manuals** (Learning 8 chapters / Development 6, bilingual) with 13 copy-paste AI prompts
- 🤖 **AI-native workflow**: agent skills ship inside the repo — say "write a boss guide from these notes", get a build-check-passing page
- 💰 **100% your ad revenue**: AdSense slots (3 positions, env-gated, off by default), sponsor card, affiliate component
- 🔍 **SEO engineering**: sitemap (lastmod) / JSON-LD suite / hreflang / Quick Answer blocks / llms.txt — all automatic
- ⚡ **Fast**: zero-JS-first Astro, Lighthouse 4×100 out of the box
- 🆓 **Free forever**: Cloudflare Pages, unlimited bandwidth, global CDN, SSL
- 🌍 **i18n built in**: English at root, prefixed locales, English fallback so URLs never 404

Repository reference docs: [game-selection](docs/game-selection.md) · [apply-template](docs/apply-template.md) · [content-format](docs/content-format.md) · [deployment](docs/deployment.md) · [staying-up-to-date](docs/staying-up-to-date.md) · [development](docs/development.md) · [full index](docs/README.md)

### Community & License

Built a site with AnvilWiki? Open a PR to add it to the landing Showcase (`src/config/landing.ts`). MIT License — see [LICENSE](LICENSE).

---

## Design Notes

- **Three-layer separation** (code / config / content) is the core architectural decision — it's what makes forks mergeable upstream. See [docs/PRD.md](docs/PRD.md).
- Optional features (ads, comments, analytics) are **env-gated and off by default** — a fresh fork ships zero-JS and zero-cookie, preserving the Lighthouse 4×100 contract.
- The demo game "Anvil Quest" is fictional by design: forks replace it wholesale via `pnpm apply-template`, and the project landing + docs center are removed for forks automatically (the handbook markdown stays as repo docs).
