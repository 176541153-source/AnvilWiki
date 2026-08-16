---
title: "集成与工程:env 门控、CI 门禁与安全基线"
description: "全部环境变量总表与「空值即不渲染」门控模式,三条 CI 工作流分别在守护什么,以及模板内置的安全基线——JSON-LD 转义、外部链接 rel、cookie consent 门控。"
manual: dev
order: 3
icon: lucide:plug
tldr: "所有可选功能走同一个模式:组件读 PUBLIC_* env,空值直接 return null 不渲染——这就是开箱 Lighthouse 4×100 的原因。CI 三条工作流(CI/内容保鲜审计/初始化)把验证自动化;安全基线(JSON-LD 转义、sponsored rel、consent 门控)已在框架层内置。"
updated: 2026-08-16
---

## env 门控模式(全部可选功能共用)

每个可选组件的模式一模一样:

```astro
---
const client = import.meta.env.PUBLIC_ADSENSE_CLIENT;
if (!client) return null;   // 空值 = 不渲染 = 零 JS 零请求
---
```

这带来两个契约:**默认关闭**(fork 开箱 = Lighthouse 4×100)和**渐进开启**(逐个填 env,每开一个跑一次 build 看分数)。给广告/评论 env 加默认值或硬编码 demo 配置是违反契约的行为。

## 环境变量总表

构建时注入,声明位置:保留 `wrangler.toml` 就写 `[vars]`,删了就在 Cloudflare dashboard(二选一,见[部署章](/zh/landing/docs/deploy-and-get-indexed)):

| 变量 | 功能 | 空值行为 |
|---|---|---|
| `SITE_URL` | 站点绝对地址(**必填**,含 `https://`) | 构建产物 URL 错误 |
| `PUBLIC_ADSENSE_CLIENT` | AdSense loader | 不加载广告脚本 |
| `PUBLIC_ADSENSE_SLOT_STICKY` / `_SIDEBAR` / `_INCONTENT` | 三个广告位 | 对应广告位不渲染 |
| `PUBLIC_GISCUS_REPO` / `_REPO_ID` / `_CATEGORY` / `_CATEGORY_ID` | Giscus 评论 | 评论区不渲染 |
| `PUBLIC_GA_ID` | Google Analytics 4 | 不加载 GA |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics | 不加载 beacon |
| `PUBLIC_GSC_VERIFICATION` | GSC 验证 meta | 不输出验证标签 |
| `PUBLIC_SPONSOR_URL` / `PUBLIC_SPONSOR_IMAGE_URL` | 赞助卡片 | 赞助卡不渲染 |

本地 `.env` 文件同样生效(`import.meta.env` 读取,`.env` 已在 `.gitignore`——密钥永不进库)。

## 三条 CI 工作流(.github/workflows/)

| 工作流 | 触发 | 守护什么 |
|---|---|---|
| **CI**(ci.yml) | 每次 push/PR | lint + typecheck + test + check-config + build + check-content + check-links + check-i18n——全部八道门禁,红了不许合 |
| **Content freshness audit**(content-pipeline.yml) | 每周一定时(**仅上游仓库生效**,fork 需删 `if` 条件开启) | 跑 `refresh-audit`,P0/P1 自动开 issue;**只开 issue 绝不改内容**(LLM 改内容的供应链风险不可控,人工门控必须保留) |
| **Initialize AnvilWiki**(setup.yml) | 手动触发 | fork 后的收尾清理:重置 wrangler.toml `[vars]`、删项目 landing 页、可选清 demo 内容并开 PR。**不含游戏名/主题色/语言替换**——那些仍要本地跑 `pnpm apply-template` |

本地等价物:门禁命令见 `package.json` scripts(`check-config`/`check-content`/`check-i18n`/`check-links`/`check-sitemap`/`refresh-audit`);push 前 `pnpm build` 就是 CI 的缩影。

## 安全基线(框架层已内置,定制时别破坏)

- **JSON-LD 转义**:序列化统一 `\u003c` 转义,frontmatter 里的 `</script>` 无法逃逸 script 标签(存储型 XSS 面已关闭);新增结构化数据组件必须沿用 `JsonLd.astro`
- **外部/赞助链接**:`AffiliateLink` 自动带 `rel="sponsored nofollow"`;外部链接统一 `rel="noopener"`
- **Cookie consent 真门控**:GA/AdSense 在用户同意前不加载(不是装饰性横幅)
- **无密钥进库**:一切敏感值走 env;`.env` 不进 git

## 性能预算(改 Code 层时守住)

- 零 JS runtime(ADR-002):不引入 React/Vue/Svelte islands;交互用 `<details>`/`<dialog>` + 极少 vanilla JS
- 图片走 Astro Image(自动 WebP/srcset + 显式宽高防 CLS)
- 每次改完跑 Lighthouse(CI 不管这个,手动):`pnpm build && npx wrangler pages dev dist` 后用 Lighthouse CLI 打 localhost

> **✅ 验收(全部成立才算完成)**
> - 命令:填一个新 env 后 `pnpm build` 全绿,`curl` 对应页面确认组件按预期渲染/不渲染
> - ☐ 「空值 = 不渲染」模式在自己的新组件里被遵守(如果你加了组件)
> - ☐ CI 在你的 fork 上是绿的(Actions 标签页)

## 下一步

上游会持续进化——[同步与贡献章](/zh/landing/docs/sync-and-contribute):怎么 merge 上游不丢配置,以及怎么把你的改进回流给社区。
