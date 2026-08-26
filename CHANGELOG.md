# Changelog

All notable changes to AnvilWiki are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] — 2026-08-26

**手册同步批 + 初始化清理规范批:v2.1.0 的仓库文档层喂进站内学习手册(7 章双语),fork 初始化的删除清单首次文档化并修两处通道漂移。章数不变(learn 11/dev 7)、提示词 18 不变。**

### Added

- **学习手册第 7 章新增「统计三件套」完整接入教程**(zh/en):选型对比表(Cloudflare Web Analytics 无 cookie 必装 / GA4 同意横幅门控可选 / Clarity 热力图链第 8 章)+ CF Web Analytics 2 分钟步骤(Analytics & Logs → token → `PUBLIC_CF_BEACON_TOKEN`)+ GA4 10 分钟步骤(建媒体资源 → 数据流拿 `G-` 衡量 ID → `PUBLIC_GA_ID` → 点同意 → 实时报告验证),含「装完没数据」两大坑(GA 是 CookieConsent 点同意后才加载、报表 24-48h 延迟);开发手册「功能开关」章变量总表后补教程交叉引用。此前 GA/GSC 只有变量开关说明、无操作级教程(GSC 整章在第 6 章本就有,GA 是补齐)。
- **站内学习手册 7 章双语同步**(zh/en 各 7 文件,`updated` 2026-08-26):第 1 章发现层接 `docs/sourcing.md`(9 渠道操作指南+选词决策管理表)、第四关补「意图满足度」信号(第一页位置满 ≠ 没机会);第 4 章素材步接 `requirements/` 两张准备表(事实来源+对标参考)、新增「多少篇算够:首版 10-15 篇分批放」结论;第 6 章补上线 3-7 天首次数据复盘指引;第 8 章动作三升级为**四条及格线指标表**(CTR≥2%/每日点击 1000 目标/人均浏览≥1.5 页/每周新增 10+ 只加不改)+ 新增 Clarity 免费热力图小节(装一次每周看 5 分钟);第 10 章第 3 步补「翻正节奏」(生成可 40-60 篇、上线首版 10-15、每周 10+);第 11 章新增「外链:什么时候做、做多少」节(弱竞争期质量>外链、两阶段、DR 换链、别买垃圾外链);第 7 章「先说时机」随 v2.1.0 已就位。
- **`docs/apply-template.md` 新增「初始化清理规范」章节**:fork 后两条初始化通道(`pnpm apply-template` / Actions Initialize workflow)的完整删除清单表(demo 文章+配图按名删、项目官网含站内文档中心、wrangler demo 凭据、demo 作者)、保留不删清单(二进制资产/handbook markdown 源)、逃生口旗标(`--dry-run`/`--no-clear-content`/`--keep-landing`)与 `pnpm template-audit` 事后体检——此前该规范只存在于代码注释里,fork 用户读配置手册看不到。

### Fixed

- **`setup.yml` 中文官网删除路径收窄**:`rm -rf src/pages/zh` → 精确删 `src/pages/zh/landing.astro` + `src/pages/zh/landing`,与 `apply-template.ts` 的 `LANDING_PATHS` 逐项对齐。原整目录删除今天恰好等价(该目录只有 landing 文件),但属潜在漂移:模板未来在 `src/pages/zh/` 下加任何真实页面都会被 workflow 误删。
- **`apply-template.ts` 重置的 wrangler `[vars]` 与 setup.yml 对齐**:CLI 版 newVars 补 `PUBLIC_CF_BEACON_TOKEN = ""` 与 AdSense/GA/GSC 注释槽——两条初始化通道产出的 wrangler.toml 从此逐行一致(此前 CLI 走一遍会静默丢掉 beacon 行和可选槽注释)。

## [2.1.0] — 2026-08-26

**SEO 实战文档批:社区实战经验落库(挖词渠道/外链策略/内容准备模板/数据复盘/广告时机与收款)。零代码变更,模板架构与依赖不动——fork 常规 merge 即得。**

### Added

- **`docs/sourcing.md` 挖词与选词完整指南**:9 个挖词渠道按优先级(SteamDB 趋势图实操/社媒低粉异常值/聚合站 sitemap 扫描/趋势时下流行/开发者追更/经典爆款二创/预告游戏埋伏/Similarweb·SEMrush 循环打法/AI 类游戏新赛道)+ 第 7 条选词判断「意图满足度」(搜索意图未被 SERP 满足 = 强可做信号)+ 选词决策管理表(做/不做/考虑,【考虑】隔天复判);`game-selection.md` 四层漏斗互链接入。
- **`docs/seo.md` 新增「外链策略」章节**:外链 ≈13% 权重但弱竞争新词期页面质量/体验/停留时长优先(个位数外链胜几千外链实战案例)、两阶段策略排序(排名没起来先内容)、DR 换链 + 人肉确认后批量发实操、垃圾外链警告。
- **`requirements/` 内容准备模板**:`00事实来源.md`(AI 按页面矩阵联网调研生成事实来源表,来源含竞品分析 + YouTube 字幕,E-E-A-T 凭证)+ `00对标参考.md`(1-3 个对标站四维拆解:首页结构/内页结构/广告位布局),建站前素材工作区,与「AI 不编造游戏数据」规则闭环。
- **`docs/deployment.md` 新增两节**:「上线后的数据复盘(3-7 天)」指标表(CTR ≥2% 合格/每日点击 1000 目标/人均浏览 ≥1.5 页 = 内链线/每周新增 10+ 内页只加不改)+ Microsoft Clarity 免费热力图与录屏接入(10 分钟,含 CSP 放行域名提示)。
- **`docs/ads.md` 广告时机与收款**:上线后 1-2 天再开广告 + 同类站原则(banner 致主关键词下滑又恢复的实战案例 + 开前自查清单);Adsterra 收款两条路线——USDT(OKX,TRC-20 网络核对警告)与 Payoneer(欧元账户 wire transfer,客服调 $100 门槛英文话术、签协议提现),默认全关的广告位 env 设计与时机策略互证;站内学习手册第 7 章(zh/en)同步补「先说时机」小节并互链。

