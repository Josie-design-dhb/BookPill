# 纸上良方 BookPill — 设计规范 v2.0

> 基于"新中式纸质器物"美学，以米白宣纸为底、朱砂印章为记、墨色宋体为骨。

---

## 一、设计理念

「读过的书，终于能用了。」

纸上良方将 **古籍批注** 的阅读体验与 **AI 诊断** 的交互逻辑融合：
- **诊断像问诊**：像老中医把脉，多轮追问而非一次性回答
- **建议像良方**：像开药方，给出可执行的三步行动，而非空泛道理
- **社区像同道**：像书友会，人人可贡献书籍条目，共建知识库

---

## 二、视觉风格

### 2.1 风格关键词

| 关键词 | 含义 |
|--------|------|
| **新中式** | 现代产品形态 + 传统东方美学元素 |
| **纸质器物** | 宣纸底色、毛边质感、朱砂印章、宋体排版 |
| **克制留白** | 大量负空间、呼吸感、不拥挤 |
| **温润触感** | 柔和阴影、低饱和色彩、350ms 缓动过渡 |

### 2.2 纸质纹理底纹

全站使用 SVG `feTurbulence` 噪声滤镜生成的**宣纸质感底纹**，全局固定覆盖：

```css
.paper-tex::before {
  background-image: url("data:image/svg+xml,<svg><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3'/><feColorMatrix values='0 0 0 0 .17 0 0 0 0 .16 0 0 0 0 .15 0 0 0 .03 0'/></filter><rect filter='url(%23n)'/></svg>");
  opacity: .5;
}
```

---

## 三、色彩系统

### 3.1 核心色板（CSS 变量）

#### 墨色 · Ink（文字/主视觉）

| 变量 | 色值 | 用途 |
|------|------|------|
| `--ink` | `#2C2825` | 正文标题、主要文字 |
| `--ink-soft` | `#5C544E` | 次要文字、导航链接 |
| `--ink-faint` | `#9C948C` | 辅助信息、时间戳 |

#### 朱砂 · Vermillion（品牌/强调）

| 变量 | 色值 | 用途 |
|------|------|------|
| `--vermillion` | `#B84040` | Logo 印章、主 CTA、高亮标记 |
| `--vermillion-dark` | `#9A3434` | 按钮 hover 状态 |

#### 金色 · Gold（点缀/分隔）

| 变量 | 色值 | 用途 |
|------|------|------|
| `--gold` | `#B89F6B` | 分隔线、hover 边框、次要强调 |
| `--gold-dark` | `#968055` | 按钮/标签 hover |

#### 米黄 · Rice（底色/容器）

| 变量 | 色值 | 用途 |
|------|------|------|
| `--rice` | `#F5EDE0` | 页面背景 |
| `--rice-light` | `#FAF4EA` | 卡片/容器背景 |

#### 纸白 · Paper

| 变量 | 色值 | 用途 |
|------|------|------|
| `--paper` | `#FFFDF7` | 纯净纸白，弹窗/表单背景 |

#### 旧色 · Aged（边框/分隔）

| 变量 | 色值 | 用途 |
|------|------|------|
| `--aged` | `#E8DCC8` | 边框、输入框底色 |
| `--aged-dark` | `#D4C4A8` | 边框 hover/强调 |

#### 补充色

| 变量 | 色值 | 用途 |
|------|------|------|
| `--bamboo` | `#6B8E6F` | 绿色（已收录状态） |
| `--indigo` | `#3A5F7A` | 靛蓝 |

### 3.2 五大问题域专属色

每个问题域有独立标签色，用于社区书籍卡片、投稿标签：

| 问题域 | 标签 | 色值 | 色变量 |
|--------|------|------|--------|
| 拖延脉 | procrastination | `#8B7EC8` | `--delay` |
| 焦虑脉 | anxiety | `#C97B5A` | `--anxiety` |
| 内耗脉 | internal friction | `#6B8E9E` | `--internal` |
| 表达脉 | expression | `#D4A04C` | `--express` |
| 情商脉 | EQ / 人际 | `#6B8E6F` | `--eq` |

### 3.3 状态色

| 状态 | 色值 | 场景 |
|------|------|------|
| ✅ 成功/已收录 | `#6B8E6F` (bamboo) | 社区已收录书籍、操作成功提示 |
| ⏳ 待审核 | `#D4A04C` (express/gold) | 投稿待审核状态 |
| ❌ 拒绝/未通过 | `#B84040` (vermillion) | 投稿未通过、错误提示 |
| ℹ️ 信息 | `#3A5F7A` (indigo) | 信息提示、弹窗说明 |

