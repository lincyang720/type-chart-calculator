# TypeMatchup — SEO 运营决策日志

本文件记录**证据 → 假设 → 改动 → 复盘 → 决策**，用于避免反复修改、凭印象判断。任何记录都必须能追溯到 GSC、GitHub PR、Vercel 或明确标注的人工观察。日期统一按 Asia/Taipei (UTC+08:00)。

## 状态定义

- ⏳ 待观察：已执行，但尚无足够的后续搜索数据判定。
- ✅ 有证据支持保留：达到事先定义的观察要求，且记录了局限性。
- ❌ 已撤回：有明确的失败证据、技术问题或与用户意图不符；记录回退 PR。
- ⚪ 未执行：仅发现机会或提出假设，不视为已上线。

> 提醒：GitHub CI 通过、Vercel READY、网页能访问，只能证明技术上线，**不能证明 SEO 提升**。

## 2026-11-11｜EXP-20261111-01｜属性弱点搜索意图优化

| 字段 | 事实 / 决策 |
|---|---|
| 状态 | ⏳ 待观察 |
| 来源 | Google Search Console → 搜索效果 → 查询；经已连接 GSC 数据接口读取 |
| 基线统计窗 | 2026-10-14 至 2026-11-10，28 个完整自然日 |
| 发现 | 主要属性弱点查询已有大量展示，但点击很少；平均排名约 6–8，不能单凭低 CTR 断言标题错误 |
| 搜索词样例 | `ghost type weakness`：16,084 曝光 / 2 点击 / 平均排名 7.0004；`poison type weakness`：12,124 / 2 / 6.9656；`dark type weakness`：16,121 / 2 / 6.8374；`psychic type weakness`：8,453 / 3 / 7.591 |
| 假设 | 对搜索意图更直白的首屏弱点、抗性、免疫摘要，以及 Poison / Dark 更清晰的 H1 与页面 metadata，可能改善搜索匹配与用户理解 |
| 执行 | 四个页面：`/types/ghost`, `/types/poison`, `/types/dark`, `/types/psychic`。增加可计算的 2×、0.5×、0× 摘要；调整 Poison / Dark 标题和描述 |
| 代码证据 | [PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)，合并提交 `e863e24896c7be5f38d9ce1036c191a11c21d6bf` |
| 上线证据 | 2026-11-11 Vercel 正式部署 READY；上述四个公开页面内容已再次读取核实 |
| 保护范围 | 未改 canonical、广告或统计配置；未修改其他属性页面 |
| SEO 结果 | **待观察**，目前不能宣称有效或 CTR 已改善 |
| 下次行动 | 按 `weekly-reviews.md` 中的同口径 GSC 指标逐周跟踪；有足够数据后决定保留、迭代或撤回 |

### 复盘记录（每次追加，不覆盖）

| 复盘日期 | 前后统计区间 | GSC 证据 | 结论与理由 | 决策 | 链接 |
|---|---|---|---|---|---|
| 待填 | 待填 | 待填 | 尚未形成对比 | ⏳ 待观察 | 待填 |

## 新决策模板

### YYYY-MM-DD｜EXP-YYYYMMDD-NN｜实验名称

- **状态：** ⚪ 未执行 / ⏳ 待观察 / ✅ 有证据支持保留 / ❌ 已撤回
- **发现与原始出处：** GSC 维度、时间窗、查询词、落地页、读数或具体页面证据
- **假设：** 为什么认为修改可能满足用户意图
- **范围与对照：** 修改页、保持不变的相似页面、设备与国家筛选
- **实际改动：** GitHub PR、部署时间、版本
- **成功/失败信号：** 上线前定义，见 `optimization-rules.md`
- **复盘：** 同口径数据、外部变化、局限性和最终决策

---

## 2026-11-12｜DIAG-20261112-02｜第二批四页 SEO 精细化诊断（仅分析，未修改页面）

**状态：⚪ 未执行优化。** 本记录是诊断与候选实验，不是已经上线的 SEO 实验；本次只修改 `operations/decisions.md`。日期为 Asia/Taipei。

### 数据口径与重大时序提醒