### Changed

- **首版页数建议**:`game-selection.md` 明确首版只上线 10-15 篇核心页(codes/tier list/guide 高价值词),批量生成 40-60 篇草稿可以但**部署分批**(每周 10+ 翻正一篇上一篇,配合 draft 门控与内容管道)——第一版页面太多质量被稀释,反拖整站排名。
- **`docs/README.md`**:快速索引 + 路径 A + 一页决策地图收编 sourcing.md / ads.md / requirements/。

## [2.0.1] — 2026-08-24

**v2.0.0 发布当日的全面审计修复(5 视角:代码层/CI+脚本/ops CLI/文档一致性/内容+依赖)。机械门禁当时全绿——本批修的全是门禁看不见的层。**

### Fixed

- **`category` 变硬门禁**:`src/content.config.ts` 从 `z.string()` 改为 `z.enum(CONTENT_TYPES)`——打错分类名此前会产出 HTTP 200 的软 404 页并被 sitemap/RSS/llms.txt 照常发布,现在构建直接失败。
- **第八道门禁真正能红**:`check-i18n` 新增 `--strict-ui` 模式(缺 UI key = 模板缺陷,exit 1;文章翻译深度仍为报告项——内容选择不是模板错误),共享门禁 action 改跑 strict-ui,「八道门禁」的承诺从 7+1 报告变成 8 道真门禁。
- **`setup.yml` fork 初始化 PR 开出前先验证构建**:此前是破坏性变更(rm landing/删 demo MDX)零验证——GITHUB_TOKEN PR 不触发 CI、workflow 自己也不跑 build,清单漂移要等 fork 首次 Cloudflare Pages 构建才炸;现在开 PR 前跑 `pnpm install && pnpm build`,且 wrangler.toml 重写步骤断言正则命中(subn 计数,静默 no-op 直接失败)。
- **`auto-content.yml` 两个静默缺陷**:粘贴的 `csv_text` 会被提交进 PR 合入 main → create-pull-request 加 `add-paths: src/content/**`(PR 只含内容变更);`bulk-new-posts` 零产出时 exit 0 导致「全绿但无 PR」→ 新增 `--require-output` 旗标,管道使用之。
- **tools/anvil-ops 测试进主 CI**:ci.yml 新增 `ops-toolkit` job(typecheck/test/build)——此前动 ops 代码的 PR 落 main 零测试信号,发布时才炸(7993ae6 事故的根因)。
- **release-ops 发布守卫**:tag `ops-vX.Y.Z` 与 `tools/anvil-ops/package.json` 版本一致性校验(不符即 fail);publish job 补 `timeout-minutes`;npm 全局升级钉在 major 11(`npm@11`,不再浮动 `^11`)。
- **sitemap hreflang 与页面 head 的矛盾**:去掉 sitemap `i18n` 全量选项(它给每个 URL 虚构所有语言的 alternate,与回退页「只有 en」的页面级声明冲突,Google 会丢弃冲突簇);改为 `serialize` 钩子按真实 MDX 存在性生成 alternates(文章按覆盖语言、列表页按全部语言路由)。
- **anvilwiki-ops MCP 站点解析吞错**:`resolveEffectiveRoot` 只把「无站点配置」的 OpsError 落到 defaultSite,TOML 解析错误直接抛出——此前 cwd 的 wrangler.toml 损坏会把 submit_pr 静默指到另一个站的仓库。
- **anvilwiki-ops GSC 错误处理死代码激活**:gaxios 对非 2xx 直接 throw,精心写的 403「共享 SA」修复指引从未被执行——现在统一包装 HTTP 错误(403/401/429 各带修复指引)。
- **anvilwiki-ops doctor 从子目录运行误报**:`.env` 改从发现的站点根(`site.root`)读取,与 metrics/insights 行为一致。
- **anvilwiki-ops MCP stdio 冻结**:audit/submit_pr 等重生成操作改经 worker 线程执行(spawnSync 曾把 Node 事件循环冻住几分钟,keepalive 超时的客户端会误杀进行中的调用);源码/注入测试运行自动回退进程内。
- **anvilwiki-ops 健壮性批**:GSC 失败不再连累 CF 半份报告(独立降级,全失败才报错)+ GSC 1000 行/CF 100 行截断显式提示;GSC 窗口差一修复(`--days 28` 真的是 28 天);`sites.toml` 写入原子化(临时文件+rename);`sites add` 站点名合法字符校验;AIO 归档同日导入不再静默覆盖;`git add -A` 后检测已暂存的 `.env` 并拒绝提交;`submit` 失败提示不再引用不存在的 push-only 命令;`sites`/`mcp` 子命令收到全局 `--site/--all` 时明确报错而非静默忽略。
- **脚本批**:`bulk-new-posts`/`new-post` 的 navigation/routing 解析失败改为响亮报错(删硬编码回退清单);slugify Unicode 化(CJK slug 可用,`新手攻略` 不再变空串);YAML 模板反斜杠转义(标题含 `\` 不再炸/腐化 frontmatter);`new-post` 描述超 165 也警告;`new-locale` 四处正则重写全部断言命中(不再「打印成功但文件没动」);`gen-covers` 字体下载加 120s 超时;`content-pipeline.yml` 的 `!failure()` 改 `success()`(取消状态不再落入建 issue 分支)。
- **代码层批**:英文回退页的「相关文章/上一篇下一篇」改从 servedLocale 取集合(此前静默消失);相关文章按日期排序(原为路径字母序);tag 路由统一走 `parseEntryId`(两处内联解析行为不一致);画廊灯箱空 `src=""` 的伪请求移除;handbook TechArticle 缺 `updated` 时省略日期(不再用构建时间伪造新鲜度);ListPage 无 overview 时的 meta description 走 i18n(`shared.defaultListDescription` 新键 en/ja);HomePage 硬编码英文兜底删除;`summary` schema 上限 200→400 字符(40-60 词的英文实际 250-350 字符,旧上限与字数规则自相矛盾);死导出清理(`getAllEntriesByCategory`/`allLocales`/`NAV_BY_KEY`/`localeFromPath`)。
- **workflows.test.ts 契约硬化**:SHA 钉断言覆盖全部 5 个 workflow(含 setup.yml)+ 一切非本地 `uses:` 必须 40 位 SHA(含 create-pull-request);门禁断言改为解析 YAML 后精确比对 8 条命令(顺序敏感、各自独立 step,注释里的字样不再能骗过测试);新增 setup.yml「build 先于 PR」与 ci.yml ops-toolkit job 断言。
- **文档一致性批**:`anvil-new-article` skill 仍教 800×450 旧封面标准(会持续毒化 AI 生成内容)→ 1200×675 + gen-covers;AGENTS.md 测试注释 6→9 套件、Commands 补 `gen-covers`、ops 测试计数更新(111→125);PRD 工作流计数 4→5(补 release-ops.yml);v2.0.0 发布日期三处统一为 2026-08-23;CHANGELOG 2.0.0 条目重复短语修正;EN 发布横幅补「eight quality gates」与中文对齐;孤儿平台验证 TXT 删除。
- **demo 内容批**:codes 页(en/ja)刷新(过期 1 码+新增 ANVIL-DAWN,lastModified 2026-08-23,补 `gameVersion: v2.5`,违反自家 7 天新鲜度规则 8 天的问题闭环);3 篇英文 summary 增重至 40-60 词(规则本意,AI Overviews 候选字段不再欠重);emberfang(en/ja)补 gallery 机制图 2 张(gen-demo-media 新增 SVG 绘制)、stormcaller(en)补视频嵌入——boss 指南媒体配对规则(videos+gallery)全部达标;ja tags 对齐 en(freebies/ash-warden);`ja/guides/` 目录补齐(routing.ts 约定)。

### anvilwiki-ops(随本批发布 1.0.1)

- 测试 111→125(新增 cli-flags 纯函数测试 9 例、resolveEffectiveRoot 错误判别 3 例、包完整性 smoke 3 例替换占位断言;smoke 从 `1+1` 变成 bin/files/version 真校验)。

## [2.0.0] — 2026-08-23

**内容经营操作系统:PR 门控内容管道 + 多站管理 + 封面产能 + 变现建议位。模板仓库零 breaking——fork 用户常规 merge 即可,无迁移步骤;唯一契约变化在 `anvilwiki-ops` 0.x→1.0.0(MCP 工具加可选 `site` 参数,不传行为与 0.x 一致)。**

### Added

- **PR 门控内容管道 `.github/workflows/auto-content.yml`**:workflow_dispatch(仅 collaborator,天然鉴权)→ 确定性生成器(`import-csv` 任务 → `pnpm bulk-new-posts` 脚手架)→ **八道质量门禁前置**(全绿才开 draft PR——2026 年起 GITHUB_TOKEN 创建的 PR 不自动跑 CI,验证前置比「先开 PR 再等 CI」更严格)→ create-pull-request@v8(固定分支 `chore/auto-content` 幂等、无 diff 静默跳过);**LLM 永不进 CI**(`secrets` 零引用,tests/workflows.test.ts 钉死契约);权限仅 `contents: write` + `pull-requests: write`;配套文档 `docs/content-pipeline.md`(fork 启用两步设置)。
- **八道门禁抽成共享 composite action `.github/actions/gates`**:ci.yml 与 auto-content.yml 同源复用同一份门禁定义,杜绝两处漂移;ci.yml 行为不变。
- **`anvilwiki-ops` 1.0.0(多站管理)**:站点注册表 `~/.config/anvil-ops/sites.toml`(`[[sites]]` name/path/siteUrl 覆盖,**凭据永不入注册表**——各站 `.env` 各自保管)+ `--site <name>` / `--all`(doctor/metrics/audit/insights 批处理,单站失败不中断)+ `sites list/add/remove` 子命令;无旗标时行为与 0.1.3 完全一致;`submit` 刻意拒绝 `--all`(批量发布不一键化)。
- **AI 引用追踪(anvilwiki-ops 1.0)**:① CF Web Analytics AI referrals(`metrics` 末尾自动追加——chatgpt.com / chat.openai.com / perplexity.ai / gemini.google.com / claude.ai / copilot.microsoft.com 的 referrer host 聚合,GSC gen-AI 报告无 API 故此为主通道);② GSC `searchAppearance=AI_OVERVIEWS` 探测(`insights` 列被 AI Overviews 展示的页面,标注 experimental);③ `metrics --import-aio <csv> [--save]` 导入 GSC UI 导出的 Search Generative AI 报告 CSV(容忍 BOM/引号/缺列,`--save` 归档 `ops/ai-visibility/<date>-aio.csv`)。
- **`pnpm gen-covers` og:image 封面生成**(`scripts/gen-covers.ts` + `src/lib/covers.ts`):satori + @resvg/resvg-js + subset-font;**封面尺寸标准 800×450 → 1200×675**(Google Discover 大图预览要求 ≥1200px 宽);品牌色运行时解析 globals.css `--brand`(单一真相);中/日文标题按字符运行时子集 Noto Sans CJK JP/SC(OTF 首次下载缓存 `node_modules/.cache/gen-covers/fonts/`,不进 git;`--fonts-dir` 离线逃生),拉丁字体内置 OFL Lato(`scripts/fonts/`);manifest hash 缓存(`--force` 重生成;`--out <dir>` 预览模式渲染全部且不动 frontmatter);默认模式只为无封面文章生成并自动写入 frontmatter `image`。
- **全站 `max-image-preview:large`**(`BaseLayout.astro` 非 noindex 分支):Google Discover 大图预览的硬前提,此前全站缺失。
- **`AffiliateSuggestion` 文末建议位**(`src/components/ads/AffiliateSuggestion.astro` + `src/config/affiliates.ts` + `src/lib/affiliates.ts`):config 层驱动(affiliate 是逐站内容数据非部署密钥),默认空数组 = 不渲染(保 Lighthouse 4×100 开箱契约与 fork 纯净);渲染至多 2 张 AffiliateLink 卡片,`categories` 可选按栏目限定;`shared.sponsoredLabel` i18n(en/ja),AffiliateLink 新增可选 `sponsoredLabel` prop 向后兼容。
- **新文档**:`docs/content-pipeline.md`(管道安全契约六条 + fork 启用步骤 + 与每周审计分工)、`docs/multi-site.md`(注册表心智模型 + AI 引用三通道 + 新站流程),均入 `docs/README.md` 快速索引与决策地图;开发手册第 7 章「AI 自动化运营」双语补「一套工具管 N 个站」「关键词清单直接变草稿 PR」两节(章数不变 learn 11 / dev 7,提示词 18 不变)。
- **决策记录与 ADR**:`docs/superpowers/specs/2026-08-22-v2.0-content-os-design.md`(六项定档);PRD 新增 ADR-004(内容管道=确定性+PR 门控,LLM 永不进 CI)、ADR-005(多站=工具层,模板一仓一站)。
- **测试**:root 测试套件 6→9(新增 workflows/covers/affiliates 三套件)——tests/workflows.test.ts(管道安全契约:dispatch-only/权限精确/门禁先于 PR/draft/零 secrets/审计只读)、tests/covers.test.ts(品牌色解析/CJK 判定/字号启发/manifest hash)、tests/affiliates.test.ts(建议位筛选);anvilwiki-ops 60→111。

### Changed

- **PRD §14.2 消歧撞号**:历史行「v2.0 | 套用模板 CLI」标注为「v1.x 期里程碑,原标 v2.0」,与正式 v2.0.0 区分;「更新记录」表补 v2.0.0 行并指向 CHANGELOG;§5/§13 能力与工作流计数同步(脚本 11→12、工作流 3→4)。
- **demo 封面 5 张重生成/升采样至 1200×675**(`scripts/gen-demo-media.mjs` 封面走 viewBox 缩放渲染,注释同步;其余 4 张 sharp lanczos 升采样);`docs/content-format.md` 封面字段表与质量指引同步新标准 + gen-covers 提及;AGENTS.md 媒体密度行同步。
- **`docs/roadmap.md`**:演化主线表加 v2.0 段;「中期(v2.0 方向)」标记交付(邮件订阅明确留 v2.1);近期候选池滚动(新增 Astro 5→7 升级、管道生成器扩展)。
- **`docs/staying-up-to-date.md`**:MAJOR 措辞从「=breaking change」修订为「=重大里程碑;含 breaking 必附迁移说明」;新增「升级到 v2.0」一节(常规 merge + `pnpm install` + 两个可选动作)。
- **README 中英**:AI 全链路/工具链/变现三条特性升级为 v2.0 表述;顺手修英文对比表遗留的「8-chapter manual」漂移(v1.18 漏改,中文侧已是 11 章)。
- **CHANGELOG compare 链接补齐**:[Unreleased] 指针更新为 v2.0.0...HEAD,补 1.15.0–1.19.0 六个缺失链接行。
- 全仓计数与版本同步:package.json / landing.ts `PROJECT_VERSION` / 中英发布横幅 / AGENTS.md Status 与 Commands(`gen-covers`)与 Ops Toolkit(1.0.0 能力清单)。

## [1.19.0] — 2026-08-22

**SEO 进阶:从被收录到排上去,再到被 AI 引用——对齐 2026 搜索新格局。**

### Added
- **学习手册第 11 章「SEO 进阶」**(`docs/handbook/{zh,en}/seo-traffic.md`,learn 10→11 章,提示词 16→18 个):一页一词选词地图(意图匹配/长尾甜点/可超越性三判据 + 关键词选题提示词)、单页做满自检清单(title/H2 问句/summary/表格/内链/封面图/lastModified 八槽位表格 + 全站 SEO 自检提示词)、站点信任三慢变量(新鲜度/作者署名/内链网络)、2026 新规则失效清单(FAQ 富结果移除、llms.txt 对 Google 无效但对 ChatGPT 有用、AI Overviews 引用偏好、封面图成图片搜索入口)、2026-08 反 spam 三红线;第 10 章结尾衔接同步(中英)。
- **`docs/seo.md` 新增「Google 官方规范更新记录(2026)」**:9 条时间线(Spam update / preferred sources 自定义按钮 / GSC 社交视频分析 / review snippet 违规规则 / canonicalization 澄清 / llms.txt 官方澄清 / FAQ 富结果移除 / og:image 成选图首选 / Discover core update),每条附「对本模板的影响」;文末 FAQPage 备注从「限制到政医站」修正为「已完全移除」。
- **`docs/roadmap.md` 公开路线图**:八段演化主线(v0.1 地基 → v1.19 SEO 进阶,每段方向+代表能力)、近期候选池(AI 引用追踪/封面图产能/preferred sources 适配/选品决策支持)、v2.0 方向(PR 门控 CI 内容管道/多站管理/变现深化)、不做清单;`docs/README.md` 快速索引与 seo.md 描述同步收录。

### Changed
- `docs/content-format.md` 媒体密度表新增封面图质量三原则(2026-03 起 Google 选图首选 og:image,封面从装饰升级为图片搜索流量入口)。
- 全仓计数同步:学习手册 10→11 章、可复制提示词 16→18——README 中英(4+2 处)、docs/README(2 处)、PRD §5/§11/§15、`landing.ts` 手册简介(中英 4 处)+ 发布横幅(中英)+ `PROJECT_VERSION`;发版横幅文案与版本号同步(吸取 v1.18.0 漏改横幅的教训)。

## [1.18.0] — 2026-08-20

**关卡7 模板化 + 关卡8 批量内页:跑通一个站之后的两条放大路径。**

### Added
- **`pnpm template-audit` 模板健康检查**(`scripts/template-audit.ts`):代码层纯净度(剥离注释后扫 demo 字符串,注释里的用法示例不算违约)/配置层换皮(域名/站点名+游戏名/分类三处一致)/内容层可替换性(每类文章数、draft 遗留)/换皮残留(demo 封面与机制图、**demo 文章**(按内容含 demo 游戏名检测,文件名相同的 fork 自有页面不误报)、wrangler.toml demo 值)四组检查,✅⚠️❌ 三级输出 + 健康度评分(如「3/11」);仅 ❌ 违反分层契约才非零退出,demo 仓库上 ⚠️ 遗留是预期。demo 资产清单与 `apply-template.ts` / `setup.yml` 保持同步(keep-in-sync 注释)。
- **`pnpm bulk-new-posts` 批量内页脚手架**(`scripts/bulk-new-posts.ts`):读 `new-posts.csv`/`.tsv` 关键词清单(列 `locale,category,slug,title,description`,支持 RFC-4180 引号转义、`#` 注释行、表头前注释、Excel BOM/TSV 自适应),全量校验(locale∈routing / category∈navigation / slug 自动规范化与冲突去重 / description 40-165)后**全部合法才写入**;生成的全部是 `draft: true` 草稿(不进 build),目标文件已存在则跳过绝不覆盖;`--dry-run` 预览计划;边界清晰报错——description 占位符在长标题下自动降级为固定文案(schema 40-165 恒通过)、未闭合引号、目录入参、`-n` 别名。
- **`.agent/skills/anvil-batch-articles` 批量内容技能**:关键词清单 → 意图归类(照抄 anvil-new-article 分类表)→ 生成 `new-posts.csv` → 每类意图用同一份统一提示词模板批量填充 → `check-content` + `build` 全批验收;内置 5 条铁律(批量≠灌水、禁编造数据、内链只指真实页面、同批禁模板句复用、draft 逐篇转正)。
- **学习手册第 9 章「把第一个站打磨成模板」+ 第 10 章「批量做内页」**(zh/en,`templatize-your-site.md` / `batch-pages.md`,learn 手册 8→10 章):第 9 章讲 template-audit 用法、换皮清单沉淀提示词、复制第二个站的 30 分钟四步;第 10 章讲内页流量逻辑、关键词四来源、统一内页生成提示词、批量三步法与灌水红线。新增 2 个可复制提示词(总 16 个)。

### Changed
- 全仓计数同步:学习手册 8→10 章、可复制提示词 13→16 个(v1.17.1 加媒体提示词后实际已 14 处但宣传数未同步,本次一并校正)、脚本 9→11、技能 3→4——README 中英、docs/README、PRD §5/§11/§15、`landing.ts` 手册简介、AGENTS.md Status/Commands/技能清单、手册内交叉引用(第 4 章技能数、第 8 章结尾接第 9 章)。
- `docs/apply-template.md` 末尾新增「模板化进阶:audit + 沉淀」一节;PRD §14 roadmap 补 v1.18 行。

## [1.17.1] — 2026-08-20

**专家团复审补丁:demo 图内事实校正 + fork 素材清理 + 指引闭环。**

### Fixed
- **demo 图与正文事实矛盾**(复审 A 批):竞技场图 4 个固定陨石标记→3 个靠边标记(正文"每 30s 标 3 个点,引到边缘");"permanent lava"→"fire puddles last 20s"(正文 20 秒);机制图 "~1.5s dodge window"→"2s to move after each mark"(正文标记后 2 秒落地)、"save your dash for the volley"(Emberfang 的设定串台)→"melee: stand at her side or back" 并补 Flame Whip "1.2s wind-up · 600 damage" 数据;Frostpike 卡 "Freeze on hit"(图自创触发条件)→"Freeze utility"(正文原话);stormcaller gallery 图注同步改"meteor marks near the edges"。
- **fork 选 "Clear demo content" 后留下 11 张孤儿 demo 图**(约 340KB):`apply-template` 新增 `clearDemoAssets`(按名删 5 张 demo 封面 + 整删 `src/assets/gallery`、`public/images/articles`,不误伤用户自换素材),`setup.yml` 清理步骤同步同一清单(fork 真模拟构建验证)。

### Docs
- PRD §14 roadmap 补 v1.17 行(v1.15/v1.16 惯例对齐)。
- 学习手册「前 10 篇文章」章中英新增**提示词 D:配图与视频**(截图/视频来源红线、放置路径、密度表指引),frontmatter description 三段→四段;`content.config.ts` gallery 注释补 demo 目录约定。

## [1.17.0] — 2026-08-20

**demo 媒体增强:每类文章完整示范模板的媒体能力,补齐 AI 内容工作流的媒体密度指引。**

背景:模板的媒体系统(封面/gallery/内联图/视频 + ImageObject/VideoObject JSON-LD)早已齐备,但 demo 文章几乎没用到(7 篇正文内联图 0 处、gallery 1 处且复用封面、视频 1 处、codes 页无封面、ja 侧 0 媒体)——fork 用户与 AI agent 照 demo 学,只能学出纯文字站。本版把"能力 vs 示范"倒挂拉平。

### Added
- **demo 素材生成脚本 `scripts/gen-demo-media.mjs`**:demo 游戏是虚构的,没有真截图——7 张扁平风示意图(封面/竞技场地图/机制图/职业卡/路线图/武器卡)以 SVG + sharp 光栅化,可复现可改;全部 800×450(16:9)。
- **媒体密度指引**(按页面类型给封面/内联图/gallery/视频建议密度表):`docs/content-format.md` 新增专节,`.agent/skills/anvil-new-article` 同步补图片四条规则,AI 生成文章默认带上媒体。

### Changed
- **codes 页补封面**(en/ja):og:image 不再回退全站 hero,分享卡片有辨识度;codes 恰是分享最频繁的页面类型。
- **stormcaller gallery 换独立机制图**(竞技场俯视图 + Flame Whip 安全区/陨石时间线),不再复用封面充当画廊。
- **weapon-tier-list 补正文内联卡片图 ×2**(S 档 Voidforge / A 档 Frostpike)——此前正文内联图 0 示范。
- **beginner-guide 补 gallery**(四职业卡 + 前两小时路线图,与正文六步严格对应)。
- **ja/emberfang 补视频**(frontmatter 登记 + 正文内联,与 en 版对齐)——i18n 媒体示范对齐。
- **globals.css 新增 `.prose img:not([class])` 规则**:markdown 正文图预留 16:9 盒子(零 CLS,信箱式不裁剪);`:not([class])` 只命中裸 markdown `<img>`,不影响视频缩略图等组件图。
- demo 演示视频加注释说明:占位 YouTube ID,fork 后两处(内联 `id` + frontmatter `videos`)替换。

## [1.16.1] — 2026-08-19

**专家团三轮审计修复批:fork 主路径致命 bug + SEO 合规 + 性能 + 文档全面同步。**

### Fixed
- **fork 一键初始化后构建必炸**:setup.yml 的 landing 删除清单与 apply-template 的 `LANDING_PATHS` 双源漂移,漏删 `src/pages/landing/`(docs 路由)与 `public/images/showcase`,合并初始化 PR 后 build 因 unresolved import 失败;已对齐两处清单(fork 真模拟验证构建通过)。同修:setup.yml 输入改 env 传递防注入、`--force-with-lease` 幂等重跑。
- **CJK 标签页生产 404**:`slugifyTag` 预编码非 ASCII 标签导致 Astro 写出字面量 `%E7…` 目录,站内链接(单编码)全部 404;改为返回原始标签,两种 URL 形态均可达。
- **`anvil-ops submit` 在多语言仓库永远失败**:门禁 `check-i18n --strict` 与 wiki 回退设计冲突(locale 缺文章是合法状态),改非 strict 与 CI 同口径;手册/技能文件同步去「严格」表述。
- **codes 页 FAQPage 结构化数据标记不可见内容**(Google 政策风险):同组 FAQ 现以原生 `<details>` 可见渲染(JSON-LD 与可见文案逐字一致,中英日三语)。
- **英文回退页错误自宣 `hreflang="ja"`**:alternates 改为仅含真实翻译语言;语言切换器 UI 行为不变。
- **sitemap noindex 过滤补 locale 前缀路径**:en 文章设 `noindex: true` 时其 `/<locale>/` 回退 URL 一并剔除(有真实翻译版本时由该版本自身 frontmatter 决定)。
- **公告栏版本漂移**:PROJECT_VERSION 落后于已发版本(v1.16.0 发布时漏同步)。

### Changed
- **anvilwiki-ops 0.1.3(npm)**:MCP serverInfo 版本号改运行时读 package.json(原硬编码 0.1.0 已漂移);npm 包补 LICENSE;doctor 网络异常空 `reason:` 兜底;submit 非 strict(见上)。
- **广告位预留高度**(Sticky 90px / InContent 250px / Sidebar 600px):开启 AdSense 后填充不再推挤页面(CLS),默认关闭契约不变。
- **landing 截图 PNG→WebP**(273K→104K)+ hero 改 `eager`+`fetchpriority="high"`;`_headers` 补 `/images/*`、`/pagefind/*` 缓存规则。
- **GitHub Actions 供应链加固**:3 个 action 全部钉 commit SHA;ci.yml 加 concurrency。
- **`OG_LOCALE_MAP` 放宽为 `Record<string,string>`**:`new-locale` / `apply-template` 重写 locales 后不再 typecheck 报错;zh landing 输出 `og:locale=zh_CN`。

### Docs
- README 英文区补齐中文区 4 个章节(AI 技能表/平台对比/FAQ/技术栈+社区)、"Development 6"→7;AGENTS.md 测试清单与 anvil-ops 60 测试数同步、发布状态更新;deployment.md 死锚点修复;PRD §5 目录树/§5.1/§6.1 schema/§13.2 CI/§15.3 全部同步至当前现实。

## [1.16.0] — 2026-08-18

**社区案例库:首批 3 个真实用户站点上线展示。**

### Added
- **社区案例库(Showcase)**:首批 3 个真实用户站点(aniimo.wiki / nomanssky.wiki / steal-anegg.wiki)三处展示——官网中英落地页新增「Built with AnvilWiki」区块(`CommunitySites.astro` + `landing.ts` 的 `COMMUNITY_SITES` 数据)+ README 中英双语案例表格 + PRD §15.6;数据与组件均随 landing 层分发,fork 时被 `apply-template` 自动清理。

### Fixed
- **GSC 接入步骤修正**(手册第 7 章 + ops README,中英):服务账号邮箱会被 GSC「添加用户」直接拒收(「无效电子邮件地址」),改为官方推荐的 Google 群组中转四步法,并补「服务账号=机器人编号,非邮箱」概念段。
- **学习手册第 3 章新增第 5 步「换上你的图标」**(中英):favicon 全套 + hero 图的手把手替换(favicon.io),原验收步顺延为第 6 步;`apply-template` CLI 结尾提示同步扩写——修复零基础主路径不教换图标、站点顶铁砧图标上线的缺口。
- **手册第 6 章两处措辞**(中英):IndexNow 表述修正(仅自有域名接入 Cloudflare 后有 Crawler Hints,纯 pages.dev 无);GSC 验证变量补「网页 Variables vs wrangler.toml [vars]」双模式指引。
- **anvilwiki-ops 0.1.2**(npm):删了 wrangler.toml 的学习路径用户从 `.env` 读 SITE_URL/PUBLIC_CF_BEACON_TOKEN 回退(原 doctor 必挂且误导);`sc-domain:` 域级资源不再强拼尾斜杠。
- **根 package.json 设 `private: true`**:模板与 fork 永不可能被误 `npm publish`(当日误发 anvilwiki@1.15.0 已在 72h 窗口内撤回,疫苗性加固)。

## [1.15.0] — 2026-08-18

**站长运营 CLI + MCP:anvilwiki-ops(npm 包)—— AI 拉数据、给洞察、内容走 PR 上线的自动化运营闭环。**

### Added
- **`tools/anvil-ops/` 独立 npm 包 `anvilwiki-ops`(0.1.1 已上架 npmjs.com,`npx` 免安装)**:CLI(`anvil-ops`,含包名别名)+ stdio MCP server(`anvil-ops mcp`,一行接入 Claude/ZCode 等 MCP 客户端);core / CLI / MCP 三层解耦,56 测试 + 真实 git bare 仓库集成测试;根 tsconfig/eslint exclude `tools/`,模板与工具互不干扰。
- **5 命令 = 5 MCP 工具**:`doctor`(wrangler/gh/GSC/CF 配置体检,逐项给修复指引)/ `metrics`(GSC 点击曝光 CTR 排名 + CF Web Analytics 访问,table/json/md 三格式,凭据未配自动降级)/ `audit`(refresh-audit / check-i18n / check-content / check-links 聚合报告)/ `insights`(规则引擎:低 CTR 改写、排名 5-15 加深、零曝光排查、流量结构、过期 codes,阈值常量集中)/ `submit`(check-content + check-i18n --strict + build 校验 → ops/submit-* 分支 → push → gh 开 PR,**永不 push main**)。
- **数据接入契约**:GSC 服务账号 JSON(`{` 开头内联,否则路径)+ CF API token 存 .env(gitignored,空 = 功能禁用);CF site tag 直接读 `wrangler.toml PUBLIC_CF_BEACON_TOKEN`,零额外配置;错误信息全部带「现象 + 修复指引」。
- **开发手册第 7 章「让 AI 替你运营:anvilwiki-ops 与 MCP」(中英)**:体检 → 接数据 → 看数据拿清单 → MCP 交给 AI → submit 上线五步(四段式),含「安全线:为什么它改不了你的线上站」与可复制的 AI 指挥提示词;ch6 完结段迁至 ch7,zh「开发 4」标题笔误修正为「开发 6」。
- **三个 `.agent/skills` 技能补可选引用**:anvil-refresh → `insights` 流量×新鲜度合并巡检;anvil-new-article / anvil-update-codes → `submit` 校验后一键开 PR。

### Changed
- 全仓手册计数与描述同步(开发手册 6→7 章):landing 中英 hub 副标题 + 手册卡、README 中英、docs/README、AGENTS 状态行 + 新增 Ops Toolkit 章节(含 pnpm workspace 劫持警示)、PRD roadmap v1.15 行。
- AGENTS.md 产页规则 4 增补 `anvil-ops submit` 可选收尾。

## [1.14.1] — 2026-08-17

**状态同步版:README 重构升级 + 官网/仓库文档全面刷新到最新状态(v1.14 手册分册、8+6 章、零基础优先)。**

### Changed
- **README.md 重构**:新增「快速链接」表(零基础→学习手册 8 章/全景→文档中心/定制→开发手册/在线 Demo,一眼分流);核心特性压缩为 8 条并把「零基础双手册」提为第一条;快速开始压缩为 4 步并引导新手去学习手册第 2 章;新增「常见问题」(要花多少钱/不会编程能做吗/多久有收入/会被上游覆盖吗);对比表加「AI 产页/上手门槛」两行;英文区同步镜像重写;尾部新增 Design Notes。badges 的 Project page 更新为 Docs 徽章。
- **Landing 首页文案刷新**:hub 副标题与两本手册卡片描述改为最新事实(相互独立、8 章/6 章、零基础标准、每步 SOP+提示词)。
- **仓库文档同步**:`docs/README.md` 手册条目改为 8+6 章 + 两个手册独立页链接;`AGENTS.md` 状态行从 v1.9.0(严重滞后)更新到 v1.14.0(含文档中心/手册结构/源码位置说明)。

## [1.14.0] — 2026-08-17

**手册分册成页 + 章节拆细:学习手册与开发手册各自独立页面,5+4 章拆为 8+6 章,手册页改编号列表展示。**

### Changed
- **两本手册独立成页**:`/landing/docs`(及中文版)改为选择页(全景清单 + 两张手册大卡);新增 `/landing/docs/learn` 与 `/landing/docs/dev` 手册专属页(中英四页)。左侧手册树的册名、章节页面包屑同步链接到手册页。
- **学习手册 5 → 8 章**(沿自然接缝拆):①选对游戏 ②出发前:装好 6 样工具(原第 2 章第一幕独立成章——最大流失点值得独立入口)③复制模板跑起你的站 ④让 AI 写 10 篇攻略 ⑤网站上线(含买域名)⑥让 Google 认识你(GSC/sitemap/收录独立成章)⑦接广告开始赚钱 ⑧每周保鲜与增长。
- **开发手册 4 → 6 章**:①改动地图 ②加栏目与加语言 ③换主题色与改首页(原「定制」一分为二)④功能开关总表 ⑤CI 门禁与安全底线(原「集成」一分为二)⑥同步与回流。
- **手册页列表化**:每本手册的页面用编号列表逐章展示(序号徽章 + 标题 + 一行简介 + 箭头),比卡片网格更直观;hub 手册卡显示章数。
- **互链全面重接**:roadmap 10 项、DocsEntry 卡片、章间「下一步」、跨章引用全部指向新 slug;旧 slug(customize/deploy-and-get-indexed/monetize-and-grow)零残留(en 14 章 2 并行 agent 同源重写,13 提示词块守恒,事实限定词逐条存活)。

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

[Unreleased]: https://github.com/PNGTRID/AnvilWiki/compare/v2.1.1...HEAD
[2.1.1]: https://github.com/PNGTRID/AnvilWiki/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/PNGTRID/AnvilWiki/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/PNGTRID/AnvilWiki/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.19.0...v2.0.0
[1.19.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.18.0...v1.19.0
[1.18.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.17.1...v1.18.0
[1.17.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.17.0...v1.17.1
[1.17.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.16.1...v1.17.0
[1.16.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.15.0...v1.16.0
[1.15.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.14.1...v1.15.0
[1.14.1]: https://github.com/PNGTRID/AnvilWiki/compare/v1.14.0...v1.14.1
[1.14.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.13.1...v1.14.0
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