### 3.4 置信度色

| 置信度 | 标签 | 色值 |
|--------|------|------|
| 高置信度 | 精准匹配 | `#6B8E6F` (bamboo，绿) |
| 中置信度 | 需澄清 | `#D4A04C` (gold，金) |
| 低置信度 | 模糊匹配 | `#B84040` (vermillion，朱) |

---

## 四、字体系统

### 4.1 字体家族

| 角色 | 变量 | 字体 | 用途 |
|------|------|------|------|
| **正文衬线** | `--serif` | `Noto Serif SC` | 正文、标题、大段文字 |
| **毛笔手写** | `--cal` | `Ma Shan Zheng` | Logo 主字、印章文字、装饰性标题 |
| **展示黑体** | `--display` | `ZCOOL XiaoWei` + 系统黑体 | 导航、按钮、标签、英文缩写 |

### 4.2 加载方式

```html
<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500;600;700;900&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
```

### 4.3 字号层级

| 层级 | 字号 | 字重 | 字间距 | 用途 |
|------|------|------|--------|------|
| Hero 标题 | 48–64px | 700–900 | 0.02em | 首页主标题 |
| 大标题 H1 | 32–40px | 600–700 | 0.02em | 页面/区块标题 |
| 中标题 H2 | 24–28px | 600 | 0.02em | 卡片标题、子区块 |
| 小标题 H3 | 18–20px | 600 | 0.02em | 栏目标题 |
| 正文 | 15–16px | 400 | — | 主要阅读文本 |
| 辅助文字 | 12–13px | 400 | 0.15em | 时间戳、元信息 |
| 按钮/标签 | 13px | 500 | 0.15em | 导航链接、按钮文字 |
| Logo 主字 | 23px | — | 0.02em | 毛笔体 |
| Logo 英文 | 11px | — | 0.35em | `BOOKPILL` |

---

## 五、间距与布局

### 5.1 栅格系统

| 属性 | 值 |
|------|----|
| 最大宽度 | `1160px` |
| 页面边距 | `36px`（左右） |
| 区块间距 | `80–120px`（上下） |
| 卡片间距 | `12–16px` |
| 内部 padding | `14–22px` |

### 5.2 圆角规范

| 元素 | 圆角 |
|------|------|
| 卡片/容器 | `12px` |
| 印章 | `6px` |
| 按钮 | `6–8px` |
| 输入框 | `6px` |
| 标签/chip | `3–12px` |

### 5.3 社区网格

社区书籍卡片使用响应式网格：

| 屏幕宽度 | 每行数量 |
|---------|---------|
| > 820px | 3 个 |
| 520–820px | 2 个 |
| < 520px | 1 个 |

---

## 六、阴影与动效

### 6.1 阴影层级

| 变量 | 值 | 用途 |
|------|------|------|
| `--shadow` | `0 1px 12px rgba(44,40,37,.06)` | 默认阴影（卡片、印章） |
| `--shadow-lift` | `0 6px 28px rgba(44,40,37,.12)` | 悬停/弹窗阴影 |

### 6.2 动效

| 变量 | 值 | 用途 |
|------|------|------|
| `--t` | `.35s cubic-bezier(.4,0,.2,1)` | 全局默认过渡曲线 |

常用过渡属性：`color` · `border-color` · `background` · `transform` · `opacity` · `box-shadow`

### 6.3 悬停交互

| 元素 | Hover 效果 |
|------|-----------|
| 卡片 | 边框变金色 + `--shadow-lift` 阴影 |
| 按钮 | 背景色加深 / 边框变色 |
| 印章 | `scale(1.05)` 微动效 |
| 导航链接 | 底部出现 `--gold` 下划线 + 字色变深 |

---

## 七、核心组件

### 7.1 印章（Seal）

朱砂红方形圆角印章，是品牌核心视觉符号。

```css
.logo-seal {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--vermillion);
  box-shadow: 0 2px 10px rgba(184,64,64,.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
```

**社区卡片印章变体**：32×32px，字取自书籍名首字（如《人性的弱点》→「人」，《绿毛水怪》→「绿」）。

### 7.2 卡片（Card）

