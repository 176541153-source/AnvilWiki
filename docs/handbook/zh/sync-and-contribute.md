---
title: "同步上游与贡献回流:merge 策略与发版流程"
description: "fork 之后如何持续吸收上游新功能(Config/Content 冲突永远保留自己的),SemVer 版本策略与兼容性承诺,以及把改进贡献回 AnvilWiki 的完整流程。"
manual: dev
order: 4
icon: lucide:git-merge
tldr: "加 upstream remote 后定期 git merge upstream/main:Code 层冲突少,Config/Content 层冲突永远保留你自己的值。上游遵守 SemVer 兼容承诺(字段只增不改名、可选功能默认关闭)。想回流贡献:开 issue 讨论 → fork 分支 → CI 绿 → PR。"
updated: 2026-08-16
---

## 同步上游(每次 10 分钟)

```bash
# 1. 添加上游 remote(一次性)
git remote add upstream https://github.com/PNGTRID/AnvilWiki.git

# 2. 拉取并合并
git fetch upstream
git merge upstream/main

# 3. 冲突时:Config/Content 层永远保留你自己的值
#    (游戏名、主题色、文案、文章),只收上游 Code 层的改动

# 4. 验证三件套
pnpm check-config && pnpm typecheck && pnpm test
pnpm build && pnpm check-links
```

为什么 merge 通常很干净:上游新功能(组件/页面/脚本)几乎全落在 Code 层——正是你几乎不碰的层。冲突高发区(Config/Content)恰好是你「本来就该保留自己值」的区域。

**不想同步也完全没问题**:这是静态模板不是运行时依赖,你的 fork 冻结在某版本能永远跑。建议至少合并 PATCH(安全/bug 修复),`git cherry-pick` 挑选也行。

## 版本策略(SemVer)与兼容性承诺

| 版本位 | 含义 | 你的动作 |
|---|---|---|
| MAJOR(v2.0) | breaking change | 按 CHANGELOG 迁移说明操作 |
| MINOR(v1.10 → v1.11) | 新功能,默认关闭/向后兼容 | merge 后开箱行为不变,想要再开 |
| PATCH | bug 修复 | 直接 merge |

上游承诺(详见 [docs/staying-up-to-date.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/staying-up-to-date.md)):

- frontmatter 字段**只增不改名**,旧文章永远能构建
- 可选功能(广告/评论/赞助/分析)全部 env 门控 + 默认关闭,新版本不会让它们自动开启
- locale JSON 缺 key 运行时回退英文;`pnpm check-i18n` 列出上游新增的待翻译 key

## 每次同步后的检查清单

```bash
pnpm check-config    # 配置三处一致
pnpm check-i18n      # 上游新增 UI key → 待翻译清单
pnpm typecheck && pnpm test && pnpm build
pnpm check-links     # dist/ 内链全检
```

## 贡献回流(把你的改进变成上游功能)

1. **先开 issue 讨论**:描述场景与方案(避免和 roadmap 撞车;重大设计看 [docs/PRD.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/PRD.md) 是否已有 ADR)
2. fork 分支开发,遵守工程约束(文案走 JSON/主题色走 var/零 JS runtime)
3. 自验证:`pnpm lint && pnpm typecheck && pnpm test && pnpm build`
4. PR 描述附验证输出;CI 绿后等待 review
5. 组件/脚本类贡献请同步补文档(docs/)和测试(纯函数下沉 `src/lib/` + vitest)

**用 AnvilWiki 上线了站点?** 提 PR 把它加进官网 Showcase(改 `src/config/landing.ts` 的 showcase 数据)——真实案例是这个模板最有力的证明。

## 发版流程(模板维护者视角)

给模板本身发一个新版本的完整流程(贡献者了解即可,详见 [docs/development.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/development.md)):

```
1. 全部改动合入 main,验证清单全绿
2. 版本号三处同步:package.json / landing.ts PROJECT_VERSION / 中英发布公告文案
3. CHANGELOG.md:Unreleased 段落改日期标题 + compare 链接
4. docs/PRD.md §14.2 路线图标 ✅
5. commit:feat/fix 一个 + git commit --allow-empty -m "chore(release): vX.Y.Z" 一个
6. git push(CI 绿 + Cloudflare Pages 自动部署)
7. gh release create vX.Y.Z --latest --notes "<中英摘要>"
```

> **✅ 验收(全部成立才算完成)**
> - 命令:merge 上游后验证三件套全绿
> - ☐ Config 层冲突全部保留了自己的值(逐个 diff 确认)
> - ☐ check-i18n 列出的新增 key 已翻译或明确接受英文回退

## 开发手册完结

三层架构 → 定制 → 集成 → 同步,你现在对这套模板的掌控是「维护者级」的。回到[学习手册](/landing/docs/monetize-and-grow)的周节奏把站运营好,或开始下一个站的选品。
