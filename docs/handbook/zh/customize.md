---
title: "定制扩展 SOP:分类、语言、主题与首页"
description: "加导航分类、用 new-locale 脚手架加语言、翻译文章与 UI、换主题色、改写首页文案——每步的命令、三处一致检查,以及配套的 AI 提示词模板。"
manual: dev
order: 2
icon: lucide:palette
tldr: "加分类=三处一致(navigation.ts + locale JSON + 内容目录);加语言=先跑 pnpm new-locale 再让 AI 翻译 JSON 与文章;主题色只改 globals.css 4 行;首页文案全在 locale JSON 的 home.* 段。每步都有对应提示词让 AI 代劳。"
updated: 2026-08-16
---

## 加一个导航分类(10 分钟)

以加 `weapons` 为例,三处一致缺一不可:

```bash
# 1. 内容目录(建骨架文章,否则列表页空)
mkdir -p src/content/wiki/en/weapons
# 创建第一篇文章(或用 /anvil-new-article)

# 2. navigation.ts:NAVIGATION_CONFIG 加 { key: 'weapons', icon: 'lucide:sword' }

# 3. src/locales/en.json:nav.weapons + overview.weapons(列表页标题/描述)
```

然后 `pnpm check-config` 验证三处一致,`pnpm build` 验证 schema。其他语言 JSON 同步加 key(缺 key 运行时回退英文,但 `pnpm check-i18n` 会列出来)。

让 AI 代劳:

```text
给站点新增分类 weapons(武器)。三处一致地改:
1. src/config/navigation.ts 加 { key: 'weapons', icon: 'lucide:sword' }(按现有条目风格)
2. src/locales/en.json 加 nav.weapons 和 overview.weapons(按现有分类的文案风格)
3. src/content/wiki/en/weapons/ 建一篇骨架文章(frontmatter 合规,draft: true)
已有语言的其他 JSON 同步加 key。写完运行 pnpm check-config && pnpm build,全绿才算完成。
```

## 加一种语言(30 分钟)

三处一致:`src/i18n/routing.ts` 的 `locales` = `src/locales/*.json` = `src/content/<locale>/`。

```bash
# 1. 脚手架(生成 JSON 骨架 + 内容目录)
pnpm new-locale
# 按提示输入语言代码,如 ja

# 2. 让 AI 翻译 UI JSON
```

UI 翻译提示词:

```text
我已用 pnpm new-locale 新增 <语言代码>。请翻译该语言文件:
对照 src/locales/en.json 逐 key 翻译 src/locales/<语言代码>.json,
不新增不删除 key;分类 key 与 navigation.ts 保持一致。
运行 pnpm check-config && pnpm check-i18n 验证,全绿才算完成。
```

文章翻译提示词(逐篇):

```text
把 src/content/wiki/en/<category>/<slug>.mdx 翻译为 <目标语言>,
写入 src/content/wiki/<目标语言>/ 同路径。规则:只译 title/description/summary/正文;
slug、日期、内链路径、codes 的 code 字段不动;tags 无对应词则保留英文;
先列术语表保证全文一致。完成后运行
pnpm check-content && pnpm build && pnpm check-i18n,全绿才算完成。
```

**语言切换器只列出已有内容的语言**——新语言没文章时不会出现在切换器里(防 404)。

## 换主题色(2 分钟)

只改 `src/styles/globals.css` 顶部 4 行:

```css
:root { --brand: hsl(...); --brand-light: hsl(...); }
.dark { --brand: hsl(...); --brand-light: hsl(...); }
```

全站组件引用 `var(--brand)`,不许硬编码 hex。十六进制转 HSL:`pnpm apply-template` 的主题色步骤会自动转,或任意在线工具。fork 时直接用 CLI 一步到位(建站章)。

## 改首页文案与模块

首页全部由 `src/locales/<locale>.json` 的 `home.*` 段驱动(hero/start/explore/faq/updates),改文案不动组件。让 AI 出稿:

```text
改写首页文案。游戏:<游戏名>;卖点:<一句话>;目标玩家:<描述>。
只改 src/locales/ 的站点/首页文案字段(site.ts 与 home.*),不动组件代码;
每条给 3 个版本供我选,长度与现字段相近(避免破坏布局)。
选定后替换并运行 pnpm build 验证,全绿才算完成。
```

模块顺序/增减属 Config 层结构调整,参考 [docs/apply-template.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md) 的首页 preset 说明(codes 型/guides 型)。

## 扩展 frontmatter 字段(高级)

给文章加结构化数据(如新数据卡):`src/content.config.ts` 加 Zod 字段 → 组件消费 → `pnpm build` 校验。字段**只增不改名**(向后兼容承诺,旧文章永远能构建)。加完让 AI 按新字段产页,把字段说明写进提示词的【要求】段。

> **✅ 验收(全部成立才算完成)**
> - 命令:`pnpm check-config && pnpm check-i18n && pnpm build` → 全绿
> - 页面:新分类/新语言在导航与语言切换器可见,列表页非空
> - ☐ 新增 key 的翻译已补(check-i18n 无缺项)
> - ☐ 主题色改动后,亮/暗两种模式都检查过对比度

## 下一步

广告、评论、统计、CI——[集成与工程章](/landing/docs/integrations)给出全部 env 的门控机制和配置全表。
