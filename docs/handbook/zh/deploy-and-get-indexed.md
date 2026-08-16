---
title: "部署上线与首次收录:Cloudflare + Google 双开"
description: "推送 GitHub、连接 Cloudflare Pages 自动部署、处理 wrangler.toml 环境变量二选一,以及上线当天的 SEO 动作:GSC 验证、提交 sitemap、请求收录。"
manual: learn
order: 4
icon: lucide:cloud
tldr: "git push 后在 Cloudflare Pages 连接仓库(Astro 自动识别,构建 pnpm build 输出 dist),免费获得无限带宽。上线当天完成三件事:GSC 验证域名、提交 sitemap.xml、对新页请求收录;Cloudflare 自动提交 IndexNow 让 Bing 即时发现。"
updated: 2026-08-16
---

## 部署:10 分钟,之后每次 push 自动上线

### 第一步:推代码

fork 的仓库 remote 已配好,直接:

```bash
git add .
git commit -m "Launch: my game wiki"
git push
```

### 第二步:连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub,选中你的仓库 → **Begin setup**
3. 确认构建配置(Cloudflare 自动识别 Astro):

| 字段 | 值 |
|---|---|
| Project name | 你的站名 |
| Production branch | `main` |
| Framework preset | Astro(自动) |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| NODE_VERSION(env) | `22` |

4. **Save and Deploy**。首次构建 2-3 分钟,完成后拿到 `https://<project>.pages.dev`。

### 第三步:wrangler.toml 二选一(最大的坑,必读)

**仓库里的 `wrangler.toml` 存在时,它是 Pages env 的唯一真相源,dashboard 的 Environment variables UI 被完全忽略。** 你在 dashboard 配了变量但 build 拿不到(症状:广告不显示、`process.env` 读不到),99% 是这个原因。

| 方案 | 操作 | 适合 |
|---|---|---|
| **A(推荐新手)** | `git rm wrangler.toml && git commit`,之后 dashboard 配 env 生效 | 不想碰配置文件 |
| **B** | 保留文件,改 `[vars]` 段的值(`SITE_URL`、广告/评论变量都写在这) | 想把 env 进版本库 |

诊断法:在 `astro.config.ts` 顶部临时加 `console.log('ENV:', Object.keys(process.env).filter(k => k.startsWith('PUBLIC_')))` ,push 后看 Cloudflare build 日志里到底有哪些变量。

### 第四步:SITE_URL 换成正式域名(有域名时)

`SITE_URL` 影响站内所有绝对 URL(sitemap/og:image/robots.txt/canonical):

- 值必须含 `https://` 协议,裸域名 build 直接报错
- 先用 `https://<project>.pages.dev`,绑定自定义域名后再改回来重新部署
- 绑域名:Cloudflare Pages → Custom domains → 添加,按提示加 CNAME;DNS 在 Cloudflare 托管则零配置

改完跑 `pnpm check-sitemap`(BASE_URL 指向你的域名)确认 sitemap 里 URL 全部 200。

## 上线当天的 SEO 三件事

### 1. 验证 Google Search Console

[GSC](https://search.google.com/search-console) → Add property → **Domain** 类型(覆盖所有子域,推荐)→ 按提示在 DNS 加 TXT 记录 → 验证。没有自定义域名就用 URL prefix 类型 + HTML 标记方式(模板支持 `PUBLIC_GSC_VERIFICATION` env,填验证码即可自动输出 meta 标签)。

### 2. 提交 sitemap

GSC → Sitemaps → 填 `sitemap-index.xml` → Submit。模板的 sitemap 自带 `lastmod`(取文章 frontmatter 日期),Google 用它调度重抓。

### 3. 请求收录(加速冷启动)

GSC 顶部搜索框逐个粘贴你最重要的 5-10 个 URL(codes 页优先)→ **Request Indexing**。配合:

- Cloudflare Pages 对新部署自动提交 **IndexNow**(Bing 等即收)
- 首页/分类页的「最新文章」模块天然给新页内链
- 在 Reddit/Discord 等社区自然提及(外链信号)

## 上线后自检清单

```bash
# 本地或 CI 均可
pnpm build && pnpm check-links          # 内链全检
BASE_URL=https://你的域名 pnpm check-sitemap   # sitemap URL 全部 200
curl -s https://你的域名/robots.txt     # 应引用 sitemap
curl -s https://你的域名/llms.txt       # AI 爬虫发现入口
```

浏览器检查:`view-source:` 看 og:image/og:title 绝对路径正确、`<link rel="alternate">` hreflang 成对。

> **✅ 验收(全部成立才算完成)**
> - 命令:`BASE_URL=https://你的域名 pnpm check-sitemap` → 全 200
> - 页面:线上打开任一文章页,分享卡片(og:image)显示正常
> - ☐ GSC 已验证、sitemap 已提交、≥5 个 URL 已请求收录
> - ☐ wrangler.toml 二选一已做决策(dashboard env 生效路径明确)
> - ☐ SITE_URL 与线上实际域名一致

## 下一步

站上线了、Google 开始爬了——但流量变现和长期增长靠节奏。最后一章:接 AdSense、配评论、以及每周 30 分钟的运营 SOP(含保鲜提示词)。
