# 纸上良方 BookPill v2.0

> 从个人 Skill 升级为社区共建 Agent — 不只是回答问题，而是记住你、理解你、持续陪伴你。

**GitHub**: https://github.com/Josie-design-dhb/BookPill  
**在线体验**: https://josie-design-dhb.github.io/BookPill/
**许可证**: MIT  
**版本**: v2.0.0  
**状态**: 社区共建中

---

## 什么是 BookPill

BookPill 是一个基于经典书籍的个人问题诊断与建议引擎。它从书籍知识库中提取智慧，将书中洞察转化为针对用户个人情境的"良方"。

聚焦五大个人成长问题域：**拖延 · 焦虑 · 内耗 · 表达 · 情商**

### v1 → v2 升级一览

| 能力 | v1.0 | v2.0 |
|------|-------|-------|
| 记忆系统 | 无 | 记住用户历史问题，识别重复模式 |
| 主动跟进 | 无 | 下次对话主动回顾上次建议执行情况 |
| 对话深度 | 单轮问答 | 多轮深聊：追问→调整→深挖根源 |
| 工作流 | 六步 | 七步（新增「跟进闭环」） |
| 个性化 | 统一风格 | 记住用户偏好，调整建议风格 |
| 知识库 | 21本书，个人维护 | 21本核心 + 社区共建扩展 |
| 维护模式 | 个人维护 | 社区共建，开放投稿 |

---

## 快速开始

### 在 TRAE 中使用

将 `skills/bookpill/SKILL.md` 及 `references/` 目录放入你的 TRAE Skills 目录，重启即可。

### 在 ChatGPT / Claude 中使用

将 `SKILL.md` 内容粘贴到 System Prompt 或 Custom Instructions 中，将 `references/` 目录下的书籍文件作为知识库上传。

### 在 WorkBuddy 中使用

将 `SKILL.md` 作为 Skill 加载，`references/` 作为参考资料。

---

## 项目结构

```
BookPill-v2/
├── README.md                              # 本文件
├── CONTRIBUTING.md                        # 社区贡献指南
├── CONTRIBUTORS.md                        # 贡献者名录
├── index.html                             # 项目落地页（国风复古风格）
├── submit.html                            # 在线投稿表单
├── community.html                         # 社区动态页（实时投稿/新增/贡献者）
├── skills/
│   └── bookpill/
│       ├── SKILL.md                       # v2 核心技能定义
│       └── references/
│           ├── (v1 核心书籍, 21本)          # 个人维护，稳定版
│           └── community/                 # 社区共建书籍
│               └── README.md
├── templates/
│   └── book-template.md                   # 书籍投稿模板
└── .github/
    └── ISSUE_TEMPLATE/
        └── book-submission.yml            # GitHub Issue 投稿模板
```

---

## 七步工作流

```
共情开场 → 问题诊断 → 原因分析 → 问题拆解 → 良方输出 → 收尾 → 跟进闭环
                                                              (v2 新增)
```

1. **共情开场** — 识别情绪，建立连接
2. **问题诊断** — 定位问题域，评估严重度
3. **原因分析** — 挖掘深层原因，连接书籍
4. **问题拆解** — 分层拆解，找出切入点
5. **良方输出** — 基于书籍给出可行动建议
6. **收尾** — 鼓励 + 行动提示
7. **跟进闭环** — 下次对话主动回顾，形成闭环

---

## 社区共建

### 投稿书籍

三种方式，任选其一：

| 方式 | 适合 | 链接 |
|------|------|------|
| GitHub PR | 熟悉 Git 的开发者 | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Issue 模板 | 有 GitHub 账号 | [投稿入口](https://github.com/Josie-design-dhb/BookPill/issues/new/choose) |
| 在线表单 | 所有人 | [立即投稿](https://josie-design-dhb.github.io/BookPill/submit.html) |

### 社区动态

查看社区成员最近投了什么书、哪些书被收录了、谁在贡献：

- **社区动态页**：[https://josie-design-dhb.github.io/BookPill/community.html](https://josie-design-dhb.github.io/BookPill/community.html)
- **GitHub Issues**：[查看所有投稿](https://github.com/Josie-design-dhb/BookPill/issues?q=label:book-submission)

### 贡献者等级

| 等级 | 称号 | 条件 |
|------|------|------|
| Lv1 | 初阶良方师 | 首次投稿通过 |
| Lv2 | 进阶良方师 | 3本书通过 |
| Lv3 | 资深良方师 | 5本书 + 参与审核 |
| Lv4 | 首席良方师 | 10本书 + 社区维护 |
| 特殊 | 创始良方师 | v1 知识库贡献者 |

详见 [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 兼容平台

- **TRAE** — 推荐，功能最完整
- **Claude** — 推荐，原生多轮对话
- **ChatGPT** — 推荐，支持自定义记忆
- **WorkBuddy** — 支持，使用档案粘贴实现记忆

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-01 | 初始版本，21本书，六步工作流 |
| v2.0 | 2026-08 | 升级为 Agent：记忆系统、跟进闭环、多轮深聊、个性化、社区共建 |
| v2.0+ | 2026-08 | 新增社区前端：在线投稿表单、社区动态页、实时投稿流 |

---

## 许可证

MIT License — 自由使用、修改、分发

---

## 致谢

感谢所有为 BookPill 知识库贡献智慧的人。每一本被收录的书，都承载着某个人的"被点醒时刻"。

> 你分享的那本书，可能正在改变某个人的生活。
