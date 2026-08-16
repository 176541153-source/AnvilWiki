---
title: "开发 3 · 集成与工程:全部开关的总表和机制"
description: "广告/评论/统计等可选功能共用一套开关机制(变量空着=不渲染),这里给全部变量的总表、wrangler.toml 的进阶玩法、三条 CI 流水线各守什么,以及模板内置的安全底线。"
manual: dev
order: 3
icon: lucide:plug
tldr: "所有可选功能一个机制:组件读自己的环境变量,空着就整个不渲染——所以模板开箱跑分满分,功能一个一个开、开一个验一次。变量总表一处查全;wrangler.toml 是进阶选项(保留它=设置全以它为准,连 NODE_VERSION 都要写进去);CI 三条流水线八道门禁替你把关;安全底线(结构化数据转义、赞助链接标记、同意前不加载追踪)已内置,定制时别破坏。"
updated: 2026-08-17
---

## 你现在在哪,这章解决什么

想开广告、接评论、装统计,或者想看懂仓库里那几条自动检查在干什么——这章是开关总表 + 机制说明。**查询手册,按需翻。**

## 开关机制:一个模式走天下

每个可选功能(广告、评论、统计、赞助卡)都是同一个套路:

```astro
---
const client = import.meta.env.PUBLIC_ADSENSE_CLIENT;
if (!client) return null;   // 变量空着 = 这个组件整个消失
---
```

这给你两个保证:

1. **什么都不填**:网站干干净净,跑分(Lighthouse)四项满分。
2. **想开哪个填哪个**:互不影响,开一个跑一次 build 确认分数没掉。

所以**不要**给这些变量填默认值或抄别人的演示值——空着才是正确状态。本地的 `.env` 文件也能填这些变量(不进 git,密钥永不入库)。

## 全部变量总表

填的位置:二选一——**Cloudflare 网页**(Settings → Variables,学习手册教的路线,推荐)或**仓库的 `wrangler.toml` 文件**(进阶,见下节)。

| 变量名 | 干什么的 | 空着会怎样 |
|---|---|---|
| `SITE_URL` | 网站的正式网址(**唯一必填**,必须 `https://` 开头) | 全站分享卡片和 sitemap 网址错误 |
| `PUBLIC_ADSENSE_CLIENT` | AdSense 总开关(发布商 ID) | 不加载任何广告 |
| `PUBLIC_ADSENSE_SLOT_STICKY` / `_SIDEBAR` / `_INCONTENT` | 三个广告位 | 对应位置不显示 |
| `PUBLIC_GISCUS_REPO` / `_REPO_ID` / `_CATEGORY` / `_CATEGORY_ID` | Giscus 评论(靠 GitHub Discussions) | 评论区不显示 |
| `PUBLIC_GA_ID` | Google Analytics 4 | 不加载 GA |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare 自带统计(无 cookie) | 不加载 |
| `PUBLIC_GSC_VERIFICATION` | Google 站长后台验证码 | 不输出验证标签 |
| `PUBLIC_SPONSOR_URL` / `_IMAGE_URL` | 赞助卡片 | 赞助卡不显示 |

## 进阶:保留 wrangler.toml(设置记进仓库)

学习手册让你删了 `wrangler.toml`,从此设置只认 Cloudflare 网页。如果你**反过来**想保留它(好处:设置随代码走版本记录),规矩只有一条:**它在,网页设置就全部无效**——包括部署时的 Node 版本。所以保留它就要把所有变量写进它的 `[vars]` 段,至少包括:

```toml
[vars]
NODE_VERSION = "22"
SITE_URL = "https://你的域名"
```

诊断小技巧(设置疑似没生效时):在 `astro.config.ts` 第一行临时加 `console.log('ENV:', Object.keys(process.env).filter(k => k.startsWith('PUBLIC_')))` ,push 后看 Cloudflare 构建日志里到底有哪些变量;查完删掉这行。

## 三条自动流水线(.github/workflows/)

| 流水线 | 什么时候跑 | 替你把什么关 |
|---|---|---|
| **CI** | 每次 push / PR | 八道门禁:lint → typecheck → test → check-config → build → check-content → check-links → check-i18n,红一条都不许合 |
| **Content freshness audit** | 每周一(定时) | 跑保鲜审计,过期页面自动开 issue 提醒。**默认只在 AnvilWiki 官方仓库生效**(fork 不装条件开关,免得给你开一堆提醒);想在自己的站开启:让 AI 删掉文件里 `if: github.repository ==` 那行。它**只提醒、绝不改内容**——自动化碰内容的风险不可控 |
| **Initialize AnvilWiki** | 手动点 | fork 后的收尾清理:重置 wrangler.toml 变量、删项目页、可选清演示内容。**不换游戏名/主题色/语言**——那些只能本地跑 `pnpm apply-template` |

## 安全底线(已内置,定制时别拆)

- **结构化数据转义**:页面里给 Google 看的数据卡片统一做了字符转义,文章里就算被人塞了恶意代码也逃不出去。你新增数据组件时必须沿用现成的 `JsonLd.astro`,别自己手拼。
- **赞助链接**:联盟推广链接组件自动带 `sponsored nofollow` 标记(向 Google 声明这是付费链接);外链统一 `noopener`。
- **同意前不追踪**:用户没点 cookie 同意之前,GA 和 AdSense 根本不加载——是真的不加载,不是摆个横幅。
- **密钥不进库**:一切敏感值走变量;`.env` 已在忽略清单里。

## 性能底线(动代码层时守住)

- 零 JS 框架:不引入 React/Vue 之类的运行时;交互用浏览器原生能力(可折叠块、弹窗)+ 极少量原生脚本。
- 图片走模板的图片管线(自动压缩成 WebP、自动适配手机)。
- 改完想验跑分:`pnpm build && npx wrangler pages dev dist`,再用浏览器 Lighthouse 面板打分。

## 卡住了怎么办

- **「填了变量没效果」**:先想填的位置对不对(网页 or wrangler.toml,后者优先);再核对变量名字符完全一致(区分大小写);最后确认保存后重新部署过。
- **「CI 红了」**:点进红色那条看日志最后一行,八道门禁哪道挂了日志开头会写。

## ✅ 验收(全部成立才算完成)

- ☐ 每开一个新功能,`pnpm build` 全绿且线上该出现的组件出现/该消失的消失
- ☐ 能说出自己站走的是哪条设置路线(网页 or wrangler.toml),并且只走一条
- ☐ 自己 fork 的 Actions 页 CI 是绿的

## 下一步

模板作者会持续发新版——[开发 4 · 同步与回流](/zh/landing/docs/sync-and-contribute):怎么安全地合并上游更新,以及怎么把你的好改进贡献回官方。