```css
.card {
  background: var(--paper);
  border: 1px solid rgba(184,159,107,.15);
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: var(--shadow);
  transition: var(--t);
}
.card:hover {
  border-color: var(--gold);
  box-shadow: var(--shadow-lift);
}
```

### 7.3 按钮（Button）

#### 主按钮

朱砂红实心 + 白字，用于关键 CTA（提交、确认）。

```css
.btn-primary {
  background: var(--vermillion);
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-family: var(--display);
  font-size: 13px;
  letter-spacing: .15em;
  transition: var(--t);
}
.btn-primary:hover { background: var(--vermillion-dark); }
```

#### 次按钮

透明底 + 金边框，用于次要操作（返回、取消）。

```css
.btn-secondary {
  border: 1px solid var(--gold);
  color: var(--ink-soft);
  background: transparent;
}
.btn-secondary:hover { background: var(--aged); }
```

### 7.4 标签（Chip / Tag）

五大问题域标签，方形或圆角 pill，背景色即域色，白字。

```css
.domain-chip {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-family: var(--display);
  letter-spacing: .1em;
  color: #fff;
}
```

### 7.5 导航（Nav）

固定顶部，毛玻璃模糊效果，三栏布局（左 Logo · 中链接 · 右 CTA）。

```css
nav {
  position: fixed;
  top: 0;
  backdrop-filter: blur(16px) saturate(140%);
  background: rgba(245,237,224,.82);
  border-bottom: 1px solid rgba(184,159,107,.1);
  height: 70px;
  max-width: 1160px;
}
```

导航项：问诊 · 成方 · 典籍 · 同道

### 7.6 输入框

米白底色 + 旧色边框 + 6px 圆角 + 15px padding。

```css
input, textarea {
  background: var(--rice-light);
  border: 1px solid var(--aged);
  border-radius: 6px;
  padding: 12px 15px;
  font-family: var(--serif);
  font-size: 15px;
  color: var(--ink);
}
input:focus, textarea:focus {
  border-color: var(--gold);
  outline: none;
}
```

### 7.7 弹窗/模态（Modal）

半透明墨色遮罩 + 纸白容器 + 居中弹出动画（translate + scale）。

```css
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(44,40,37,.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
}
.modal-content {
  background: var(--paper);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-lift);
}
```

### 7.8 Chat 气泡

问诊面板中的对话气泡：
- 用户消息：朱砂红底（`--vermillion`）+ 白字
- AI 回复：米白底（`--paper`）+ 墨色边框

### 7.9 Toast 提示

顶部居中，4 种类型：
- ✅ success → bamboo 绿
- ❌ error → vermillion 朱
- ⚠️ warning → gold 金
- ℹ️ info → indigo 靛

---

## 八、页面结构

### 8.1 首页 index.html

| 区块 | 说明 |
|------|------|
| Nav | 固定导航栏 + Logo + 导航链接 |
| Hero | 大标题 + 副标题 + 主 CTA + 纸质纹理 |
| 问题域 Cards | 5 个问题域卡片（拖延/焦虑/内耗/表达/情商） |
| 问诊工作流 | 3 步流程图（诊断 → 成方 → 典籍） |
| 书籍列表 | 已收录书籍展示 + 标签云 |
| Footer | Logo + 导航 + 版权 |

### 8.2 社区 community.html

| 区块 | 说明 |
|------|------|
| 同道卡片 | 投稿者排行榜（贡献者 + 书籍数） |
| 最近收录 | 网格卡片（一行 3 个，印章=书名首字） |
| 投稿 Feed | 投稿时间流（最新在前） |

### 8.3 投稿 submit.html

| 区块 | 说明 |
|------|------|
| 贡献者卡片 | 自动记忆贡献者 + 统计信息 + 更换按钮 |
| 投稿表单 | 书名/作者（自动补全）+ 补充说明 |
| 预览 | AI 自动生成内容预览（核心观点/三步良方/场景） |
| 投稿确认 | 3 个勾选框 + 《贡献指南》链接 |
| 贡献指南弹窗 | 点击指南链接弹出（3 条内容） |

### 8.4 后台 admin.html

密码登录 → 投稿列表 → 审核操作（通过/拒绝）+ 一键审核 + 一键删除 + 分页

### 8.5 统计 stats.html

投稿趋势图 + 问题域分布 + 贡献者排行

---

## 九、交互规范

### 9.1 点击反馈

- 所有可点击元素必须有明显 hover 状态（边框变色 / 阴影提升 / 微缩放）
- 无 `cursor: default`，按钮/卡片统一 `cursor: pointer`

