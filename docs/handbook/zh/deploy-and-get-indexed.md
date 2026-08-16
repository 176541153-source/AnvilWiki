---
title: "第 4 章 · 让全世界看到你的站:上架 + 让 Google 认识你"
description: "把网站推上 GitHub、连上 Cloudflare 免费货架拿到网址,然后做三件让 Google 开始收录的事:验证站长后台、递交目录页、请求收录。全程免费。"
manual: learn
order: 4
icon: lucide:cloud
tldr: "把电脑里的网站文件推到 GitHub,再在 Cloudflare 点几下连接它——两三分钟后你就有了一个全世界能访问的免费网址。当天再做三件事:注册 Google 站长后台、递交网站目录页(sitemap)、给最重要的几个网址点「请求收录」。做完这些,Google 就开始把你的页面收进它的书架。"
updated: 2026-08-17
---

## 你现在在哪,这章解决什么

10 篇内容躺在你的电脑里——但玩家访问不到,Google 也不知道你的存在。就像你印好了一本书,还没放上任何书店的货架。

这一章干两件事:先把书**上架**(Cloudflare 免费货架,无限流量,不花钱);再让 **Google 管理员登记你的书**(开始收录,这是流量的起点)。

## 这章做完你会得到

- 一个全世界都能打开的网址(先免费域名,之后可换自己的)
- Google 站长后台(GSC)开通,网站目录页已递交

## 先认识几个词

- **部署**:把网站文件放到大家都能访问的服务器上。这里用的是 Cloudflare Pages,免费额度对新手几乎无限。
- **sitemap**:自动生成的「网站目录页」,专门递给 Google,告诉它你有哪些页面、哪些最近更新过。不用你做,模板自动生成。
- **GSC(Google Search Console)**:Google 发成绩单的后台——谁搜了什么词、点没点你的站,以后都在这里看。
- **收录**:Google 把你的页面收进它的「图书馆」。收录了才有排名,有排名才有流量。

## 第一幕:上架(约 15 分钟)

### 第 1 步:把文件推上 GitHub

**做什么**:你电脑里的网站文件,要让 Cloudflare 能拿到,得先放到 GitHub。
**怎么做**:终端(在 AnvilWiki 文件夹里)依次输入:

```bash
git add .
git commit -m "我的游戏 wiki 第一版"
git push
```

**你会看到**:第一次 push 会弹出 GitHub 登录窗口,登录你的账号,然后终端显示上传进度。
**确认做对了**:刷新你的 GitHub 仓库网页,能看到 `docs`、`src` 这些文件夹。

### 第 2 步:连接 Cloudflare 货架

**做什么**:告诉 Cloudflare「我的仓库在这,每次我更新,你自动重新上架」。
**怎么做**:

