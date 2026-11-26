# TypeMatchup — 每周 SEO 复盘

## 取数规则

- **唯一指标来源：** Google Search Console → 搜索效果；可使用已经连接的官方 GSC 数据接口。
- **对比窗口：** 最近两个连续、完整的 7 天区间（以 GSC 实际可提供的完整数据为准），注明日期与站点资源 `https://www.typematchup.org/`。
- **最小维度：** 先按「页面」，再按「页面 + 查询词」分别读取曝光、点击、CTR、平均排名；不能混用两种口径。
- **基础公式：** CTR = 点击 ÷ 曝光 × 100%；展示量为零时写“无定义”。
- **影响因素：** Google 重新抓取时间不确定；检查国家、设备、搜索词结构、SERP 形态和竞争变化。未经控制的前后对比只能说明相关变化，不能证明因果。
- **数据缺失：** 写“读不到”而不是估算；不把 GSC 曝光量当成访问人数。

## 本轮实验：EXP-20261111-01

- 上线：2026-11-11；[合并记录 PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)
- 监控页面：
  - https://www.typematchup.org/types/ghost
  - https://www.typematchup.org/types/poison
  - https://www.typematchup.org/types/dark
  - https://www.typematchup.org/types/psychic
- 重点查询：`ghost type weakness`、`ghost weakness`、`poison type weakness`、`poison weakness`、`dark type weakness`、`dark weakness`、`psychic type weakness`、`psychic weakness`、`what is psychic weak to`。
- 既有周报任务：TypeMatchup 四页 SEO 周报；**这里是版本化记录模板**，不代表自动化任务会自动把结果写回仓库。

## 2026-11-16 首次复盘模板（结果待取数）

**本周完整区间：** 待取数

**上周完整区间：** 待取数

| 页面 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 | 判断 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Ghost | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | ⏳ 待观察 |
| Poison | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | ⏳ 待观察 |
| Dark | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | ⏳ 待观察 |
| Psychic | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | 待取数 | ⏳ 待观察 |

### 单词与落地页验证

| 日期区间 | 查询 | 页面 | 曝光 | 点击 | CTR | 平均排名 | 来源说明 |
|---|---|---|---:|---:|---:|---:|---|
| 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | GSC → 搜索效果 → 查询 + 页面 |

### 本周发现、决策与外部变量

- **观察到的变化：** 待取数
- **可能的解释：** 未判定
- **是否能归因于本次变更：** 尚不能
- **决策：** ⏳ 待观察
- **下一次复盘：** 待记录

---

每周在文末追加一段新记录；不要覆盖历史基线，也不要把一周的波动直接写成“优化成功”。

---

<!-- GSC_WEEKLY_REPORT:2026-11-02:2026-11-08 -->
## GSC 自动复盘｜2026-11-02 至 2026-11-08

- **本期：** 2026-11-02 至 2026-11-08（周一至周日）
- **对比期：** 2026-10-26 至 2026-11-01（周一至周日）
- **来源：** Google Search Console 官方 Search Analytics API；资源 `https://www.typematchup.org/`；搜索类型 `web`；`dataState=final`；未额外筛选国家或设备
- **口径：** 页面为 `page` 精确匹配；查询词为 `page + query` 精确匹配。未返回不等于零；不等于所有查询的完整覆盖。

