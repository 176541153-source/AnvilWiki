---
title: "首日 10 页:和 AI 对话完成内容生产"
description: "用可复制的提示词让 AI 产出通过构建校验的攻略页、codes 页和 tier list,含素材喂法、逐篇验收三件套、以及绝对不能让 AI 做的事。"
manual: learn
order: 3
icon: lucide:bot
tldr: "打开仓库对 AI 说「根据这些要点写一篇攻略」,它会自动加载仓库的内容规范并产出通过 pnpm check-content && pnpm build 的 MDX 页面。关键纪律:素材是提示词的第一公民、每篇独立验证、缺数据标 [待补充] 而不是编造、未验证内容加 draft: true。"
updated: 2026-08-16
---

## 这套工作流的前提

用 ZCode / Claude Code / Codex / Cursor **打开你的仓库根目录**再对话。AI 会自动加载:

- `AGENTS.md`——内容硬规则(frontmatter 字段约束、组件词汇表、验证命令)
- `.agent/skills/`——3 个技能(Agent Skills 开放标准,支持的工具自动发现)
- `src/content.config.ts`——Zod schema,frontmatter 写错构建直接失败

有技能的工具优先用斜杠命令(规范和验证已固化):`/anvil-new-article`(任意素材产页)、`/anvil-update-codes`(码更新)、`/anvil-refresh`(新鲜度巡检)。下面给的裸提示词是无技能环境的等价物。

**核心纪律:素材是提示词的第一公民。** 空泛指令("写篇好攻略")会逼 AI 编造。有几分素材写几分内容,缺的让 AI 列清单问你。

## 提示词一:单篇攻略(口述要点 → 文章)

玩法:自己玩 1 小时,边玩边记要点(机制、数值、走位),哪怕只是碎片笔记。然后:

```text
把下面的要点写成一篇攻略页(支持技能的工具可直接用 /anvil-new-article)。
【素材】
游戏/Boss:<名称>
要点:<口述笔记、机制观察、数值——有几分写几分>
【要求】
按 AGENTS.md 内容规范,先读 docs/content-format.md 和 src/content.config.ts。
frontmatter:title≤80 字符含游戏名;description 40–165 字符;summary 40–60 词直答;
category 用 navigation.ts 已有 key;tags 复用现有词;未验证内容加 draft: true。
正文:不写 H1;H2 问题式且首段直接回答;数据进表格;用 Callout/Accordion/StatBar 组件。
禁止编造数值——缺的数据写 [待补充] 并单独列清单问我。
写完运行 pnpm check-content && pnpm build,两者全绿才算完成;失败修复后重跑。
```

末尾那句**验证条款**是模板的一部分:会写文件的提示词必须内嵌它,AI 产出后自跑门禁,全绿才算交付。

## 提示词二:codes 页首建(兑换码清单 → 结构化页)

codes 页是流量最高的页面类型。兑换码数据**只能来自你提供的清单**:

```text
为 <游戏名> 创建 codes 页(category: codes,slug: all-codes)。
兑换码只允许来自下面清单,一个都不许编造或"推测":
<code | 奖励 | 到期日 | 来源>
数据全部写入 frontmatter codes 数组(code/reward/status/expiryDate/source),
正文写 how to redeem 步骤 + FAQ(H2 问题式),title 含年月。
写完运行 pnpm check-content && pnpm build,全绿才算完成。
```

清单从哪来:官方社媒/Discord/开发者直播。**一个编造的兑换码足以摧毁站点信任**——这是全手册最硬的红线。

## 提示词三:tier list(你的评价 → 排名页)

```text
用我的评价写一篇 tier list 页。
【素材】<角色/装备清单 + 我的排名理由>
要求:表格为主,每行一句结论性理由;争议排名用 Callout warn 注明版本敏感;
frontmatter 加 gameVersion;未实测对象标 [待补充] 或整篇 draft: true,不许编造。
写完运行 pnpm check-content && pnpm build,全绿才算完成。
```

## 逐篇验收(三件套)

**每篇独立过检,不要攒 10 篇一起验——批量 = 错误批量累积。**

> **✅ 验收(全部成立才算完成)**
> - 命令:`pnpm check-content && pnpm build` → 0 error
> - 页面:`pnpm dev` 打开该页 —— H1 与 frontmatter title 一致、Quick Answer 卡片显示、表格移动端可横滑
> - ☐ frontmatter 五项(title/description/category/tags/summary)对照 [docs/content-format.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/content-format.md) 字段表逐项过
> - ☐ AI 若列了「待补充清单」,你补数据后重跑验证

## 反模式清单(不要这样做)

1. **让 AI 编造兑换码/数值/掉落率。** 正确姿势:AI 列「待补充清单」向你要数据。
2. **一次产 10 篇不逐篇验证。**
3. **绕过 draft 流程。** 未验证内容必须 `draft: true`(dev 可见、build 排除),确认后再转正。
4. **发明新 category/tag。** 破坏三处一致性;tags 先复用现有词汇。
5. **让 AI 改组件代码来实现文案需求。** 文案走 config/locales,代码层 fork 后不该动。
6. **手改 dist/、跳过 git。** 产物目录不进版本库,一切改动走源文件 + commit。

## 多语言(可选,别在首日做)

英文站先跑通;想加语言时,翻译文章用开发手册[定制章](/zh/landing/docs/customize)的翻译提示词。

> **✅ 验收(本章整体)**
> - 站内有 8-10 篇通过构建的文章,demo 内容已清(`pnpm apply-template` 重跑选清空,或手动删 `src/content/wiki/en/` 下的 demo 文件)
> - `pnpm build` 全绿,`git log` 里每篇文章一个 commit(方便回滚)

## 下一步

内容就绪,该让 Google 看到它了。下一章:部署到 Cloudflare Pages(免费无限带宽)+ 上线第一天的 SEO 动作(GSC 验证、sitemap 提交、请求收录)。