1. 注册/登录 [dash.cloudflare.com](https://dash.cloudflare.com)(免费)。
2. 左侧选 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 授权 GitHub,选中你的 AnvilWiki 仓库,点 **Begin setup**。
4. 构建设置照抄:

| 它问什么 | 你填什么 |
|---|---|
| Project name | 随意,比如你的游戏名(它会成为网址的一部分) |
| Production branch | `main` |
| Framework preset | Astro(一般会自动识别) |
| Build command | `pnpm build` |
| Build output directory | `dist` |

5. 在 **Environment variables** 区添加一个变量:名字 `NODE_VERSION`,值 `22`。
6. 点 **Save and Deploy**。

**你会看到**:构建进度跑 2 到 3 分钟,最后出现一个 `https://项目名.pages.dev` 网址。
**确认做对了**:点开那个网址,看到你的游戏站——从现在起,全世界都能访问它。

### 第 3 步:处理一个新手大坑(设置认谁的问题)

**做什么**:删掉一个叫 `wrangler.toml` 的文件。原因一句话:网站的设置有两个登记处——仓库里的这个文件,和 Cloudflare 网页上的设置页。**文件还在,网页设置就全部无效**。新手直接删文件,以后只用网页,清爽不踩坑。
**怎么做**:终端输入:

```bash
git rm wrangler.toml
git commit -m "remove wrangler.toml"
git push
```

**你会看到**:GitHub 仓库文件列表里,`wrangler.toml` 消失了;Cloudflare 自动重新部署一次。
**确认做对了**:Cloudflare → 你的项目 → **Settings** → **Variables and Secrets**,能看到 `NODE_VERSION = 22`(第 2 步加的,文件删掉后它才真正生效)。以后开广告、统计,都在这个页面加变量。

> 进阶者备注:想保留这个文件、把设置记在仓库里也可以,但 `NODE_VERSION = "22"` 等所有变量就必须写进文件的 `[vars]` 段,网页设置照样无效——细节见开发手册「集成」章。新手别碰,删文件就好。

### 第 4 步:买自己的域名(可以先跳过,赚钱前需要)

**做什么**:把 `项目名.pages.dev` 换成自己的门牌,如 `你的游戏-wiki.com`。**AdSense 广告审核基本要求自有域名**,所以赚钱前必须买(一年几十块)。
**怎么做**:在 [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)(按成本价卖,不赚差价)或 [Porkbun](https://porkbun.com) 等注册商搜一个 `.com` / `.wiki` 域名买下;然后 Cloudflare Pages → 你的项目 → **Custom domains** → Set up,按提示把域名指过来(DNS 在 Cloudflare 管的话全程点下一步)。
**你会看到**:几分钟后(最长几小时),你的域名打开就是你的站。
**确认做对了**:用自己的域名能打开网站后,把第 2 章配置里的 Domain 和 Cloudflare 的 `SITE_URL` 变量都改成这个域名(`https://` 开头,不能少),重新部署。

## 第二幕:让 Google 认识你(当天 20 分钟)

### 第 1 步:注册 Google 站长后台(GSC)

**做什么**:拿到 Google 发给你的「店铺营业登记」。
**怎么做**:打开 [search.google.com/search-console](https://search.google.com/search-console) → 登录 Google 账号 → **添加资源**。新手选 **网址前缀** 类型,填你的 `https://项目名.pages.dev`(或你的域名),验证方式选 **HTML 标记**,Google 会给你一串代码——不用自己贴,把标记里 `content="一串字母"` 的那串字母填到 Cloudflare 的变量里:名字 `PUBLIC_GSC_VERIFICATION`,值就是那串字母。保存并重新部署,回 GSC 点「验证」。
**你会看到**:GSC 显示「已拥有所有权」。
**确认做对了**:GSC 左侧能点开「效果」等页面。

### 第 2 步:递交网站目录页(sitemap)

**做什么**:把模板自动生成的目录页交给 Google。
**怎么做**:GSC 左侧菜单 → **站点地图** → 输入框里填 `sitemap-index.xml` → 点**提交**。
**你会看到**:状态栏显示「成功」。
**确认做对了**:过一两天回到这个页面,「已发现的网址数」开始大于 0。

### 第 3 步:给重点页面点「请求收录」

**做什么**:新站的页面 Google 可能几周才自己爬到,主动催一下最重要的几篇。
**怎么做**:GSC 顶部的检查框,粘贴你的兑换码页完整网址,回车 → 点**请求编入索引**。把最重要的 5 到 10 个网址挨个来一遍(兑换码页第一个)。
**你会看到**:每个网址显示「已请求编入索引」。

另外两件自动发生的事,不用你动手:Cloudflare 每次部署会自动通知 Bing 等搜索引擎(叫 IndexNow,相当于自动催 Bing);你的 `/llms.txt` 页面会告诉 ChatGPT 这类 AI 引擎你有哪些内容。

### 上线后自检(可选,5 分钟)

```bash
pnpm build
BASE_URL=https://你的网址 pnpm check-sitemap
pnpm check-links
```

三条跑完,网址全部 200(打得开)、站内链接无死链,就是健康状态。

## 卡住了怎么办

- **「Cloudflare 构建失败」**:点进那次部署看日志最后一行。九成是这两类:环境变量没配好(回第 2 步查 NODE_VERSION),或 `SITE_URL` 没带 `https://`。
- **「我在 Cloudflare 网页改了设置却没生效」**:回忆第 3 步——`wrangler.toml` 删了吗?它在,网页设置就无效。
- **「域名打开了但样式乱了/图挂了」**:九成是 `SITE_URL` 还没改成新域名。改成 `https://你的域名` 再部署。
- **「GSC 验证不通过」**:确认 `PUBLIC_GSC_VERIFICATION` 的值是标记里 content 引号内的那串字母(不带引号),保存后确实重新部署过。

## ✅ 验收(全部成立才算完成)

- 你的网址,手机流量(不用 WiFi 也行)能打开,页面正常
- GSC 已验证、sitemap 已提交、至少 5 个网址点了请求收录
- ☐ `wrangler.toml` 已删除,以后所有设置都在 Cloudflare 网页加
- ☐ 有域名的:`SITE_URL` 已改成 `https://你的域名`

## 下一步

站上线了,Google 开始爬了——但流量变成钱,还差两步:接广告,和每周保鲜。最后一章,把店真正开张。[去第 5 章 · 接广告,让站一直赚钱](/zh/landing/docs/monetize-and-grow)