- **来源**：已连接的 Google Search Console 官方 Search Analytics 数据接口，资源 `https://www.typematchup.org/`，搜索类型 Web；统计时间 **2026-10-14—2026-11-10（28 天）**。
- 页面总量按 `page` 精确 URL 聚合读取；查询明细按 `page + query` 读取。CTR 为点击/曝光；平均排名按 GSC 原始口径，不可简单地把页面整体排名归因到某个查询。
- **关键时序**：该 28 天数据截至 11 月 10 日；[PR #31](https://github.com/lincyang720/type-chart-calculator/pull/31)（`c2a7c8b20f03f34c2d8510597f3848065d7e3dba`）于 **2026-11-11** 修改多个属性弱点页的 Title、H1、首屏、互动计算器、反制列表和内链。**以下历史指标不能当作 PR #31 上线后的表现，也不能证明当前页面仍存在旧问题。**
- 数据未额外按 Google US / 地区 / 设备过滤。公开网页对比只作用户意图参考，**不是经过国家和设备固定的 Google US 实际 SERP 排名审计**。

### 页面级真实 GSC 基线

| 优先级（下一轮检查） | 页面 | 曝光 | 点击 | CTR（计算） | 平均排名 | 现阶段判断 |
|---|---|---:|---:|---:|---:|---|
| P1 | [Fairy](https://www.typematchup.org/types/fairy) | 57,268 | 19 | 0.033% | 7.8311 | 低 CTR、排名偏后；先核验新版搜索结果展现 |
| P2 | [Flying](https://www.typematchup.org/types/flying) | 52,801 | 21 | 0.040% | 7.3384 | 低 CTR、排名偏后；先核验新版展现 |
| P3 | [Electric](https://www.typematchup.org/types/electric) | 71,200 | 53 | 0.074% | 6.5797 | 曝光最高之一，但排位靠后；先关注位置和 SERP |
| P4 | [Dragon](https://www.typematchup.org/types/dragon) | 78,917 | 65 | 0.082% | 6.6964 | 曝光最高、相对点击稍好；新版已增强，不急于重改 |

四页合计 **260,186 曝光、158 点击**（仅这四个 URL 的页面级汇总，不代表全站）。

### 主要查询词 → 具体 URL（GSC page+query 精确匹配）

| 页面 | 查询词 | 曝光 | 点击 | CTR | 平均排名 |
|---|---|---:|---:|---:|---:|
| Electric | `electric type weakness` | 10,095 | 3 | 0.030% | 6.5919 |
| Electric | `electric weakness` | 3,143 | 1 | 0.032% | 7.2157 |
| Electric | `electric pokemon weakness` | 2,524 | 5 | 0.198% | 7.1276 |
| Dragon | `dragon type weakness` | 9,402 | 2 | 0.021% | 6.6990 |
| Dragon | `dragon weakness` | 3,677 | 1 | 0.027% | 7.0155 |
| Dragon | `dragon weakness pokemon` | 1,452 | 0 | 0% | 7.6625 |
| Fairy | `fairy type weakness` | 7,278 | 0 | 0% | 8.5555 |
| Fairy | `fairy weakness` | 4,421 | 1 | 0.023% | 8.1253 |
| Fairy | `what is fairy weak to` | 988 | 0 | 0% | 9.9706 |
| Flying | `flying type weakness` | 7,927 | 2 | 0.025% | 8.1166 |
| Flying | `flying weakness` | 3,356 | 0 | 0% | 7.0834 |
| Flying | `flying pokemon weakness` | 1,397 | 0 | 0% | 8.3572 |

### 当前线上 Title / H1 / 首屏（2026-11-12 页面实际读取；与源码交叉核对）

源码：[页面模板](https://github.com/lincyang720/type-chart-calculator/blob/main/app/types/%5Btype%5D/page.tsx)、[页面文案数据](https://github.com/lincyang720/type-chart-calculator/blob/main/lib/typePageCopy.json)、[通用指南组件](https://github.com/lincyang720/type-chart-calculator/blob/main/components/SingleTypeGuide.tsx)、[交互计算器](https://github.com/lincyang720/type-chart-calculator/blob/main/components/TypeMiniCalculator.tsx)。

| 页面 | 实测 Title 与 H1 | 实测 Description 摘要 | 首屏弱点答案 | canonical |
|---|---|---|---|---|
| Electric | `Electric Type Weakness: Dual Typings, Counters & 4×`（Title=H1） | “Electric type weakness is only the start…”；突出 second type、counters、calculator | **Ground 2×**；抗 Electric/Flying/Steel，无免疫 | `/types/electric` |
| Dragon | `Dragon Type Weakness: Dual-Type 4× List & Counters`（Title=H1） | “Dragon type weakness tools an overview leaves out…” | **Ice/Dragon/Fairy 2×**；抗 Fire/Water/Electric/Grass | `/types/dragon` |
| Fairy | `Fairy Type Weakness: Dual-Type Chart & Counter List`（Title=H1） | “Fairy type weakness guide for dual typings…” | **Poison/Steel 2×**；抗 Fighting/Bug/Dark；**Dragon 0×** | `/types/fairy` |
| Flying | `Flying Type Weakness: 4× Cases, Counters & Species`（Title=H1） | “Flying type weakness page covering…” | **Electric/Ice/Rock 2×**；抗 Grass/Fighting/Bug；**Ground 0×** | `/types/flying` |

**首屏结构**：Title/H1 → 导语（先强调双属性差异） → “Quick answer” → 内页导航 → 可选第二属性的 `Interactive ... weakness calculator` → 倍率矩阵 → 反制 Pokémon 列表 / 精灵数据 / 4× 双属性例外 / FAQ。已检查实际页面内容和组件实现。

**内链验证**：
- 四页均通过页头及组件链接至 `/types`、`/calculator`、`/dual-type-chart`、`/pokemon/team-calculator` 等工具；首屏内部锚点包括 `#type-calculator`、`#counters`、`#species`、`#exceptions`、`#faq`。
- `SingleTypeGuide.tsx` 中反制 Pokémon 使用 `/pokemon/{id}`，可索引双属性组合及其他属性使用 `/types/{slug}`；未找到“完全缺少内链”的证据。
- **有待实机核对**：移动端导航与宽表横向滚动可用性（代码中使用 `overflow-x-auto` 和最小表格宽度）；此处仅完成源代码及文本层审查，不能宣称移动端交互已经逐项通过。

### 对照用户搜索意图与公开内容

主要查询如 `fairy type weakness` / `flying type weakness` / `electric type weakness` 首先是**快速查防守弱点**，其次才是双属性 4×、反制 Pokémon / 招式以及具体宝可梦。宝可梦官方属性相克表 https://sg.portal-pokemon.com/game/type-chart/ 也突出攻击方与防守方的方向区别。其他公开页面如 https://pokemonref.com/types/electric 以 “Defense — what beats Electric” 和 “Offense — what Electric moves hit” 分组呈现。

**推断，不是已验证 Google SERP 结论**：现有标题着重 “4× / counters / dual typings”，与单纯寻找一行弱点答案的查询需求可能存在信息侧重点不同，但当前 Quick answer 已正确回答，不能只因历史 CTR 低就重写它。需要用固定国家、设备的实际 Google 搜索结果截图核对 Google 最终展示标题、摘要、SERP 特性，以及前 3 个结果内容之后，再决定是否做元信息实验。

### 可执行优化候选（仅建议，未实施）

1. **P1 Fairy（先验收，后决定）**：对 `fairy type weakness`、`fairy weakness` 和 `what is fairy weak to` 截取 Google US 桌面+手机的实际结果（含 Google 所选标题与摘要、前 3 条竞争结果）；如仍排名 7–10 且 snippet 侧重 4×/list，候选小实验是让 Title/Description 的首句直接明示 “Weak to Poison & Steel”，但保留现有计算器和详情。切忌同时全面改正文。
2. **P2 Flying**：同法对 `flying type weakness` 等做 SERP 实测。可候选在搜索标题/描述开头明确 “Electric, Ice & Rock”，并区分防守弱点与攻击优势；当前正文已经解释 Ground 免疫，避免重复堆字。
3. **P3 Electric**：主页面已有单一 Ground 弱点的完整答案和精灵工具。优先判断排名差距、SERP 是否直接给答案；只在搜索结果数据证实相关性不足后测试 “Weak to Ground” 的标题/描述。重点保护互动工具。
4. **P4 Dragon**：标题已提供双属性 4× 与反制工具，实体页面内容完整。先核对 Google 展示与现有竞争格局；若对 `dragon type weakness` 的搜索摘要没有展示 Ice/Dragon/Fairy，可考虑小范围元信息试验，暂不改已有长文。
5. **四页共同**：单独核验手机与桌面的计算器、各内页锚点、反制表格可滚动及 4× 例子准确性；如果发现在共享组件里的事实/可用性错误，走独立修复 PR，不把功能问题和 SEO 标题实验混在一起。
6. **保护条件**：任何后续实际改动先写独立实验与明确的旧版指标、PR、上线时间；至少观察两个以上完整周，考虑谷歌抓取延迟和未修改参照页；不自动认定有效、不自动回滚、不动广告/robots/canonical。

### 诊断结论

- **本批不是“待补标题”的四个空页面**；PR #31 已在 11-11 改版并补充交互功能。
- 现在最有价值的是**基于改版后完整数据和真实 SERP 判断新的低 CTR 是否持续**；优先跟踪 Fairy → Flying → Electric → Dragon。
- 本次状态：**⚪ 已完成诊断 / 未执行页面优化 / 未上线任何 SEO 改动。**


### 2026-11-12｜实时复核与执行条件

- 重新读取 GSC 的 `https://www.typematchup.org/` 资源，按 Web、2026-10-14 至 2026-11-10、四个精确 URL 分别请求页面聚合与查询明细（不纳入未定稿数据）。上表四个页面总量及 12 条查询读数全部复核一致。以下两条 Fairy 查询补足方向差异：`fairy type strong against`（596 曝光、0 点击、0% CTR、平均排名 7.5101）查的是 Fairy 招式打谁；`what is super effective against fairy`（534 曝光、0 点击、0% CTR、平均排名 7.1873）查的是怎么打 Fairy。后续保留两种方向的独立标签。
- 四个线上 URL 的 Title、H1、速答与正文内链已重新读取。电页可从物种表进入 Electric/Flying（Zapdos），龙页可进入 Flying/Dragon（Dragonite），妖精页可进入 Psychic/Fairy（Gardevoir），飞行页可进入 Fire/Flying（Charizard）。各页已有计算器、反制、物种和双属性例外的锚点，首轮无需追加通用内链。这里的首屏核对指页面顶部内容顺序，尚未实测移动视口折叠线。
- **Flying 反制表另有可复现的内容问题。** 线上 Groudon 和 Landorus-Therian 的 “Super-effective move” 栏显示 Stealth Rock。该招式是换入时触发的场地陷阱，Stone Edge 才是同列的直接岩石攻击。[招式机制](https://bulbapedia.bulbagarden.net/wiki/Stealth_Rock_(move))。根因在 [`lib/singleTypeGuide.ts` 的 `countersFor`](https://github.com/lincyang720/type-chart-calculator/blob/main/lib/singleTypeGuide.ts#L198)：只按 `MOVE_TYPES` 匹配，没有区分伤害招式和变化招式。候选独立修复：为反制表只选择能直接造成伤害的招式；若保留 Stealth Rock，放在明确标为入场陷阱的战术说明。验收时检查 Flying 的两行仍显示 Stone Edge，并检查四页共享组件的反制表。这个准确性问题可先于标题实验进入评审。
- **标题实验顺序仍为 Fairy → Flying → Electric → Dragon。** 先等 PR #31 后至少两个完整周的 GSC 数据，按固定查询、国家与设备核查搜索结果展示和平均排名。若 Fairy 的主词仍低点击且 Google 展示没有直接回答弱点，首轮只在 `lib/typePageCopy.json` 试 Fairy 的标题 `Fairy Type Weakness: Poison & Steel | Pokémon`。当前路由共用该字段生成 Title 和 H1，若要只测试 Title，先为 Fairy 分开设置 metadata 与 H1，避免同时改正文。按同口径跟踪固定查询的曝光、点击、CTR 和平均排名，并用未修改的三页辅助判断同期变化。Flying 后续候选明确 Electric、Ice、Rock，Electric 候选明确 Ground，Dragon 候选明确 Ice、Dragon、Fairy。

## 2026-11-12｜产品待办｜分享我的队伍

- 状态：待排期。先完成 11 月 30 日的 Fairy GSC 复盘，再评估是否启动。
- 第一版：在组队计算器提供分享链接，由用户主动分享。分享页默认 `noindex`，只展示结构化的队伍成员、对战规则和属性覆盖，暂不开自由外链。
- 验证指标：去重后的分享链接创建人数、被他人打开的链接占比。先看分享功能是否有真实需求。
- 搜索入口：以一个核心关键词或一组同义搜索词对应一个编辑页。先验证真实搜索需求，并检查现有页面是否已覆盖该意图；已有页面优先补充。经作者同意与审核，在对应页面引用一个或多个去重后的用户队伍，配上编辑分析和适用规则。只有编辑页具备开放索引、加入 sitemap 和获取站内入口的资格，用户分享页持续默认 `noindex`。同一套队伍或细微变体不创建新的搜索入口。
