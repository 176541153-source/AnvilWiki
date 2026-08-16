---
title: "开发手册·架构总览:三层分离与改动地图"
description: "AnvilWiki 的代码/配置/内容三层分离设计,每个改动该落在哪一层的决策树,目录地图、数据流,以及 fork 后最容易踩的 Astro 5 六个坑。"
manual: dev
order: 1
icon: lucide:layers
tldr: "三层分离是全部架构决策的地基:Code 层(src/pages、components、lib)fork 后几乎不碰;Config 层(src/config、locales、globals.css)每游戏改一次;Content 层每篇文章都改。动手前先用决策树定位改动落点,再用验证三件套收尾。"
updated: 2026-08-16
---

## 为什么先读这一章

AnvilWiki 的每个设计都服务于同一个目标:**fork 用户改内容不改框架,改配置不重写框架,框架层零游戏字符串**。理解三层分离,你才知道自己的每个改动该落在哪、会不会在下次同步上游时被冲掉。

## 三层地图

| 层 | 目录 | fork 后你会改吗 | merge 冲突概率 |
|---|---|---|---|
| **Code** | `src/pages` `src/components` `src/lib` `src/i18n` | 几乎不碰 | 低 |
| **Config** | `src/config` `src/locales` `src/styles/globals.css` `wrangler.toml` `astro.config.ts` `public/` | 一定会改 | **高(预期内)** |
| **Content** | `src/content/wiki` `src/locales/<loc>.json` 的 home 数据 | 一定会替换 | 高(预期内) |

上层规则:改内容不碰框架;改配置不重写框架;框架层不得出现游戏特定字符串(UI 文案全部走 `src/locales/<locale>.json`)。

## 改动决策树

```
你要改什么?
├─ 文案/标签/首页模块 → src/locales/<locale>.json(UI 文案)
│                       src/locales/<locale>.json 的 home.*(首页模块)
├─ 游戏名/域名/作者   → src/config/site.ts
├─ 导航分类           → src/config/navigation.ts + en.json nav.<key> + 内容目录(三处一致!)
├─ 主题色             → src/styles/globals.css 的 --brand/--brand-light(共 4 行)
├─ 语言列表           → src/i18n/routing.ts + locales JSON + 内容目录(三处一致!)
├─ 文章内容           → src/content/wiki/<locale>/<category>/*.mdx
├─ 新组件/新页面      → src/components / src/pages(Code 层,改了要考虑上游同步成本)
└─ env 开关(广告/评论/统计) → wrangler.toml [vars] 或 dashboard(二选一)
```

两条「三处一致」铁律(`pnpm check-config` 自动校验):

1. 分类 key:`navigation.ts` 的 `NAVIGATION_CONFIG[].key` = `en.json` 的 `nav.<key>` = `src/content/<locale>/<key>/` 目录名
2. 语言:`routing.ts` 的 `locales` = `src/locales/*.json` 文件 = `src/content/<locale>/` 目录

## 一次页面请求的数据流(静态构建时)

```
MDX frontmatter → Zod schema 校验(src/content.config.ts,不合法直接构建失败)
    → getCollection() 取集合(i18n 回退:详情页回退英文,列表页不回退)
    → getStaticPaths() 生成静态路由
    → Astro 组件渲染 → dist/ 纯 HTML
postbuild → Pagefind 索引正文 → 搜索零运行时
```

多语言规则(**有意的不对称**):文章详情页请求的语言版本不存在时回退英文(直链永不 404);列表页不回退(不展示不存在的内容)。

## Astro 5 六个坑(实测,AGENTS.md 完整版)

1. `entry.id` 带 `.mdx`,但 `getEntry()` 不要扩展名——用 `parseEntryId` 统一处理
2. Content Layer API 里 `entry.render()` 不存在——用独立 `render()` 函数
3. `getStaticPaths` 编译为独立模块,文件顶层 `const` 对它不可见——数据 inline 进函数体
4. rest 参数读 `Astro.params.slug`,不是 `Astro.props.slug`
5. `src/content/<locale>/` 直放内容触发 legacy 自动收集——必须放 `src/content/wiki/<locale>/`
6. `prefixDefaultLocale: false` 意味着英文站在根路径(`/`),不要做 `/` → `/en/` 重定向

## 工程约束速查

- UI 文案全部走 JSON,组件零硬编码文字
- 主题色只管 `--brand`/`--brand-light` 4 行,组件只引用 `var(--brand)`
- og:image 等社交卡片用绝对路径(`${SITE_URL}/...`)
- 域名走 `SITE_URL` env,必须含 `https://`
- 广告/评论 env 空值 = 组件不渲染(开箱 Lighthouse 4×100 契约)
- UI 不用 emoji,图标用 lucide(`astro-icon` 或 inline SVG)

## 验证三件套(每次改动后)

```bash
pnpm check-config        # 三处一致性
pnpm typecheck           # astro check,0 errors
pnpm build && pnpm check-links   # schema + 构建 + 内链对账
```

改了纯函数(`src/lib/`)加跑 `pnpm test`;改了内容加跑 `pnpm check-content`。

## 深入设计依据

每个模块的「为什么这样设计」在 [docs/PRD.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/PRD.md)(15 章 + 3 附录,单一真相源);贡献级细节(发版流程/SemVer)在[同步与贡献章](/landing/docs/sync-and-contribute)。

> **✅ 验收(全部成立才算完成)**
> - ☐ 能对任意一个改动需求,30 秒内说出它落在哪一层、哪些文件
> - ☐ 理解「三处一致」的两条铁律各覆盖什么
> - ☐ 本地验证三件套全绿

## 下一步

进入[定制章](/landing/docs/customize):加分类、加语言、换主题、改首页——每一步的 SOP 和配套 AI 提示词。
