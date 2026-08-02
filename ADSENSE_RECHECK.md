# AdSense整改与复检清单

更新日期：2026-08-02

## 已在代码中完成

- [x] 审核期间从站点代码中完全移除 AdSense 脚本，避免客户端跳转后脚本残留到薄页。
- [x] 没有人工深度指南的双属性页输出 `noindex,follow`，并从 sitemap 移除。
- [x] Water/Psychic 与 Poison/Dragon 已加入独立的实战定位、进攻、反制、配队和 FAQ 内容。
- [x] Ferrothorn 已扩写为完整战术指南；其余未完成编辑的 Pokémon 页 noindex 并从 sitemap 移除。
- [x] 新增 About 页面，并在全站页脚加入 About、Privacy、Terms、Contact、Support 链接。
- [x] 隐私政策补充 Google 广告 Cookie、个性化广告退出、PII、位置数据及地区同意说明。
- [x] `ads.txt` 保留发布商授权行。
- [x] 生产构建和 TypeScript 检查通过。

## 内容扩建规则

任何双属性页只有在完成以下工作后，才可加入 `lib/editorialCombinations.ts` 的索引白名单：

- [ ] 正文达到约 800–1500 个英文词，而不是只重复计算结果。
- [ ] 至少包含：战术定位、进攻覆盖、反制风险、配队建议、具体宝可梦示例和 FAQ。
- [ ] 文字针对该组合独立撰写，避免批量替换属性名的模板段落。
- [ ] 对照现代主系列属性表复核所有倍率；说明能力、道具、规则和太晶化可能改变结果。
- [ ] 有自然的站内链接，但不堆砌关键词或制造门页。
- [ ] 人工校对后，才把 slug 加入 `EDITORIAL_COMBINATIONS`。

建议下一批优先扩写 sitemap 原本标记为热门的组合，再扩写有真实宝可梦数据支撑的组合。无法达到标准的页面继续保持无广告、noindex；不要为了增加索引量批量生成近似段落。

## Unknown 项站长确认

- [ ] ADS-ELIG-01：AdSense 收款人与账号持有人已满 18 岁；否则使用监护人账号。
- [ ] ADS-ELIG-02：在 AdSense 的账号/付款资料中确认本人或同一收款实体没有第二个账号；新站加入现有账号。
- [ ] ADS-OWN-01：确认可部署并发布 `app/layout.tsx`、根目录静态文件和 DNS 记录。
- [ ] ADS-OWN-02：在域名注册商检查 typematchup.org 的注册、续费和 DNS 管理权均由本人或公司控制。
- [ ] ADS-SITE-01：在 AdSense 后台“网站”中确认 typematchup.org 已添加、已验证，并查看当前审核状态。
- [ ] ADS-SITE-02：审核期使用 `/ads.txt` 或 AdSense 提供的 meta 方式验证所有权；恢复广告前再确认官方脚本与发布商 ID 一致。
- [ ] ADS-CONTENT-07：当前站点没有评论/UGC；若将来增加，必须有审核、举报和垃圾内容清理机制。
- [ ] ADS-PROG-01：本人、团队、测试人员均不点击自有广告；测试只使用 Google 允许的测试方式。
- [ ] ADS-PROG-04：在 GA/Vercel/服务器日志按来源检查流量；停止 PTC、互点、买量机器人、垃圾邮件或垃圾评论流量。
- [ ] ADS-PROG-05：浏览器开发者工具检查广告请求；只使用 Google 官方脚本，不改写 iframe、点击区域或请求参数。
- [ ] ADS-PROG-06：抽查所有会加载广告的路由，确认有正常主体内容；弹窗、邮件、错误页、纯功能空状态和薄页不得加载。
- [ ] ADS-PRIV-03：检查 URL、查询参数、`dataLayer` 和广告配置，不得包含邮箱、手机号、姓名或用户 ID 等 PII。
- [ ] ADS-PRIV-04：在 GA 地域报告确认是否有 EEA/英国/瑞士流量；如有，在 AdSense“隐私权和消息”部署 Google 认证 CMP，并用当地模拟/测试验证拒绝前不写非必要广告 Cookie。
- [ ] ADS-PRIV-05：浏览器站点权限确认网站不请求精确位置；以后新增定位功能前必须先告知并取得同意。
- [ ] ADS-PRIV-07：确认没有代理、重写或自行向 Google 域设置 Cookie；本站通常应为不适用。
- [ ] ADS-PRIV-08：确认未用健康、宗教、性取向等敏感信息建立受众或再营销列表；本站通常应为不适用。
- [ ] ADS-PRIV-09：确认没有对美国/加拿大住房、招聘、信贷广告按受保护人群属性定向；本站通常应为不适用。
- [ ] ADS-PRIV-10：若启用个性化广告，确认 CMP 选择、AdSense 设置和隐私政策一致，并保留合法数据使用依据。

## 部署后复检

- [ ] `/about`、`/privacy`、`/terms`、`/contact` 均返回 200，且首页页脚可直接到达。
- [ ] `/types/water-psychic`、`/types/poison-dragon` 和 `/pokemon/ferrothorn` 返回 200、允许索引且正文可读。
- [ ] 随机抽查至少 10 个未扩写动态页：页面含 `noindex,follow`；全站 Network 中没有 `adsbygoogle.js` 请求。
- [ ] sitemap 只含 18 个单属性页与已完成编辑指南的双属性页，不含其余薄页。
- [ ] `/ads.txt` 返回 200，内容为 `google.com, pub-9200275562093244, DIRECT, f08c47fec0942fa0`。
- [ ] robots.txt 未阻止 Googlebot、Mediapartners-Google 或 AdSense 抓取重要页面。
- [ ] 移动端和桌面端检查导航、页脚、内容布局，无遮挡、误导按钮、自动跳转或横向溢出。
- [ ] Search Console 提交新 sitemap，并对新增/改写页请求编入索引。
- [ ] 在 AdSense 后台关闭 Auto Ads；恢复广告时只使用人工广告位并重新完成页面级合规检查。
- [ ] 等 Google 重新抓取后再运行 AdSense 预检；Blocker、High、Medium 均应为 Pass，或有可解释的后台确认项。
