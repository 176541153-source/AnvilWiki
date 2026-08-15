---
name: anvil-update-codes
description: 更新游戏的兑换码页面——用户给一批新码(或来源链接/截图内容),自动更新 codes 文章的 CodeBlock 列表、过期分区、日期与 gameVersion。触发词:更新 codes / 新兑换码 / codes 过期了 / update codes。
---

# AnvilWiki 兑换码更新

codes 页是游戏 wiki 流量最高、时效性最强的页面。更新它的唯一原则:**只信用户给的数据,绝不编造或"推测"兑换码**——一个失效码直接损害站点信任。

## 工作流

### Step 1 — 定位目标文章

```bash
ls src/content/wiki/en/codes/   # 或用户指定的 locale
```

读现有文章,理解现有结构(Active 列表 / How to Redeem / Expired 列表)。

### Step 2 — 应用新数据

- 新码:新增 `<CodeBlock code="..." label="奖励描述" />`,放在 Active 区顶部
- 用户说"XX 过期了":把对应 CodeBlock 移到 Expired 区(灰色/删除线样式按文章现状),不删除(过期码保留是长尾 SEO 内容:"is CODE-123 still working")
- 更新 frontmatter:`lastModified: <今天>`;游戏有版本号就更新 `gameVersion`
- 若文章标题含年月(如 "All Working Codes (August 2026)"),跨月时同步更新 title 与 H2 月份
- `summary` 里的码数量/日期同步修正

### Step 3 — 多语言同步

若 `src/content/wiki/<locale>/codes/` 存在同名文章,同步数据(CodeBlock 的 code 不翻译,label 翻译)。

### Step 4 — 自检(必须执行)

```bash
pnpm check-content && pnpm build
```

### Step 5 — 汇报

新增 N 码 / 过期 M 码 / 文章路径,提醒用户:codes 类页面建议每周检查一次(90 天未更新的 codes 页会自动显示"可能过期"横幅,见 STALE_CATEGORIES)。
