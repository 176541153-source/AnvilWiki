---
title: "半小时建站:从 fork 到本地跑起来"
description: "Fork 仓库、安装依赖、跑交互式 apply-template CLI 把 demo 站换成你的游戏,每一步的命令、每个 CLI 提示词怎么填、以及新手最常见的三类报错。"
manual: learn
order: 2
icon: lucide:rocket
tldr: "Fork → clone → pnpm install → pnpm dev 看到 demo 站,然后跑 pnpm apply-template 一次性替换游戏名、主题色、语言和分类;跑 pnpm check-config 自检三处一致性。全程约 30 分钟,不需要写任何代码。"
updated: 2026-08-16
---

## 你会在这一章完成什么

一个跑在 `http://localhost:4321` 的、属于你选好的游戏的完整 wiki 站——带主题色、导航、多语言骨架和搜索。之后两章(产页、部署)都建立在这个基础上。

## 第一步:Fork 并克隆(5 分钟)

```bash
# 1. 在 GitHub 上 fork https://github.com/PNGTRID/AnvilWiki 到你的账号

# 2. 本地克隆(换成你的 GitHub 用户名)
git clone https://github.com/<你的用户名>/AnvilWiki.git
cd AnvilWiki

# 3. 安装依赖(需要 Node 22+ 和 pnpm 11)
pnpm install

# 4. 启动开发服务器
pnpm dev
# 打开 http://localhost:4321 —— 现在看到的是虚构游戏「Anvil Quest」的 demo 站
```

没有 pnpm?先装:`npm install -g pnpm`(或 `corepack enable`)。Node 版本用 `node -v` 检查,需要 ≥ 22.13。

**新手报错 1:安装时报 build script 警告。** pnpm 11 需要批准 esbuild/sharp 的构建脚本,仓库的 `pnpm-workspace.yaml` 已经配好 `allowBuilds`,正常情况直接通过;如果你动过该文件,恢复它即可。

## 第二步:跑 apply-template CLI 换成你的游戏(10 分钟)

```bash
pnpm apply-template
```

交互式 CLI 会逐项询问,每项的填法:

| 提示 | 怎么填 | 说明 |
|---|---|---|
| Full game name | 游戏完整名(如 `Blade Ball`) | 用于标题、SEO、法律声明 |
| Short name | 默认取首字母缩写,可直接回车 | PWA/手机端显示名 |
| Domain | 你的域名,如 `mygame-wiki.com`;没有就先填 `<你>.pages.dev` | 进 canonical/og:image 绝对路径;**部署前必须改成真域名** |
| Hero tagline | 首页大标题副句 | 一句话卖点 |
| Site description | 40-165 字符的站点描述(SEO) | 含游戏名和内容类型关键词 |
| Legal notice | 默认模板即可 | 免责声明(非官方、非隶属) |
| Official game URL | 游戏官网/商店页 | 元数据用 |
| Theme color | `#rrggbb` 十六进制 | CLI 自动转 HSL 写进 `globals.css`,全站配色跟着变 |
| Platform / Developer / Genre | 按实际填 | 结构化数据用 |
| Release date | 发行日期(ISO 格式),可留空 | 结构化数据用 |
| Locales | 逗号分隔,如 `en,zh`;**第一个是默认语言,en 必须在** | 英文无路径前缀,其他语言带前缀 |
| Categories | 逗号分隔小写 key,如 `codes,guides,bosses` | 常用:bosses/guides/items/codes/tier-list/characters |
| Clear demo content? | 建议回车(默认 N)先保留 demo 参考,部署前再清 | 删掉 demo MDX,保留目录结构 |
| Homepage preset | codes 型站选 1(默认),攻略型选 2,想保留 demo 选 3 | 决定首页模块组合 |
| Remove landing page? | 回车(默认 Y) | /landing 是 AnvilWiki 项目官网页,你的游戏站不需要 |

CLI 做的事:重写 `site.ts`/`navigation.ts`/`routing.ts`/`ui.ts`/`globals.css`(仅 8 行主题色变量)/`locales/*.json`/`manifest.json`/`wrangler.toml [vars]`,清 demo 作者,可选清 demo 内容并给每个分类生成一篇骨架文章。

**不想逐项回答?** 在 CLI 里用 `pnpm apply-template --dry-run` 先预览所有改动。仓库另有一个 **Initialize AnvilWiki** workflow(Actions 标签页手动触发),但它只做收尾清理(重置 wrangler.toml vars、删项目 landing 页、可选清 demo 内容并开 PR)——**不含游戏名/主题色/语言替换**,完整初始化仍要本地跑 CLI。

**新手报错 2:改完配置后 build 挂,提示分类 key 不一致。** 分类 key 必须三处一致(CLI 帮你保证了):`navigation.ts` 的 `NAVIGATION_CONFIG[].key` = `en.json` 的 `nav.<key>` = `src/content/wiki/en/<key>/` 目录名。手改配置属于高级操作,参考 [docs/apply-template.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md)。

## 第三步:自检 + 预览(5 分钟)

```bash
pnpm check-config   # 分类/语言三处一致性
pnpm build          # 全量校验(schema + 类型 + 构建)
pnpm dev            # 人眼验收
```

**新手报错 3:`astro build` 报 SITE_URL 格式错。** `SITE_URL` 必须含 `https://` 协议,裸域名会构建失败。CLI 已按规范写入,手改 `wrangler.toml` 时别去掉协议。

本地检查清单:

- ☐ 首页是你游戏的名字和主题色(不是 Anvil Quest/橙色)
- ☐ 导航只显示你选的分类
- ☐ 浏览器标签页标题正确
- ☐ 移动端宽度下布局正常(DevTools 切换设备模拟)

## wrangler.toml 预警(现在知道,部署章不踩)

仓库自带的 `wrangler.toml` 存在时,它是 Cloudflare Pages env 的**唯一真相源**,dashboard 的环境变量 UI 会被完全忽略。CLI 已经把它的 `[vars]` 重置为你的配置;后续在 dashboard 里配广告/统计变量前,先读[部署章](/zh/landing/docs/deploy-and-get-indexed)的二选一策略。

> **✅ 验收(全部成立才算完成)**
> - 命令:`pnpm check-config && pnpm build` → 全绿
> - 页面:`pnpm dev` 打开 localhost:4321 —— 游戏名/主题色/分类都是你的
> - ☐ git 里能看到 CLI 改过的文件(config 层),且 `git diff` 没有意外触碰 src/pages、src/components
> - ☐ Domain 字段已确认(没有域名先用 pages.dev 占位)

## 下一步

站壳有了,但内容还是 demo(或空)。下一章是整个方法论的核心:让 AI 在一天内产出 10 个能过构建校验、面向搜索意图的页面——含完整提示词。
