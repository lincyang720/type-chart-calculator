# Google Search Console 提交指南

## 为什么要提交？
让 Google 快速索引你的网站，开始获得自然流量。

## 步骤

### 1. 访问 Google Search Console
https://search.google.com/search-console

### 2. 添加资源
- 点击左上角下拉菜单
- 选择"添加资源"
- 选择"网址前缀"
- 输入：`https://typematchup.org`
- 点击"继续"

### 3. 验证所有权

**方法 1：HTML 标记（推荐）**

Google 会给你一个 meta 标签，类似：
```html
<meta name="google-site-verification" content="xxxxxxxxxxxxxx" />
```

添加到项目中：

1. 编辑 `/Users/apple/type-chart-calculator/app/layout.tsx`
2. 在 `metadata` 对象中添加：
```typescript
export const metadata: Metadata = {
  // ... 现有配置
  verification: {
    google: 'xxxxxxxxxxxxxx', // 替换为你的验证码
  },
}
```

3. 提交代码并等待 Vercel 重新部署：
```bash
cd /Users/apple/type-chart-calculator
git add app/layout.tsx
git commit -m "Add Google Search Console verification"
git push
```

4. 等待 1-2 分钟部署完成
5. 回到 Google Search Console 点击"验证"

**方法 2：DNS 验证**
- 在域名注册商添加 TXT 记录
- 更简单但需要等待 DNS 传播

### 4. 提交 Sitemap

验证成功后：
1. 左侧菜单点击"站点地图"
2. 输入：`sitemap.xml`
3. 点击"提交"

### 5. 请求索引（可选但推荐）

1. 左侧菜单点击"网址检查"
2. 输入：`https://typematchup.org`
3. 点击"请求编入索引"
4. 对重要页面重复此操作：
   - https://typematchup.org/calculator
   - https://typematchup.org/battle-simulator
   - https://typematchup.org/types

## 预期结果

- **24-48 小时内**：网站开始被索引
- **1-2 周内**：开始出现在搜索结果中
- **1-3 个月内**：关键词排名逐步提升

## 监控指标

在 Google Search Console 中定期检查：
- 总点击次数
- 总展示次数
- 平均点击率
- 平均排名
- 哪些关键词带来流量
