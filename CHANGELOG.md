# Changelog

All notable changes to AnvilWiki are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.13.1] — 2026-08-17

**建站全景清单 + 全书直达链接:回答「一个游戏站要完成哪些工作」,每个「去哪做」都能点进去。**

### Added
- **文档中心 hub 新增「建站全景清单」**:从零到赚钱的 10 件工作(选游戏 → 装工具 → 建站 → 10 页 → 上线 → Google 登记 → 买域名 → 接广告 → 周保鲜 → 定制),每项带耗时标注,点击直达对应章节——新访客 10 秒看到全部工作量的地图。
- **手册外链补齐(zh+en 同步)**:找新游四来源([itch.io newest](https://itch.io/games/newest) / [Steam 新品](https://store.steampowered.com/explore/new/) / [Roblox Discover](https://www.roblox.com/discover) / YouTube)、竞对站([Fandom](https://www.fandom.com) / [Game8](https://game8.co))、工具链([brew.sh](https://brew.sh) / [pnpm.io](https://pnpm.io) / [Claude Code](https://claude.com/claude-code) / [Codex](https://openai.com/codex) / [Cursor](https://cursor.com))、域名注册商([Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) / [Porkbun](https://porkbun.com))、维护文档(development.md)——全部从纯文本变为可点击直达。

## [1.13.0] — 2026-08-17

**双手册全量重写:按「完全零基础也能跟着走」标准,四专家(科普写作/第一性原理架构/新手测试员/模板守门)定档。旧版实测服务的是「半熟手」,新版服务真正的目标用户。**

### Changed
- **统一七段骨架(9 章)**:①你在哪·解决什么(第一性原理链:赚钱←广告←流量←排名←收录←上线←你的文件←选品,每章开头「已有 X 缺 Y 本章给 Y」)②本章产出清单 ③概念垫底(新术语=一句白话+固定类比,首现定义后文直用)④分步实操(**四段式:做什么/怎么做/你会看到/确认做对了**)⑤卡住了怎么办(症状→原因→修法)⑥验收 ⑦下一步。
- **补最大流失点**:学习手册第 2 章新增「第一幕:出发前装好 6 样东西」——终端怎么打开(Mac/Win)、注册 GitHub、装 Node 22、装 pnpm、装 Git、装 AI 助手,每样带确认点(小白实测:旧版最大劝退环节,装环境从一句话变成完整序幕)。另补:域名购买支线(Cloudflare Registrar/Porkbun)、AdSense 广告位编号从哪来、upstream 月度同步完整三行命令(旧版断链)、GSC 验证的逐步点击路径。
- **小白实测卡点清零式修复**:wrangler.toml 二选一给新手唯一答案(删文件)+进阶折叠;`<你>.pages.dev` 占位符讲清含义;pnpm install/dev/build 全部补「你会看到」;frontmatter/SERP/RPM/搜索意图/Lighthouse 全部首现定义;意图决策表从第 1 章后移第 3 章(读者见到页面再讲页型);删前置噪音(第 2 章 wrangler 预警段、报错 2 三处一致、第 4 章 hreflang 检查、console.log 诊断法→挪开发手册)。
- **固定类比库全书统一**:fork=整店复制蛋糕店(并声明边界:原店新品要 merge 才进来)、部署=书上货架、env=开关面板、build=印刷厂、终端=打字指挥电脑的窗口、三层=一栋三层楼。类比只用于「是什么/为什么」,操作句保持逐字精确。
- **中英 18 章全部重写同源**(2 并行 agent + 事实守恒校验):13 个提示词块数量守恒、验证条款与禁令原义保留、全部数字与限定词(仅上游生效/不含换肤/8 行主题变量/P1 仅 bosses+tier-list/NODE_VERSION 进 [vars]/2-8 周/15-20 篇/≥60 分/双源)逐条 grep 验收存活。

### Fixed
- en 两章 title 超 80 字符(schema 拒收)裁剪;frontmatter 全部双引号转义防 YAML 冒号问题。

## [1.12.1] — 2026-08-17

**CLI 清理完整性修复:landing 专属 showcase 截图此前不在删除清单,fork 仓库会残留 3 张无用图片。**

### Fixed
- `apply-template` 的 `LANDING_PATHS` 补上 `public/images/showcase/`(demo-article/home/mobile 三张截图,仅 landing Showcase 组件引用)——此前只删 `wechat-qr.jpg`,fork 的 `public/` 与 `dist/` 会残留这 3 张图。CLI 头部注释/汇总文案同步,组件计数注释修正(13)。
- **全量 fork 模拟验证零残留**:按最终清单删除全部 8 个路径 + 翻转 `landingLinkEnabled` 后 `pnpm build` 绿;dist 无 landing 路由、无 showcase/wechat 图,llms.txt / sitemap / robots 均零 landing 痕迹。幸存文件中的 landing 引用全部为 flag 门控(SiteHeader / llms.txt)或有意保留(`docs/handbook` 手册源 + `lib/handbook.ts` 纯函数,fork 可直接复用提示词 SOP)。dry-run 计数 23 文件,与清单逐项吻合。

## [1.12.0] — 2026-08-17

**手册章节页三栏布局:左侧手册目录树 + 右侧本页内容目录(scrollspy)。**

### Added
- **左侧手册目录树**(新组件 `HandbookNav.astro`):两本手册全部章节按序分组列出,当前章高亮(`aria-current="page"`),顶部回文档中心;xlarge 屏吸顶,以下折叠为 `<details>`。纯 HTML/CSS 零 JS。
- **右侧本页内容目录**:复用 wiki 的 `TableOfContents`(H2/H3 锚点 + IntersectionObserver scrollspy 跟随高亮);组件新增 `desktopAt` prop(`lg` 默认 wiki 不变 / `xl` 手册三栏用),以下屏折叠为 `<details>` 置于 TL;DR 卡之后。
- 章节页网格 `xl:grid-cols-[13rem_minmax(0,48rem)_13.5rem]`,中列正文 max-w-3xl;`landing.ts` 新增 `onThisPageLabel`/`manualsLabel` 中英文案。

## [1.11.2] — 2026-08-17

**Landing 导航栏手册入口:头部新增「学习手册 / 开发手册」链接,锚定文档中心对应手册区块。**

### Added
- LandingLayout 头部新增两个导航项(Learning Manual / Development Manual,图标 lucide:graduation-cap / wrench,移动端隐藏与 GitHub/Demo 同策略),链接按当前语言指向 `/landing/docs#learn|dev` 或 `/zh/landing/docs#learn|dev`;对全部 landing 族页面(官网/文档 hub/章节页)生效。
- HandbookHub 手册区块加 `id="learn"` / `id="dev"` + `scroll-mt-20`(锚点定位不被吸顶头部遮挡)。

## [1.11.1] — 2026-08-16

**手册文档专家审查修订版:9 项事实校正(P0×2 + P1×4 + P2×3),中英双语 + 3 份关联文档同步。**

### Fixed
- **[P0] fork 保鲜工作流误导**:monetize 章原称"仓库已配每周自动开 issue 的 freshness 工作流"——实际 `content-pipeline.yml` 带 `if: github.repository == 'PNGTRID/AnvilWiki'`,fork 永远收不到 issue。改为:fork 每周本地跑 `pnpm refresh-audit`(并说明删 `if` 可开启),周 SOP 重排为三步。
- **[P0] Initialize AnvilWiki workflow 范围夸大**:launch/integrations 章原称与 apply-template CLI"等价"——实际 workflow 只做收尾清理(wrangler vars/删 landing/清 demo),不含游戏名/主题色/语言。改为如实描述。
- **[P1] 主题色"4 行"错误(连带 3 处文档陈旧)**:v1.9 引入 `--brand-text` 派生后实际是 8 行(`--brand`/`--brand-light`/`--brand-h`/`--brand-s` × 亮/暗);手册 3 处 + **AGENTS.md 约束 #2 + docs/apply-template.md + docs/migration-from-nextjs.md ×3 处**全部改正——只改 4 行会留下旧色相文字色。
- **[P1] zh 章节内链语言断裂**:10 处站内链接写死 `/landing/docs/…`(英文路由),中文读者点击静默切英文;统一加 `/zh` 前缀。
- **[P1] refresh-audit P1 语义不准**:P1 仅覆盖 bosses/tier-list 两类文章超 90 天(其他分类不产生 P1),非"分类 90 天无新文"。
- **[P1] NODE_VERSION 与方案 B 矛盾**:保留 wrangler.toml 时 dashboard 的 NODE_VERSION 被忽略——补充方案 B 需把 `NODE_VERSION = "22"` 写进 `[vars]`。
- **[P2] SEO 体检提示词 SITE_URL 位置**(site.ts → wrangler.toml/.env)、**CLI 提示表补 Release date 行**、**CI 门禁枚举补全**(八道:lint/typecheck/test/check-config/build/check-content/check-links/check-i18n)。

## [1.11.0] — 2026-08-16

**站内文档中心版:`/landing/docs` + `/zh/landing/docs`——学习/开发双手册(9 章 × 中英),每步 SOP + 可复制 AI 提示词,四专家(游戏wiki站/SEO/自动化/模板架构)讨论定档。**

### Added
- **站内文档中心**(`HandbookHub` + `HandbookChapter` 组件,4 条路由):手册源码 `docs/handbook/{en,zh}/*.md` 单一真相源(GitHub 可浏览 + 站内渲染);**fork 用户保留手册**(学习手册的提示词 SOP 对站长有直接价值),apply-template CLI 只删 landing 路由——删除清单实测 19 文件,fork 模拟(删 landing 全套后)`pnpm build` 仍绿。
- **学习手册 5 章**:选品四层漏斗(含 P01 选品分析/P02 首日规划提示词)→ 半小时建站(CLI 逐项填法+三类新手报错)→ 首日 10 页 AI 产页(P03 攻略/P04 codes/P06 tier list + 逐篇验收三件套 + 7 条反模式)→ 部署与首次收录(wrangler.toml 二选一 + GSC/sitemap/请求收录 SOP)→ 变现与周运营(AdSense 前置清单 + P05 codes 更新/P08 巡检/P11 SEO 体检 + 每周 30 分钟节奏)。
- **开发手册 4 章**:三层架构与改动决策树(Astro 5 六坑)→ 定制 SOP(加分类/加语言/主题/首页,含 P07 翻译/P09 文案/P10 新语言提示词)→ 集成与工程(env 门控全表 + CI 三工作流 + 安全基线)→ 同步上游与贡献回流(merge 策略 + SemVer 承诺 + 发版流程)。
- `handbook` content collection(Zod schema:title/description/manual/order/icon/tldr/updated)+ `src/lib/handbook.ts` 纯函数(parseHandbookId/sortChapters/prevNext/handbookPath)+ `tests/handbook.test.ts`(**中英 1:1 parity 硬门禁**:slug 镜像、manual/order 孪生、字段齐全、order 唯一)。
- 文档页 SEO:任务式 H2 + TL;DR 卡 + BreadcrumbList/TechArticle JSON-LD + en/zh hreflang 成对真实 + sitemap lastmod(astro.config 扫描 `updated` 字段)+ llms.txt 新增 Handbook 段(`landingLinkEnabled` 门控,fork 站零污染)。
- LandingLayout 支持 `pageTitle`/`pageDescription`/`togglePath`/`extraJsonLd`;语言切换器在文档页内互切;自动跳转脚本收窄到 landing 根路径(不再把读者从章节页弹走)。DocsEntry 3 卡改站内链接,DevGuide「全部文档」入口改指 /landing/docs。

### Fixed
- en 手册 frontmatter 的 ASCII 冒号破坏 YAML 解析(plain scalar 含 `: `)——18 文件统一 JSON 双引号转义;tldr 上限 300→480 字符(en 译文天然更长)。
- DocsEntry 4 卡网格在 3 列下 3+1 孤行换行(v1.10.0 已修,此处确认保持)。

## [1.10.0] — 2026-08-16

**官网开发指南版：landing 新增「怎么用」5 步上手板块——此前只有 4 张文档卡，缺一条"从头到尾怎么走"的向导。**

### Added
- **Landing「怎么用」5 步开发指南板块**（`/landing` + `/zh/landing`，位于 DocsEntry 与 Community 之间）：fork 本地跑 → `pnpm apply-template` → 与 AI 对话产页 → 免费部署 → 保持新鲜。每步附可直接照抄的命令（含对话式产页示例 prompt）与对应文档链接，板块底部链接文档中心（`docs/README.md` 四条阅读路径：建站 / 写作 / AI Agent / 贡献者）。新组件 `DevGuide.astro` + `LandingContent.devGuide` 类型与中英文案。
- DocsEntry 卡片网格修正：`sm:grid-cols-3` → `sm:grid-cols-2 lg:grid-cols-4`（4 张卡在 3 列网格会 3+1 孤行换行），陈旧注释（"3 cards"）同步修正。

### Changed
- `apply-template` CLI 删除范围确认覆盖新板块：CLI 本就整目录删除 `src/components/landing/`（现为 10 组件）+ `src/config/landing.ts`（含 devGuide 文案）+ 两个 landing 页面；注释计数同步（8 → 10）。dry-run 实测「Removed 15 project landing page files」，fork 用户套用模板后仓库零 landing 残留。

## [1.9.0] — 2026-08-16

**专家团全面审计修复版：5 视角深挖（运行时/配置 CI/SEO i18n/安全 a11y/文档 DX），P0×5 + P1×10 + P2×30 全部清零。**

### Fixed (P0)
- **5 个日文 legal 页 soft-404**：`[locale]/[legal].astro` 误从 `Astro.props` 读路由参数（AGENTS.md gotcha #4 原样违例），全部页面渲染成 HTTP 200 的 "Not Found" 空壳并被 sitemap/hreflang/footer 收录——改读 `Astro.params`。`check-links` 新增 soft-404 断言防止复发（状态码检查看不见这类问题）。
- **JSON-LD 注入面关闭**：`JsonLd.astro` 的 `JSON.stringify` 不转义 `<`，frontmatter 含 `</script>` 即可逃逸 script 标签（社区 PR 工作流下的存储型 XSS 面）——序列化后统一 `\u003c` 转义。
- **`pnpm apply-template` 产物缺 `ogImageWidth/ogImageHeight`**：fork 用户 typecheck 必挂 + 线上 `content="undefined"`——重写模板补齐两个必填字段。
- **README 快速开始克隆 URL 指向上游仓库**（中英两处）：fork 用户按字面走完 push 必被拒——改为占位符 `<你的用户名>`。
- **环境变量三表矛盾**：实际消费 15 个 env，`wrangler.toml [vars]` 只有 9 个（AdSense×4/GA/GSC 连注释占位都没有）、`setup.yml` 重置块同样、deployment.md 只列 8 个——三处对齐；保留 wrangler.toml 的 fork 现在有处可填广告变量（此前按文档去 dashboard 配置会被静默忽略）。

### Fixed (fork 扩展性 / 跨平台)
- 语言切换器硬编码 `/^\/(ja)(\/|$)/` 剥前缀——新增语言后切换器全部产出 404/假链接，改为从 `locales` 动态构建（与 BaseLayout 同模式）。
- 文章页 hreflang 用全量 `locales`——ja-only 文章会产出指向 404 的 `hreflang="en"`/x-default；改用 `localesForEntry()`（原为死导出）∪ 当前 locale，x-default 由 BaseLayout 从 alternates 推导（不存在死链）。语言切换器同步受 `availableLocales` 约束。
- `check-links.ts` 在 Windows 上全站内链误报（`path.relative` 反斜杠未归一化）；`check-content.ts` 对 CRLF 检出不健壮（frontmatter 定界符精确匹配）——归一化 + 新增根级 `.gitattributes`（`* text=auto eol=lf`）根治。
- sitemap lastmod 对非 ASCII slug 因 percent-encoding 静默失配——`decodeURIComponent` 归一化。
- `check-i18n` 以 `locales[0]` 充当默认语言——改为 regex 读取真实的 `defaultLocale`。

### Fixed (SEO / 结构化数据)
- sitemap 不过滤 `noindex` 文章（rss/llms.txt 都过滤了）——`filter` 选项补上。
- `rss.xml.ts` 硬编码回退域名违反约束 #9——改用 `siteUrl`。
- 空列表页输出 `itemListElement: []` 的非法 ItemList——仅在有条目时注入。
- og:image:width/height 恒 1200×630 与真实封面（800×450）不符——文章页传真实尺寸，未知时省略（错误的尺寸比没有更糟）。
- 回退页 `<html lang="ja">` 包英文正文——`contentLocale`（servedLocale）修正 lang/og:locale；og:locale 格式改为 `en_US`/`ja_JP`（OG 规范）。
- 新增 `og:locale:alternate`、`article:published_time`/`modified_time`。
- `codes[].source` 定义于 schema 却从不渲染——Active label 与 Expired 表格补 Source 列（E-E-A-T 信号不再被静默丢弃）。
- 面包屑 Home 硬编码 `href="/"`（5 个组件）→ `homeUrl(locale)`；BreadcrumbList JSON-LD 的 `name: 'Home'` → 本地化 `nav.home`。
- 日期展示固定 `timeZone: 'UTC'`（schema 的 `z.coerce.date()` 把日期解析为 UTC 零点，负偏移时区本地构建会"早一天"）。
- gallery 图片 JSON-LD 用 `caption` 当 name——优先作者写的 `alt`。
- landing 自动跳转对爬虫渲染器关闸（bot UA guard），保留中文浏览器自动跳转的 UX。

### Fixed (a11y / 前端)
- **skip-to-content 链接**（WCAG 2.4.1 A 级此前失败）——`#main` + sr-only 焦点样式，文案走 locale JSON。
- **亮色模式品牌色文本对比度 3.1:1 → 4.8:1**：新增派生变量 `--brand-text`（从 `--brand-h/--brand-s` 计算，fork 只改 `--brand` 两个主变量仍然生效），`nav.DEFAULT`/TOC 激活态/搜索高亮全部切到文本安全色；StepByStep 步骤徽章白字改 `text-background`（暗色模式同步达标）。
- 硬编码英文 UI 文案全部 i18n 化（en/ja 双语 key）：CodeBlock "Tap to copy"、ExploreModules "View all"、QuickStart "Open"、LazyYouTube 播放标签（顺带去掉 `▶` emoji 字形，与 lucide 图标一致）、StickyBanner/ThemeToggle/TableOfContents aria-label、footer "Community/Legal"、回退页 "English fallback" 徽章、快速答案复制/有用反馈按钮的 aria/title、面包屑与上下篇导航 aria；补上被引用却不存在的 `nav.language` key。
- LazyYouTube 降级链接的 Enter 被 keydown `preventDefault` 吞掉（键盘用户在缩略图挂掉时无法打开 YouTube）——放行 fallback 链接自身。
- StickyBanner localStorage 未包 try/catch（存储被禁的访客抛未捕获异常，与其他脚本模式不一致）。
- theme-color meta 值 `hsl(var(--brand))` 永不解析——改为运行时从计算样式注入 + 主题切换时跟随（MutationObserver）。
- `/contact` 双 H1 → h2。
- CJK 阅读时长判定从 `locale === 'ja'` 放宽为 `['ja','zh','ko']`。

### Changed (CI / 工程化)
- CI 补跑自家门禁 `check-config` + `check-content`；加 `permissions: contents: read` 与 `timeout-minutes`；`setup.yml` 幂等化（`checkout -B` + `--force-with-lease` + 空 commit/已存在 PR 跳过）；`content-pipeline.yml` 去掉重复 audit 执行、失败不再吞掉建空 issue。
- **测试 34 → 51**：`parseEntryId`/`isPossiblyOutdated`/`STALE_*` 下沉到 `lib/content-utils.ts`（原在 `astro:content` 依赖模块内，vitest 无法加载）；补 `slugifyTag` CJK/纯符号分支、`absoluteUrl`、`languageAlternates`（含"never emits x-default"契约）测试。
- 移除零引用的 playwright devDependency。
- 隐私声明补 giscus / YouTube / Cloudflare Web Analytics 条目；cookie 同意横幅链接到隐私政策（ePrivacy 知情同意最佳实践）。
- vitest 路径别名改用 `fileURLToPath`（中文路径下 `.pathname` 会 percent-encode 导致 `~/lib/*` 解析失败——真实项目 dogfooding 发现）。

### Docs
- PRD Node 20 → 22（两处）；AGENTS.md 版本状态行、组件词汇表补 StatBar、命令表提 pagefind postbuild；deployment.md 期望页数改为不写死数字、curl 示例去尾斜杠、新增 CSP 配置 FAQ；CHANGELOG 补 1.8.1/1.8.2 compare 链接；apply-template.md navigation 示例补必填字段 `isContentType`、home 模块数 4→6；Giscus 口径统一"4 必填 + 1 可选"；anvil-update-codes 技能措辞对齐 frontmatter 时代；seo.md "v1.5–v1.8 资产"章节移到"下一步"之前；3 处注释从 legacy 路径 `src/content/<locale>/` 更正为 `src/content/wiki/<locale>/`。

## [1.8.2] — 2026-08-15

### Fixed
- **Lighthouse a11y 100 restored** (regression introduced by v1.5–v1.8 components, caught by a full re-test): small brand-orange text on tinted backgrounds (gameVersion badge, Quick Answer label, BossStatCard labels, codes table headers, article tag chips) now uses foreground color while keeping brand icons/borders; CodeBlock copy button's accessible name no longer mismatches its visible text.
- **`pnpm check-config` deployment domain gate**: errors when the effective SITE_URL host (env > wrangler.toml) ≠ `site.ts` domain — the wrangler.toml trap that caught the first real fork user is now machine-blocked.
- LandingLayout unused-catch lint warning cleared (lint fully clean).

### Fixed (v1.8.1)
- **Inline video placement** (from real-project dogfooding): new `<Video id title>` MDX component renders a YouTube player wherever the author places it in the body; the frontmatter `videos` array becomes the structured-data registry (VideoObject JSON-LD) + bottom fallback, with inline IDs auto-deduped from the fallback. Player core extracted to a shared `LazyYouTube` (event-delegation script — no more per-instance duplication; keyboard accessible; broken-thumbnail fallback to a plain link where i.ytimg.com is unreachable, e.g. mainland China).
- Article layout: bottom video section moved up to right after the body; Comments moved to the very end (body → videos → gallery → tags → related → prev/next → feedback → comments → sponsor).
- i18n: "On this page" (TOC) and "Quick Answer" hardcoded English now read from locale JSON (en/ja).

## [1.8.0] — 2026-08-15

**AnvilWiki v1.8 — AI 原生内容生产 + 新鲜度管道:第一性原理路线落地(技能分发、codes 数据结构、定时审计、选品工作流)。**

### Added
- **`.agent/skills/` ships with the template** (Agent Skills open standard — Claude Code / ZCode / Codex / Cursor auto-discover): `anvil-new-article` (any source material → build-passing MDX), `anvil-update-codes` (apply new/expired codes incl. multilingual sync), `anvil-refresh` (freshness audit report). Plus a "Conversational Content Authoring" section in AGENTS.md as the zero-install fallback — fork users generate pages by just talking to their AI tool, scripts become the verification backend (`check-content` + `build`).
- **Structured `codes` frontmatter**: `{code, reward, status, expiryDate, source}` array → auto-rendered CodesTable (Active section with one-click-copy CodeBlocks + freshness labels; Expired table kept for long-tail "is X still working" queries) + localized 4-question FAQPage JSON-LD. Demo codes articles (en/ja) migrated.
- **`pnpm refresh-audit`**: deterministic freshness engine (codes pages unverified >7d = P0, stale categories >90d = P1) — markdown report, no LLM, no mutations.
- **`content-pipeline.yml`**: weekly cron workflow that runs the audit and files a tracking issue. Never mutates content — fixing stays human/AI-gated.
- **`docs/game-selection.md`**: the fork-user funnel the template was missing — game selection (4-layer scoring incl. Trends demand validation + SERP gap check + two-source rule), then "first-day 10 pages" (codes → beginner guide → bosses → tier list) to compress the 2-8 week golden window.

## [1.7.0] — 2026-08-15

**AnvilWiki v1.7 — 内容表达力二期 + E-E-A-T:画廊、作者体系、联盟链接与内容 lint。**

### Added
- **Image gallery + lightbox**: `gallery` frontmatter (image/caption/alt) renders a thumbnail grid below the article body with a native `<dialog>` lightbox (prev/next/ESC/backdrop close). Each image emits ImageObject JSON-LD (Google Images eligibility). Thumbnails via Astro Image (WebP/srcset).
- **Author system**: `src/config/authors.ts` registry — registered authors link out from the article byline and upgrade Article JSON-LD author from Organization to **Person** (with `sameAs` knowledge-graph signal). Bare `author:` names keep working unchanged.
- **`<AffiliateLink>` MDX component**: affiliate/outbound CTA card with `rel="sponsored nofollow noopener"` baked in — an SEO-compliant second monetization channel (Steam links, game passes). Zero JS, no env gating (it's content, not infrastructure).
- **`pnpm check-content`**: content lint — no H1 in body, heading level skips, images without alt text, internal links with trailing slashes. Exits 1, CI-ready.

### Changed
- Demo: Stormcaller article now carries a gallery + named author; beginner guide demonstrates `<AffiliateLink>`; fixed a duplicate "What to Do Next" link.

## [1.6.0] — 2026-08-15

**AnvilWiki v1.6 — 创作者维护工具 + 部署自动化:翻译覆盖率、内链审计、一键初始化 workflow。**

### Added
- **`pnpm check-i18n`**: translation coverage report — missing articles & UI keys per locale vs English (`--strict` to gate CI). Wired into CI as a report step.
- **`pnpm check-links`**: internal-link audit over the built `dist/` — catches renamed-slug body links, homepage JSON links to unwritten articles, and locale links to pages that don't exist. Exits 1 on any broken link; wired into CI.
- **"Initialize AnvilWiki" workflow** (`.github/workflows/setup.yml`): fork → Actions → Run once with your domain — resets `wrangler.toml [vars]`, removes the project landing page, opens a review PR.
- **Cloudflare Web Analytics** env gating (`PUBLIC_CF_BEACON_TOKEN`): cookieless beacon, injected directly (no consent gate), empty = zero JS.
- **`docs/staying-up-to-date.md`**: how to merge upstream after forking (three-layer merge matrix), SemVer compatibility promises, post-sync checklist.
- **apply-template content scaffolding**: after clearing demo content, one schema-valid starter article is generated per chosen category.
- **README growth pack**: AnvilWiki vs Fandom vs DIY comparison table, suggested repo topics, and a "built a site? add it to the Showcase" PR invitation.

### Fixed
- Article tag links on English-fallback pages now point at the served locale's tag pages (was: requested locale → 404).
- Tag pages: hreflang alternates and the language switcher only offer locales where the tag actually exists (tag pages don't fall back).
- Demo content dead links: `/guides/fastest-leveling`, `/updates`, `/guides/video-walkthroughs` (caught by the new check-links on its first run).

## [1.5.0] — 2026-08-15

**AnvilWiki v1.5 — 内链 + 时效性 + 表达力:标签系统、版本号、最近更新页、MDX 组件与草稿流。**

### Added
- **Tag system landing pages**: `/tags` (per-locale cloud) + `/tags/<tag>` aggregation pages; article-page tags are now clickable links; tag pages carry ItemList + Breadcrumb JSON-LD and land in the sitemap with hreflang. No English fallback (list accuracy rule).
- **`gameVersion` frontmatter**: optional badge on the article header ("applies to v2.5") — freshness / E-E-A-T signal for fast-patching games. Demo articles tagged.
- **`/recent` page** (all locales): full recently-updated listing, feeding "patch notes"-style queries; pairs with sitemap lastmod.
- **`Callout` MDX component** (`~/components/mdx/Callout.astro`): info/tip/warn/danger callout boxes, zero JS.
- **`Accordion` MDX component** (`~/components/mdx/Accordion.astro`): native `<details>` collapsible panels, zero JS.
- **Draft mechanism**: `draft: true` frontmatter — visible in `pnpm dev`, fully excluded from production build (pages, lists, recent, related, hreflang, sitemap). `pnpm new-post` asks.
- **VideoObject JSON-LD**: one per `videos` frontmatter entry — Google Video search eligibility.
- **404 page recovery**: Pagefind search trigger + category entry points instead of a bare "back home".
- **Sponsor card (env-gated)**: `PUBLIC_SPONSOR_URL` / `PUBLIC_SPONSOR_IMAGE_URL` — empty = renders nothing (same contract as AdSense/Giscus). Plus `.github/FUNDING.yml`.
- **README fork warning**: wrangler.toml sole-source-of-truth warning surfaced next to the deploy button; `apply-template` also resets the new sponsor vars.

## [1.4.0] — 2026-08-15

**AnvilWiki v1.4 — 官网国际化版:中文官网 + 微信交流群 + demo 双向入口。**

### Added
- **Chinese landing page (`/zh/landing`)**: full bilingual landing — every section localized (hero, features, comparison table, showcase, docs, CTA), EN ↔ 中文 toggle, hreflang alternates (x-default → English). The landing speaks for the PROJECT, so it ships its own en/zh pair independent of the demo game's en/ja content locales.
- **Locale auto-detection**: visiting `/landing` with a Chinese browser language auto-redirects to `/zh/landing` (client-side, pre-render, zero runtime cost). Manual toggles are remembered in localStorage and always win.
- **WeChat community group**: QR-code card on both landing pages + README (Chinese & English sections) — "scan to add the maintainer and join the discussion group". Image optimized 952×1374 PNG → 480×693 JPG (44 KB).
- **Demo → landing entry**: hammer icon in the demo site header (desktop) + "AnvilWiki Template" link in the mobile menu, gated by `landingLinkEnabled` in `src/config/project.ts` — `apply-template` flips the flag when it removes the landing pages, so the entry never dead-links.
- **Maintainer attribution**: footer on both landing pages and README — 由 PNG 部落团队主理人 袁锐钦 开源 / "Open-sourced by 袁锐钦 (Yuan Ruiqin), lead of the PNGTRIBE team".

### Changed
- Landing announcement bar is now driven by a `PROJECT_VERSION` constant (kept in sync with package.json) — no more stale hand-written version strings.

## [1.3.0] — 2026-08-15

**AnvilWiki v1.3 — 审计清零版:未完成清单全部落地(codes 范式 + 阅读体验全家桶 + fork 工具链)。**

The final batch of the 2026-08 expert-audit backlog: a complete codes-content paradigm (the #1 traffic entry for game wikis), a full reading-experience suite, and fork-user tooling (locale scaffolding, homepage presets, schema validation).

### Added
- **Codes content paradigm**: `CodeBlock.astro` one-tap copy component + a complete demo codes article (en/ja) — 5 copyable codes, expiry table, "how to redeem" question-style H2s. Codes pages are the highest-traffic wiki entry; the template now ships a reference implementation.
- **Stale-content notice**: articles in time-sensitive categories (bosses / tier-list) older than 90 days automatically show a "possibly outdated" banner (pure `isPossiblyOutdated()` function).
- **Reading-experience suite on articles**: prev/next navigation within a category, reading-time estimate (CJK-adapted), top-edge reading progress bar, Quick Answer copy button, "was this helpful?" feedback, related lazy-loaded videos (`videos` frontmatter, YouTube IDs), print stylesheet (`@media print` strips chrome/ads), and drop-rate `StatBar` visualization component (used in the demo boss guide).
- **AMOLED black theme**: theme toggle now cycles light → dark → pure-black (`html.dark.black`, battery-saving surfaces for OLED phones), persisted + no-FOUC.
- **`pnpm new-locale`**: scaffolds a new language end-to-end (routing.ts + ui.ts + locale JSON clone + content dir) — the 4-place sync that was error-prone by hand.
- **Homepage presets in `apply-template`**: codes-focused / guides-focused / keep-demo skeletons generated from your game name and categories, instead of hand-editing a 270-line demo JSON.
- **`docs/home.schema.json`**: JSON Schema for the locale `home` namespace (displayType enum enforced); `$schema` refs wired into en/ja JSON for VS Code validation.
- **Landing page**: real demo screenshots (desktop home, boss article, mobile) replace skeleton placeholders; announcement bar; "Deploy to Cloudflare" button and `/landing` badge in README.
- **Mobile search entry**: prominent Search item at the top of the mobile menu (readers don't know Cmd+K).
- **i18n smoke tests**: 6 regression tests guarding against hardcoded-locale arrays in routes (the v1.1.0 bug class).

### Changed
- **README repositioned**: tagline and feature list now lead with "100% ad revenue yours"; feature list rebuilt to cover all shipped capabilities.
- **`apply-template` theme rewrite is line-based**: replaces only the 6 `--brand*` variable lines (tolerates custom vars/indentation in globals.css — the old whole-block regex silently broke on user edits).
- **`apply-template` resets `wrangler.toml [vars]`**: forks no longer risk shipping the demo site's Giscus config (SITE_URL set to their domain, Giscus values blanked).
- `new-post` scaffold now guides AI-Overview-friendly writing (question-shaped H2s, 40–60-word direct answers, summary field).
- `organizationJsonLd` emits `sameAs` (configurable in site.ts) for knowledge-graph entity association.
- docs/seo.md gains an "AI search era" chapter (what's built-in + 5 writing rules); content-format.md documents all frontmatter fields and the MDX components (`CodeBlock` / `StatBar`) + patch-notes paradigm.

### Fixed
- `migration-from-nextjs.md` now carries an honesty disclaimer (estimates not battle-tested).

## [1.2.0] — 2026-08-15

**AnvilWiki v1.2 — 专家团审计落地版:项目官网 + 阅读体验 + AI 搜索卡位 + 隐私合规。**

This release lands the findings of a 4-expert audit (SEO/growth · developer experience · reader UX · competitive analysis): a project landing page, wiki-grade reading infrastructure (scrollspy, boss data cards, mobile fixes), AI-search visibility (llms.txt, RSS), and consent-gated analytics.

### Added
- **Project landing page (`/landing`)**: 7-section marketing page introducing the AnvilWiki template itself (Hero with "100% ad revenue" positioning · Lighthouse proof bar · feature grid · comparison table vs Fandom/Starlight/DIY · showcase · docs entry · final CTA). Self-contained in `src/components/landing/` + `src/config/landing.ts`. `apply-template` CLI removes it automatically for fork users (`--keep-landing` to keep).
- **RSS feed (`/rss.xml`)**: default-locale articles, newest first, capped at 50, excludes `noindex`. `<link rel="alternate">` auto-discovery in `BaseLayout`. Uses the already-installed `@astrojs/rss`.
- **llms.txt (`/llms.txt`)**: Markdown site index for AI crawlers (ChatGPT/Perplexity/Claude), generated at build time from the content collection.
- **TOC scrollspy**: the in-view section's TOC link is highlighted while scrolling (pure IntersectionObserver, zero framework runtime).
- **Share button on articles**: native `navigator.share` sheet with clipboard fallback; labels via locale JSON (en/ja).
- **Back-to-top button**: appears after 600px of scroll on article pages.
- **Boss stat card**: optional structured `boss` frontmatter object (hp / weakness / resistant / location / recommendedLevel) rendered as a scannable data card above the article body (`BossStatCard.astro`). Demo boss guides filled in (en + ja).
- **`pnpm check-config`**: cross-validates nav-key / locale / displayType three-place consistency (AGENTS.md rules #4–#5) that `pnpm build` does not enforce.
- **Cookie consent (consent-gated tracking)**: GA / AdSense are no longer injected statically — they load only after the visitor accepts. Choice persists in localStorage; declining means trackers never load. Banner only renders when tracking env vars are set (zero-JS contract unchanged).
- Related-articles cards now show the description (line-clamp-2).

### Changed
- **Ads system rebuilt as Google AdSense-only**. Removed the iframe isolation ad setup (`public/ads/*.html`, `AdBanner.astro`, 7 `PUBLIC_AD_*` env vars) in favor of a streamlined AdSense integration. Ads now use 3 positions (Sticky / Sidebar / InContent), each an `<AdSenseSlot position="...">` component gated on `PUBLIC_ADSENSE_CLIENT` + one slot ID env var. The Sticky banner keeps its dismiss button + localStorage logic. Empty env = no ads rendered (Lighthouse 4×100 contract preserved). See PRD §10 for details.
- **Sticky banner is desktop-only by default** (`hidden md:block`): a 320×50 strip under the header permanently eats ~16% of a phone's first screen — a proven bounce driver. Remove the class to re-enable mobile.
- **sitemap `<lastmod>` injection**: article/list URLs now carry `lastModified ?? date` from frontmatter (the only sitemap field Google trusts for crawl scheduling).
- **Static asset caching**: `/_astro/*` served with `Cache-Control: public, max-age=31536000, immutable`.
- Mobile menu now includes the language switcher (was navigation-only — non-English readers couldn't switch on phones).

### Fixed
- **Third-locale forks fully 404**: five `getStaticPaths` implementations hardcoded `['ja']` while the CLI accepts any locale list — adding a 3rd language killed every route. All now derive from the `locales` array in `routing.ts`.
- **SearchAction pointed at a nonexistent `/search` route** (Pagefind is a client-side modal) — removed from `websiteJsonLd()`.
- **`noindex` frontmatter was never wired up** — now emits `<meta name="robots" content="noindex, nofollow">` via `BaseLayout`.
- **Cover-image docs contradicted the schema**: docs said "path under `/public`", but the Zod `image()` helper expects a path relative to the MDX (Astro Image pipeline). Docs unified.
- **Node version docs said 20** — pnpm 11 requires ≥22.13. CONTRIBUTING.md / deployment.md now say 22.
- **RSS links 404'd**: `@astrojs/rss` appends a trailing slash to relative links, but this site uses `trailingSlash: 'never'` — now passed absolute URLs.
- **GFM tables overflowed on mobile**: `.prose table` is now a scrollable block site-wide.

### Removed
- `public/ads/` directory (6 standalone ad HTML files) and `src/components/ads/AdBanner.astro` (iframe wrapper component).
- 7 `PUBLIC_AD_*` env vars (`PUBLIC_AD_MOBILE_320X50`, `PUBLIC_AD_SIDEBAR_160X300/600`, `PUBLIC_AD_BANNER_300X250/728X90/468X60`, `PUBLIC_AD_NATIVE_BANNER`).

## [1.1.0] — 2026-08-14

**AnvilWiki v1.1 — SEO & E-E-A-T 增强版。**

This release adds AI-Overview-oriented SEO features (TOC, Quick Answer, author byline, VideoGame JSON-LD) and broadens ad support (Google AdSense alongside the iframe ad isolation). Includes a round of naming normalization to keep config/locales schema generic (no demo-game-specific terms).

### Added
- **Article TOC**: Auto-generated table of contents from H2/H3 headings. Sticky on desktop, collapsible `<details>` on mobile (`TableOfContents.astro`).
- **Quick Answer summary block**: Optional `summary` frontmatter field rendered as a callout above the article body — optimized for AI Overviews and featured snippets.
- **Article author byline**: Optional `author` frontmatter field (falls back to `site.defaultAuthor`). E-E-A-T signal.
- **VideoGame JSON-LD**: Injected on the homepage for game entity recognition (`videoGameJsonLd()` in `seo.ts`).
- **Contact page**: New legal page at `/contact` with community links. E-E-A-T trust signal.
- **Google AdSense support**: `AdSenseSlot.astro` component + `PUBLIC_ADSENSE_CLIENT` env var. Coexists with the iframe ad isolation setup.

### Changed
- Homepage `displayType` enum renamed to generic names (`code-cards`→`badge-list`, etc.).
- CSS theme variable renamed: `--nav-theme` → `--brand`.
- Homepage JSON field names renamed (`eyebrow`→`badge`, `primaryCta`→`ctaPrimary`, etc.).
- Demo boss renamed: `gelum`→`emberfang`, `pyra`→`stormcaller`.
- `skinning.md` → `apply-template.md` (restructured as file-organized config reference).
- Ad HTML templates: ad network domain changed to placeholder.
- SEO docs: all knowledge claims cite public authoritative sources.

## [1.0.0] — 2026-08-13

**AnvilWiki v1.0 — 正式发布 / First stable release.**

This release covers everything since v0.2.0: the full PRD roadmap (v1.1–v2.0) is now ✅, the demo site ships Lighthouse 4×100, and optional features (search, ads, comments, image optimization, apply-template CLI) are all production-ready.

### Added
- **Comments system (Giscus, opt-in)**: `Comments.astro` component, env-gated (default off = zero JS, preserves Lighthouse 4×100). Official `<script async data-loading="lazy">` + dual MutationObserver dark-mode sync via postMessage. pathname mapping → different locales get independent threads. `data-lang` follows page locale. See `docs/comments.md`.
- Image `decoding="async"` + explicit `width`/`height` to prevent CLS (ListPage covers, VideoSection thumbnails)
- FAQ accessibility: `aria-expanded` sync on toggle + `data-faq-group` container
- WikiSidebar now visible on tablet (md breakpoint, was lg-only)
- Migration cost breakdown in `docs/migration-from-nextjs.md` (2-hour estimate per site)

### Changed
- PRD status updated: "设计中 · 待 review" → "已实现"
- PRD §14.2: v1.1 (frontmatter migration guide) marked as done
- PRD §14.2: v1.4 (Giscus comments) marked as done — `Comments.astro` env-gated, default off
- AGENTS.md: Hard Rule 9 now requires `SITE_URL` to include `https://` protocol (bare domain fails Astro build with `Invalid url`)
- AGENTS.md: added Hard Rule 11 (comments env-empty = null render contract)
- AGENTS.md: added Hard Rule 12 (`wrangler.toml` 接管 Cloudflare Pages env — dashboard env vars ignored when this file exists)
- Demo `home.hero.videoId` cleared (was placeholder)

### Fixed
- **Cloudflare Pages env injection**: `wrangler.toml` was missing the `[vars]` section, so the build process received ZERO env vars (including `SITE_URL` and all `PUBLIC_GISCUS_*`). Root cause: when `wrangler.toml` exists for a Pages project, it becomes the sole source of truth and the dashboard's "Environment variables" UI is ignored ([Cloudflare docs](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)). Fix: declare all build-time env vars in `[vars]`. This bug was previously masked because `process.env.SITE_URL || 'https://...'` fallback in `astro.config.ts` covered for the missing env.
- **`SITE_URL` protocol requirement**: now enforced — bare domain `anvilwiki.pages.dev` fails Astro build with `Invalid url`. `.env.example` was already correct (`https://...`), but the Cloudflare dashboard config had a bare domain. Documented in AGENTS.md Hard Rule 9 + `docs/deployment.md`.

## [0.2.0] — 2026-08-12

### Added
- `scripts/check-sitemap.ts` — verifies every sitemap URL returns 200
- `scripts/new-post.ts` — interactive MDX article scaffold
- `docs/content-format.md` — frontmatter format spec + migration guide from JS metadata format
- ESLint flat config (`eslint.config.js`) + Prettier config (`.prettierrc` + `.prettierignore`)
- `VideoSection` component — lazy-loaded YouTube embed (zero JS until click)
- `WikiSidebar` component — dynamic article navigation (auto-generated from MDX files)
- `TrendingNow` component — horizontal scroll-snap card row
- `InContentAd` component — page-internal ad slot
- Ad integration: `StickyBanner` in LocaleLayout, `SidebarAd` in WikiSidebar, `InContentAd` in ArticlePage
- Google Analytics + Search Console verification injection (env-var gated)
- CI workflow (`.github/workflows/ci.yml`) — lint + typecheck + build on every PR
- Issue templates (bug report + feature request) and PR template
- `CONTRIBUTING.md`
- `wrangler.toml` for local Cloudflare preview

## [0.1.0] — 2026-08-11

### Added
- Initial public release
- Astro 5 static site (`output: 'static'`, zero adapter, Cloudflare Pages native)
- Content Layer API + Zod schema for type-safe MDX articles
- i18n: as-needed prefix (English no prefix, others prefixed) with single-article English fallback
- Homepage: 8 JSON-driven modules with 4 displayTypes (badge-list / steps / ranked-grid / labeled-cards)
- SEO: Organization / WebSite / Article / BreadcrumbList / ItemList / FAQPage JSON-LD, hreflang, dynamic sitemap, robots.txt
- Theme: CSS variable theming (4 lines to re-theme) + dark mode with no-FOUC
- Ads: 广告 iframe isolation (6 slots), Sticky 320×50 with dismiss button, env-var gated
- Legal pages: about / privacy-policy / terms-of-service / copyright
- Demo content: fictional "Anvil Quest" game (5 MDX articles, en + ja)
- Docs: PRD (1600+ lines), deployment, apply-template (4-step guide), content-format, seo, ads, migration-from-nextjs
- Build: 27 pages, typecheck 0 errors

[Unreleased]: https://github.com/PNGTRID/AnvilWiki/compare/v1.13.1...HEAD
[1.13.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.13.0...v1.13.1
[1.13.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.12.1...v1.13.0
[1.12.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.11.2...v1.12.0
[1.11.2]: https://github.com/PNGTRID/AnvilWiki/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.10.0...v1.11.0
[1.10.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.8.2...v1.9.0
[1.8.2]: https://github.com/PNGTRID/AnvilWiki/compare/v1.8.1...v1.8.2
[1.8.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/PNGTRID/AnvilWiki/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/PNGTRID/AnvilWiki/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/PNGTRID/AnvilWiki/releases/tag/v0.1.0