### 9.2 空状态

各列表为空时显示统一空状态组件：

```css
.err-state { text-align: center; padding: 48px 20px; color: var(--ink-faint); }
.err-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--aged); display: flex;
  align-items: center; justify-content: center;
  font-family: var(--cal); font-size: 24px;
  margin: 0 auto 16px;
}
```

### 9.3 加载状态

- 首屏骨架屏（shimmer 金色微光）
- 按钮 loading：旋转 spinner + 禁用点击

### 9.4 响应式断点

| 断点 | 宽度 | 调整 |
|------|------|------|
| 桌面 | > 1100px | 完整布局 |
| 平板 | 820–1100px | 社区网格 2-3 列 |
| 手机 | 520–820px | 单列布局，导航折叠 |
| 小屏 | < 520px | 简化布局，字号微调 |

---

## 十、无障碍

| 项目 | 规范 |
|------|------|
| 对比度 | 正文与背景 ≥ 4.5:1 |
| 聚焦样式 | `outline: 2px solid var(--gold)` |
| 字号 | 正文 ≥ 15px，标题 ≥ 18px |
| 键盘导航 | Tab 可达所有交互元素 |
| ARIA | 弹窗需 `role="dialog"` + `aria-modal="true"` |
| 图片 | 必须 `alt` 属性 |

---

## 十一、AI 能力边界（产品设计）

### 11.1 全链路异常兜底

| 异常类型 | 检测方式 | 响应 |
|---------|---------|------|
| 乱码/无意义字符 | 中文字符占比 < 15% 或特殊字符 ≥ 30% | 💡 引导清晰描述 |
| 纯情绪宣泄 | 匹配"好烦""好累"等纯情绪词 + 按域定制引导 | 💡 共情安抚 |
| 领域外提问 | 匹配医疗/法律/金融关键词 | ⚠️ 硬拦截 + 建议专业渠道 |
| 知识库知识缺失 | 低置信度（< 阈值） | 坦诚告知 + 不编造 |

### 11.2 置信度分级

| 级别 | 判定 | 标签显示 |
|------|------|---------|
| 高置信度 | 匹配 3+ 关键词 + 问题域一致 | 精准匹配 · 绿 |
| 中置信度 | 跨域书籍概念命中（如"课题分离"→《被讨厌的勇气》） | 需澄清 / 书籍关联 · 金 |
| 低置信度 | 关键词不足 + 无书籍概念命中 | 模糊匹配 · 朱 |

### 11.3 边界拦截关键词

| 类别 | 关键词示例 |
|------|-----------|
| 心理危机 | 自杀、不想活、活不下去、轻生 |
| 医疗诊断 | 胸口疼、发烧、咳嗽、疱疹、吃药、用药、怀孕 |
| 法律咨询 | 犯法、起诉、律师、违约、合同 |
| 金融投资 | 股票、基金、贷款、投资、债务 |
| 暴力危险 | 打人、家暴、威胁、恐吓 |

---

## 十二、共建机制

### 12.1 内核知识库解耦

- **推理内核**：前端关键词匹配、置信度算法、边界拦截规则（可迭代）
- **书籍素材**：本地 `BOOK_CONCEPTS` 内置库 + Supabase 用户共建库（独立存储）
- 升级推理逻辑不影响共建数据

### 12.2 极简三要素投稿

用户填写：**书名 + 作者 + 署名（贡献者）**

前端自动生成：
- Google Books API 抓取出版信息
- AI 生成核心观点 / 三步良方 / 场景 / 金句
- 自动匹配问题域标签

### 12.3 UGC 流转闭环

```
用户提交 → 前端自动解析 → 人工后台密码复核
    → 通过 → Supabase status=approved → 社区公开浏览
    → 拒绝 → Supabase status=rejected → 不显示
```

---

## 十三、部署架构

| 渠道 | 地址 | 说明 |
|------|------|------|
| Cloudflare Pages | bookpill.pages.dev | 主站 |
| 腾讯云 COS | bookpill-1463703373.cos-website.ap-guangzhou.myqcloud.com | 备份/国内加速 |
| GitHub | github.com/Josie-design-dhb/BookPill | 源码仓库 |
| Supabase | wuytcnlghymqfuewmzzd.supabase.co | 共建书籍数据库 |

---

*纸上良方 BookPill · 设计规范 v2.0 · 2026*
