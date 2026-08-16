---
title: "开发 2 · 定制手册:加栏目、加语言、换皮肤、改首页"
description: "四个最常见定制需求的分步操作:加导航栏目(三处一致)、加一种语言(脚手架+AI 翻译)、换主题色(8 行变量)、改首页文案(JSON 里的 home 段),每项配可复制的 AI 提示词。"
manual: dev
order: 2
icon: lucide:palette
tldr: "四个高频需求四个套路:加栏目=配置、语言 JSON、内容目录三处同时一致;加语言=先跑 pnpm new-locale 生成骨架,再让 AI 对照英文文件逐条翻译;换主题色=改 globals.css 顶部 8 行(亮暗两套一起,漏改会让文字色残留旧色相);改首页文案=只动语言 JSON 的 home 段,不碰组件。每步都有提示词让 AI 代劳,改完跑 pnpm check-config && pnpm build 验证。"
updated: 2026-08-17
---

## 你现在在哪,这章解决什么

店开起来之后你迟早会想:加个武器栏目、上个日语版、换个配色、改改首页话术。这章把这四件事各写成一个固定套路,照着做就不会错。

**这章是查询手册:你需要哪件事就翻哪一节,不用按顺序读。**

## 需求一:加一个导航栏目(如「武器」)

栏目的规矩你在架构章见过:**三处一致,缺一不可**。以加 `weapons` 为例:

```bash
# 1. 内容目录(先建目录,再放第一篇文章)
mkdir -p src/content/wiki/en/weapons

# 2. 配置:src/config/navigation.ts 里按现有条目的样子加
#    { key: 'weapons', icon: 'lucide:sword' }

# 3. 语言:src/locales/en.json 里加 nav.weapons(导航文字)
#    和 overview.weapons(列表页标题和简介)
```

然后 `pnpm check-config`(查三处一致)+ `pnpm build`(查格式)。其他语言的 JSON 也要加同样的 key(不加不会坏——界面会自动显示英文兜底——但 `pnpm check-i18n` 会列出来提醒你)。

让 AI 代劳(整段复制,改 `weapons` 为你的栏目名):

```text
给站点新增分类 weapons(武器)。三处一致地改:
1. src/config/navigation.ts 加 { key: 'weapons', icon: 'lucide:sword' }(按现有条目风格)
2. src/locales/en.json 加 nav.weapons 和 overview.weapons(按现有分类的文案风格)
3. src/content/wiki/en/weapons/ 建一篇骨架文章(frontmatter 合规,draft: true)
已有语言的其他 JSON 同步加 key。写完运行 pnpm check-config && pnpm build,全绿才算完成。
```

## 需求二:加一种语言(以日语为例)

语言的三处一致:语言列表配置 = 语言 JSON 文件 = 内容目录。

```bash
# 第 1 步:跑脚手架(会问你要语言代码,如 ja),生成 JSON 骨架和内容目录
pnpm new-locale
```

第 2 步,让 AI 把界面文字翻译掉(整段复制):

```text
我已用 pnpm new-locale 新增 <语言代码>。请翻译该语言文件:
对照 src/locales/en.json 逐 key 翻译 src/locales/<语言代码>.json,
不新增不删除 key;分类 key 与 navigation.ts 保持一致。
运行 pnpm check-config && pnpm check-i18n 验证,全绿才算完成。
```

第 3 步,翻译文章(一篇一篇来):

```text
把 src/content/wiki/en/<category>/<slug>.mdx 翻译为 <目标语言>,
写入 src/content/wiki/<目标语言>/ 同路径。规则:只译 title/description/summary/正文;
slug、日期、内链路径、codes 的 code 字段不动;tags 无对应词则保留英文;
先列术语表保证全文一致。完成后运行
pnpm check-content && pnpm build && pnpm check-i18n,全绿才算完成。
```

注意:兑换码本体(code 字段)永远不翻译,它是全球通用的字母数字。

**语言切换器只显示真的有内容的语言**——日语一篇都没写时,切换器不会出现日语,这防的是「点了进空白页」。

## 需求三:换主题色(5 分钟)

只改 `src/styles/globals.css` 顶部的 **8 行**(4 个变量 × 亮/暗两套):

```css
:root { --brand: hsl(...); --brand-light: hsl(...); --brand-h: ...; --brand-s: ...%; }
.dark { --brand: hsl(...); --brand-light: hsl(...); --brand-h: ...; --brand-s: ...%; }
```

为什么是 8 行一起换:文字安全色 `--brand-text` 是用 `--brand-h`(色相)和 `--brand-s`(饱和度)自动算的——只换前两个变量,文字色会残留旧色相,整站看起来「脏」。十六进制色号不会转 HSL?让 AI 转,或者跑 `pnpm apply-template` 的换色步骤(它 8 行全自动)。改完亮色暗色两种模式都看一眼对比度。

## 需求四:改首页文案

首页每一块文字(大标题、快速入口、精选、问答、更新日志)都住在语言 JSON 的 `home.*` 段——**改文案不动任何组件代码**。让 AI 出稿(整段复制):

```text
改写首页文案。游戏:<游戏名>;卖点:<一句话>;目标玩家:<描述>。
只改 src/locales/ 的站点/首页文案字段(site.ts 与 home.*),不动组件代码;
每条给 3 个版本供我选,长度与现字段相近(避免破坏布局)。
选定后替换并运行 pnpm build 验证,全绿才算完成。
```

「长度相近」这条是故意的:首页排版是按现有文字长度设计的,文案突然翻倍会把布局撑破。

## 进阶:给文章登记卡加新字段

想给文章挂新数据(比如新属性卡)?流程:`src/content.config.ts` 里加 Zod 字段 → 组件消费 → `pnpm build` 验证。铁律:**字段只加不改名**——改名等于废掉全站旧文章。加完字段,把字段规则写进产页提示词的【要求】段,AI 就会一直带上它。

## 卡住了怎么办

- **「check-config 报栏目不一致」**:它输出的提示会写明哪三处对不上,对着补齐即可。
- **「新语言的文章翻译完 build 挂了」**:九成是登记卡里某字段格式在翻译时被改坏(日期多了个句号之类),看 build 报错的具体文件行。
- **「换了颜色有些地方没变」**:八成只换了 4 行没换 8 行,或漏了 `.dark` 那套。

## ✅ 验收(按你做的需求勾选)

- ☐ 加栏目:`pnpm check-config && pnpm build` 全绿,新栏目出现在导航且列表非空
- ☐ 加语言:`pnpm check-i18n` 无缺项,语言切换器出现新语言
- ☐ 换主题色:亮/暗两种模式检查过,文字色没残留旧色
- ☐ 改文案:`pnpm build` 全绿,首页布局没被撑破

## 下一步

广告、评论、统计、CI 门禁、安全——[开发 3 · 集成与工程](/zh/landing/docs/integrations):全部开关变量的总表和背后的机制。