| 页面 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 | 观察 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [`ghost`](https://www.typematchup.org/types/ghost) | 38394 | 45207 | 17 | 22 | 0.044% | 0.049% | 6.97 | 6.80 | 曝光 -6,813；点击 -5；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`poison`](https://www.typematchup.org/types/poison) | 12410 | 20095 | 3 | 9 | 0.024% | 0.045% | 7.96 | 7.63 | 曝光 -7,685；点击 -6；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`dark`](https://www.typematchup.org/types/dark) | 13627 | 21411 | 5 | 9 | 0.037% | 0.042% | 7.23 | 6.62 | 曝光 -7,784；点击 -4；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`psychic`](https://www.typematchup.org/types/psychic) | 19508 | 18752 | 5 | 9 | 0.026% | 0.048% | 6.99 | 7.04 | 曝光 +756；点击 -4；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |

### 核心查询（分别按页面与查询词精确筛选）

| 页面 | 查询词 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ghost | `ghost type weakness` | 5287 | 5667 | 2 | 0 | 0.038% | 0.000% | 6.95 | 6.76 |
| ghost | `ghost weakness` | 2313 | 2632 | 1 | 0 | 0.043% | 0.000% | 7.71 | 7.03 |
| poison | `poison type weakness` | 1044 | 2934 | 0 | 0 | 0.000% | 0.000% | 8.21 | 7.50 |
| poison | `poison weakness` | 650 | 2725 | 0 | 0 | 0.000% | 0.000% | 8.81 | 7.27 |
| dark | `dark type weakness` | 2984 | 6245 | 1 | 0 | 0.034% | 0.000% | 6.60 | 6.66 |
| dark | `dark weakness` | 885 | 1775 | 0 | 0 | 0.000% | 0.000% | 6.44 | 5.95 |
| psychic | `psychic type weakness` | 3273 | 2947 | 0 | 2 | 0.000% | 0.068% | 7.45 | 7.70 |
| psychic | `psychic weakness` | 3375 | 3001 | 0 | 0 | 0.000% | 0.000% | 6.44 | 6.96 |
| psychic | `what is psychic weak to` | 999 | 911 | 0 | 0 | 0.000% | 0.000% | 6.38 | 6.19 |

**实验状态：** ⏳ EXP-20261111-01 继续观察（[PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)，2026-11-11 上线）。
**解释：** 以上是 GSC 观察性数据，不能直接证明变更导致了变化；同周 SERP、搜索需求、抓取时间等因素未受到控制。

---

<!-- GSC_WEEKLY_REPORT:2026-11-09:2026-11-15 -->
## GSC 自动复盘｜2026-11-09 至 2026-11-15

- **本期：** 2026-11-09 至 2026-11-15（周一至周日）
- **对比期：** 2026-11-02 至 2026-11-08（周一至周日）
- **来源：** Google Search Console 官方 Search Analytics API；资源 `https://www.typematchup.org/`；搜索类型 `web`；`dataState=final`；未额外筛选国家或设备
- **口径：** 页面为 `page` 精确匹配；查询词为 `page + query` 精确匹配。未返回不等于零；不等于所有查询的完整覆盖。

| 页面 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 | 观察 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [`ghost`](https://www.typematchup.org/types/ghost) | 31363 | 38394 | 14 | 17 | 0.045% | 0.044% | 7.56 | 6.97 | 曝光 -7,031；点击 -3；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`poison`](https://www.typematchup.org/types/poison) | 11048 | 12410 | 2 | 3 | 0.018% | 0.024% | 8.19 | 7.96 | 曝光 -1,362；点击 -1；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`dark`](https://www.typematchup.org/types/dark) | 17101 | 13627 | 1 | 5 | 0.006% | 0.037% | 7.33 | 7.23 | 曝光 +3,474；点击 -4；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`psychic`](https://www.typematchup.org/types/psychic) | 13598 | 19508 | 6 | 5 | 0.044% | 0.026% | 7.78 | 6.99 | 曝光 -5,910；点击 +1；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |

### 核心查询（分别按页面与查询词精确筛选）

| 页面 | 查询词 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ghost | `ghost type weakness` | 4327 | 5287 | 0 | 2 | 0.000% | 0.038% | 7.82 | 6.95 |
| ghost | `ghost weakness` | 2083 | 2313 | 0 | 1 | 0.000% | 0.043% | 8.24 | 7.71 |
| poison | `poison type weakness` | 895 | 1044 | 0 | 0 | 0.000% | 0.000% | 8.36 | 8.21 |
| poison | `poison weakness` | 621 | 650 | 0 | 0 | 0.000% | 0.000% | 9.29 | 8.81 |
| dark | `dark type weakness` | 3140 | 2984 | 0 | 1 | 0.000% | 0.034% | 6.66 | 6.60 |
| dark | `dark weakness` | 858 | 885 | 0 | 0 | 0.000% | 0.000% | 6.92 | 6.44 |
| psychic | `psychic type weakness` | 2238 | 3273 | 0 | 0 | 0.000% | 0.000% | 7.39 | 7.45 |
| psychic | `psychic weakness` | 2350 | 3375 | 2 | 0 | 0.085% | 0.000% | 6.97 | 6.44 |
| psychic | `what is psychic weak to` | 324 | 999 | 0 | 0 | 0.000% | 0.000% | 7.30 | 6.38 |

**实验状态：** ⏳ EXP-20261111-01 继续观察（[PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)，2026-11-11 上线）。
**解释：** 以上是 GSC 观察性数据，不能直接证明变更导致了变化；同周 SERP、搜索需求、抓取时间等因素未受到控制。

---

<!-- GSC_WEEKLY_REPORT:2026-11-16:2026-11-22 -->
## GSC 自动复盘｜2026-11-16 至 2026-11-22

- **本期：** 2026-11-16 至 2026-11-22（周一至周日）
- **对比期：** 2026-11-09 至 2026-11-15（周一至周日）
- **来源：** Google Search Console 官方 Search Analytics API；资源 `https://www.typematchup.org/`；搜索类型 `web`；`dataState=final`；未额外筛选国家或设备
- **口径：** 页面为 `page` 精确匹配；查询词为 `page + query` 精确匹配。未返回不等于零；不等于所有查询的完整覆盖。

| 页面 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 | 观察 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [`ghost`](https://www.typematchup.org/types/ghost) | 17777 | 31363 | 13 | 14 | 0.073% | 0.045% | 7.56 | 7.56 | 曝光 -13,586；点击 -1；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`poison`](https://www.typematchup.org/types/poison) | 6451 | 11048 | 1 | 2 | 0.016% | 0.018% | 8.66 | 8.19 | 曝光 -4,597；点击 -1；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`dark`](https://www.typematchup.org/types/dark) | 26691 | 17101 | 7 | 1 | 0.026% | 0.006% | 6.99 | 7.33 | 曝光 +9,590；点击 +6；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |
| [`psychic`](https://www.typematchup.org/types/psychic) | 17508 | 13598 | 6 | 6 | 0.034% | 0.044% | 8.16 | 7.78 | 曝光 +3,910；点击 +0；排名/CTR 变化仍需结合搜索需求与 SERP 判断 |

### 核心查询（分别按页面与查询词精确筛选）

| 页面 | 查询词 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ghost | `ghost type weakness` | 2788 | 4327 | 1 | 0 | 0.036% | 0.000% | 6.44 | 7.82 |
| ghost | `ghost weakness` | 1004 | 2083 | 1 | 0 | 0.100% | 0.000% | 8.76 | 8.24 |
| poison | `poison type weakness` | 230 | 895 | 0 | 0 | 0.000% | 0.000% | 10.32 | 8.36 |
| poison | `poison weakness` | 507 | 621 | 0 | 0 | 0.000% | 0.000% | 8.62 | 9.29 |
| dark | `dark type weakness` | 5197 | 3140 | 0 | 0 | 0.000% | 0.000% | 6.49 | 6.66 |
| dark | `dark weakness` | 1172 | 858 | 0 | 0 | 0.000% | 0.000% | 6.76 | 6.92 |
| psychic | `psychic type weakness` | 2081 | 2238 | 0 | 0 | 0.000% | 0.000% | 8.06 | 7.39 |
| psychic | `psychic weakness` | 2835 | 2350 | 0 | 2 | 0.000% | 0.085% | 7.30 | 6.97 |
| psychic | `what is psychic weak to` | 161 | 324 | 0 | 0 | 0.000% | 0.000% | 9.60 | 7.30 |

**实验状态：** ⏳ EXP-20261111-01 继续观察（[PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)，2026-11-11 上线）。
**解释：** 以上是 GSC 观察性数据，不能直接证明变更导致了变化；同周 SERP、搜索需求、抓取时间等因素未受到控制。
