# PayPal 集成说明

## 简介

已集成简单的 PayPal 支付功能，用于接受用户捐赠/支持。

## 功能

- **支持页面**: `/support` - 用户可以选择金额并通过 PayPal 支付
- **一次性支付**: 使用 PayPal Buttons SDK 实现简单的支付流程
- **自定义金额**: 用户可以选择预设金额（$3, $5, $10, $20）或输入自定义金额

## 文件结构

```
app/
├── support/page.tsx          # 支持页面（PayPal 支付）
└── layout.tsx                # 已添加 PayPal SDK 脚本

.env.example                  # 环境变量配置
```

## 设置步骤

### 1. 环境变量

已配置的环境变量：
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的_Client_ID
```

### 2. 测试

```bash
# 运行开发服务器
npm run dev

# 访问支持页面
open http://localhost:3000/support
```

### 3. PayPal 测试账户

在 Sandbox 环境测试：
1. 访问 [PayPal Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
2. 使用测试买家账户登录
3. 完成支付流程

### 4. 切换到生产环境

1. 在 PayPal Dashboard 切换到 "Live" 标签
2. 创建 Live 应用
3. 更新 `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 为 Live Client ID
4. 重新部署

## 使用方式

用户访问 `/support` 页面：
1. 选择或输入金额
2. 点击 PayPal 按钮
3. 登录 PayPal 账户
4. 确认支付
5. 完成后显示感谢消息

## 支付流程

```
用户选择金额 → 点击 PayPal 按钮 → PayPal 登录 → 确认支付 → 支付成功
```

## 注意事项

- 当前为 **Sandbox 模式**（测试环境）
- 生产环境需要切换到 Live Client ID
- 支付成功后只显示提示消息，未保存到数据库
- 如需记录支付信息，需要添加后端 API 和数据库

## 后续扩展

如果需要更复杂的功能：

1. **记录支付**: 添加 API 路由保存支付记录到数据库
2. **订阅功能**: 参考之前的订阅系统实现
3. **Webhook**: 接收 PayPal 支付通知
4. **发票**: 生成支付收据

## 支持

- [PayPal Buttons SDK](https://developer.paypal.com/sdk/js/reference/)
- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
