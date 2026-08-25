# 广告变现:什么时候接、钱怎么收

> 模板广告位的**接入操作**(AdSense 4 个环境变量、Cloudflare 里填哪里)见站内[学习手册 · 第 7 章「接广告,开始赚钱」](https://anvilwiki.pages.dev/zh/landing/docs/enable-ads)和 [deployment.md 环境变量清单](deployment.md#环境变量清单)。
> 本文解决另外两个实战问题:**什么时候把广告打开**(时机错了会掉排名),以及 **Adsterra 的钱怎么收回来**(USDT 与 Payoneer 两条收款路线)。

## 你的广告开关在哪(30 秒背景)

模板内置 3 个广告位(Sticky 粘底 / Sidebar 侧栏 / InContent 文中),由 `PUBLIC_ADSENSE_CLIENT` + 3 个 slot 环境变量控制,**留空 = 不渲染,默认全关**。这个"默认关"正是为下面的时机策略设计的——站可以先干净上线,时机到了再填变量打开。

想接 Adsterra(AdSense 之外的常用备选,审核快、门槛低):它的广告单元是一段独立脚本,在你自己的 fork 里粘到对应位置即可(比如粘进 `src/components/layout/BaseLayout.astro`,和接 [Clarity 跟踪代码](deployment.md#用-microsoft-clarity-看用户在你站点上干什么免费)同一位置、同一方法)。模板代码层不需要任何改动。

---

## 一、什么时候把广告打开(时机)

**核心结论:广告晚开一两天,收入少几十块;开早了,排名掉了损失的是整个站。**

1. **上线后先跑 1-2 天再接广告**。让 Google 第一次收录、第一批用户访问看到的是干净、快的页面——用户体验信号(Clarity 里能看到)直接影响排名,别在起跑线上赌。
2. **同类站原则:第一页的对手都没挂广告时,你也不挂。** 新游戏窗口期大家拼的是排名,排名没稳定前,别为一点广告费赌体验和排名。

> 实战案例:某站主关键词做到第一后马上加了 banner 广告,排名随后**持续下滑**;撤掉广告后排名恢复。广告是变现手段,不是起量手段——顺序别反了。

**开广告前的自查清单(全部满足再动手):**

- ☐ 上线 ≥ 1-2 天,且已被 Google 收录(GSC 能看到数据)
- ☐ 核心词排名稳定(进前 10,或在持续上升)
- ☐ 第一页的同类站已经在挂广告(对手先赚这个钱,说明生态成熟了)
- ☐ 广告位打开后 Lighthouse 仍然 ≥ 95(模板广告位是懒加载的,正常不影响)

开完之后,用 [Clarity 热力图](deployment.md#用-microsoft-clarity-看用户在你站点上干什么免费)盯一件事:**广告位有没有被点**。冷清就挪位置,别让它白占版面。

---

## 二、Adsterra 收款:两条路线

Adsterra 满 **$100** 起付。收款有两条常用路线,按你对加密货币的接受度选:

| 路线 | 门槛 | 到账形态 | 适合谁 |
| --- | --- | --- | --- |
| USDT(经 OKX) | 余额 ≥ $100 | 稳定币,交易所内换汇出金 | 有交易所账号、想快 |
| Payoneer(欧元账户 + wire transfer) | 余额 ≥ $100(需找客服调) | 直接到 Payoneer,再提现到银行卡 | 不想碰加密货币 |

### 路线一:USDT(OKX)

1. OKX App → **充值** → 选 **USDT** → 网络选 **TRC-20** → 复制充值地址(一串 `T` 开头的字符)
2. Adsterra 后台 → **Payouts** → 添加收款方式 → 选 **USDT (Tether, TRC-20)** → 粘贴地址 → 保存并设为默认
3. 余额 ≥ $100 后,在 Payouts 页发起提现申请,等审核打币(通常 1-2 个工作日)
4. USDT 到账 OKX 后,在交易所内卖出提现(换成人民币走 C2C/出金,按平台当时规则)

> ⚠️ 链上转账**不可逆**:Adsterra 提现网络和 OKX 充值地址网络必须是同一个(TRC-20 对 TRC-20),地址复制粘贴后逐位核对再提交。

### 路线二:Payoneer(欧元账户 + wire transfer)

Adsterra 的 wire transfer(电汇)默认最低支付额高于 $100,所以要找客服调到 $100。全程英文沟通,照抄话术即可:

1. 注册 [Payoneer](https://www.payoneer.com),开通**欧元(EUR)收款账户**,拿到它的银行账户信息(银行名、IBAN、SWIFT/BIC——在 Payoneer 后台「收款」→「全球付款服务」里)
2. Adsterra 后台 → **Payouts** → 收款方式选 **Wire transfer** → **全英文**填写 Payoneer 的 EUR 账户信息并保存
3. 找 Adsterra 客服(后台 ticket 或右下角 live chat)把最低支付额调到 $100,话术直接复制:

   ```text
   Hi, I've saved my wire transfer payout information with my Payoneer EUR receiving account. Could you please lower my minimum payout threshold to $100? Thank you!
   ```

4. 余额到 **$100** 后,再找客服**签一份 payout 协议**(客服会把协议发你,确认金额与账户信息),签完才能发起提现
5. 款项到 Payoneer 的 EUR 账户后,在 Payoneer 里提现到你的国内银行卡(按 Payoneer 当日汇率结汇)

### 怎么选

- 两边都注册也行(先跑通一条,另一条当备胎)——**不要**等余额攒到快 $100 才去开账户、调门槛,提前把步骤 1-3 做完。
- 提现费与汇率两家各有标准,以官方页面实时数字为准;大额收款前先用第一笔小额跑通全流程验证一遍。

## 下一步

- [deployment.md](deployment.md) 上线后的数据复盘指标 + Clarity 热力图(看广告位有没有被点)
- [seo.md](seo.md) 外链策略——和本文同一个原则:排名没起来前,先把内容和体验做好
- 回到 [文档中心](README.md)
