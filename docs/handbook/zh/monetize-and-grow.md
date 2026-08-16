---
title: "变现与周运营:AdSense、保鲜和增长节奏"
description: "接入 AdSense 三个广告位、Giscus 评论与 GA4 统计的全部环境变量,以及每周 30 分钟的运营 SOP——codes 更新提示词、新鲜度巡检提示词、月度复盘清单。"
manual: learn
order: 5
icon: lucide:dollar-sign
tldr: "变现三步:攒够 15-20 篇内容后申请 AdSense,把 4 个广告 env 填进 wrangler.toml 或 dashboard,广告位自动渲染且不伤 Lighthouse。运营靠节奏:每周一 30 分钟处理新鲜度 issue 和 codes 更新,每月复盘 RPM 和同步上游。"
updated: 2026-08-16
---

## 变现第一步:AdSense(别急,先攒内容)

**申请前清单**(内容薄必被拒):

- ☐ 自有域名(pages.dev 子域通过率低)
- ☐ 15-20 篇真实内容页(不是空壳或 demo)
- ☐ 隐私政策/服务条款页(模板已内置 `/privacy-policy`、`/terms-of-service`)
- ☐ 站点可正常访问、无死链(`pnpm check-links` 过)

申请:[AdSense](https://adsense.google.com) → Add site → 等审核(几天到两周)。被拒就看原因(通常回「valueless content」),补 5-10 篇高质量攻略再申请。

通过后填 4 个 env(位置按[部署章](/zh/landing/docs/deploy-and-get-indexed)的二选一):

| 变量 | 值 |
|---|---|
| `PUBLIC_ADSENSE_CLIENT` | Publisher ID(`ca-pub-…`) |
| `PUBLIC_ADSENSE_SLOT_STICKY` | 底部粘性广告位 ID |
| `PUBLIC_ADSENSE_SLOT_SIDEBAR` | 侧栏广告位 ID |
| `PUBLIC_ADSENSE_SLOT_INCONTENT` | 文内广告位 ID |

模板契约:**任一为空,对应广告位不渲染**——所以你可以先只开文内位,逐步放量。广告组件懒加载,不影响 Lighthouse 分数(开箱 4×100 是契约)。收入 100% 归你,无平台抽成。

## 可选集成:评论与统计

**Giscus 评论**(GitHub Discussions 承载):giscus.app 按引导配置你的仓库,拿 4 个值填 env——`PUBLIC_GISCUS_REPO` / `PUBLIC_GISCUS_REPO_ID` / `PUBLIC_GISCUS_CATEGORY` / `PUBLIC_GISCUS_CATEGORY_ID`。任一为空评论不渲染。详见 [docs/comments.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/comments.md)。

**统计二选一**(也可都开):

| 方案 | env | 特点 |
|---|---|---|
| Cloudflare Web Analytics | `PUBLIC_CF_BEACON_TOKEN` | 无 cookie、自动隐私友好 |
| Google Analytics 4 | `PUBLIC_GA_ID` | 搜索词/漏斗分析强;配合 cookie consent 门控 |

**AI 搜索可见性**:站内 `/llms.txt` 自动列出全部默认语言文章,ChatGPT/Perplexity 等 AI 引擎靠它发现和引用你的内容;无需配置,验证 `curl https://你的域名/llms.txt` 即可。

## 每周一 30 分钟:运营 SOP

固定节奏是保鲜的唯一秘诀——过期内容在 Google 眼里等于死站。

### 1. 跑新鲜度审计并转成行动清单(15 分钟)

```bash
pnpm refresh-audit
```

判定规则:P0 = codes 页超过 7 天未更(30 天升级);P1 = bosses/tier-list 分类的文章超过 90 天未更(这两类过时会触发页面上的过期横幅,其他分类不产生 P1)。

> 上游仓库的 **Content freshness audit** 定时工作流(每周一自动跑审计并开 issue)**默认只在 AnvilWiki 上游生效**,fork 不会收到自动 issue——fork 用户每周本地跑一次 `pnpm refresh-audit` 即可;想开启自动 issue,删掉 `.github/workflows/content-pipeline.yml` 里 job 的 `if: github.repository == ...` 条件。

把报告喂给 AI 转成行动清单:

```text
下面是我的 pnpm refresh-audit 报告:
<粘贴报告>
把 P0/P1 转成可执行清单:
1. 需要我提供新数据的页面 → 逐页列出具体要什么(最新码列表/新版本机制改动)
2. 我确认内容仍准确、只需刷新的页面 → 把 lastModified 更新为今天
3. gameVersion 落后的页面单独列出
不许自行修改任何内容事实。以复选框清单输出。
```

### 2. codes 页更新(10 分钟)

收集新码/过期码(官方社媒/Discord),然后:

支持技能的工具直接:

```text
/anvil-update-codes 新码:<code列表>;已确认过期:<code列表>
```

裸提示词版:

```text
更新 src/content/wiki/en/codes/ 下的 codes 文章:新码追加到 frontmatter active 最前;
过期码 status 改 expired(保留不删除);lastModified 改今天;title/summary 中码数量与年月同步;
若存在其他语言版,同步数据(code 字段不译,reward 等文案译)。
写完运行 pnpm check-content && pnpm build,全绿才算完成。
```

### 3. 收尾(5 分钟)

`git push`(build 自动校验)→ 看 GA/GSC 搜索词 → 挑 1-2 个上升词定下周产页主题。

## 每月一次

```bash
pnpm check-i18n --strict   # 多语言覆盖率(有翻译站才需要)
git fetch upstream && git merge upstream/main   # 同步上游(见开发手册·同步章)
```

- AdSense 报表复盘:哪些页型 RPM 高(tier list/codes 通常最高)→ 下月多产
- GSC 性能报告:点击上涨的查询词 → 加深对应内容

## SEO 体检提示词(季度或流量异常时)

```text
对本站做 SEO 体检,只读不改:
1. SITE_URL(wrangler.toml [vars] 或 .env)含 https:// 且为正式域名
2. 全部文章 title≤80、description 40–165、summary 为直答(列违规清单)
3. og:image/twitter:image 为绝对路径
4. noindex 是否误用
5. 运行 pnpm check-sitemap;build 后运行 pnpm check-links,报告非 200/死链
6. 多语言 hreflang 覆盖是否完整
输出问题表:文件/问题/建议修法,经我确认后再改。
```

## 预期管理

- 黄金窗口是游戏爆发后 2-8 周:窗口内 Google 逐步给排名,第 1-2 周收入为 0 是正常的
- 收入公式 ≈ 页面数 × 排名 × RPM:前 30 天拼页面数,之后拼排名(保鲜+内链)
- 一个站做成后,第 2 个站的边际成本极低(选品→建站→产页全套 SOP 你已经走完一遍)

> **✅ 验收(运营节奏已建立)**
> - 命令:`pnpm refresh-audit` 输出无 P0(codes 全部 7 天内)
> - 页面:AdSense 广告位线上渲染(若已配置)
> - ☐ 连续 3 周在同一时间点完成周 SOP
> - ☐ GA 或 CF Analytics 至少一个已接入并能看搜索词

## 学完之后

三条路:**回到周节奏持续运营**;**进[开发手册](/zh/landing/docs/architecture)深度定制你的站**;或者**把你的站提 PR 进 AnvilWiki 官网 Showcase**(改 `src/config/landing.ts` 的 showcase 数据),反哺模板社区。
