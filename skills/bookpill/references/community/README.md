# 社区共建书籍目录

> 这里存放由社区成员贡献的书籍知识库文件。所有文件经过审核后收录。

**社区入口**：
- [在线投稿](https://josie-design-dhb.github.io/BookPill/submit.html) — 填写表单，自动创建 GitHub Issue
- [社区动态](https://josie-design-dhb.github.io/BookPill/community.html) — 查看最近投稿、新增书籍、贡献者
- [贡献指南](https://github.com/Josie-design-dhb/BookPill/blob/v2/CONTRIBUTING.md) — 投稿方式与审核标准
- [Issue 投稿](https://github.com/Josie-design-dhb/BookPill/issues/new/choose) — 直接在 GitHub 投稿

## 目录说明

本目录是 BookPill v2 社区共建的核心目录。社区成员通过投稿方式贡献书籍，经审核后文件存放在此目录下。

## 文件列表

| 文件名 | 书名 | 问题域 | 贡献者 | 状态 |
|--------|------|--------|--------|------|
| _（暂无社区书籍）_ | — | — | — | — |

> 社区书籍收录后，维护者会在此表格中添加条目。
> 也可以在 [社区动态页](https://josie-design-dhb.github.io/BookPill/community.html) 实时查看最新收录的书籍。

### 状态说明

| 状态 | 含义 |
|------|------|
| 🟡 待审核 | 已提交，等待维护者审核 |
| 🟢 已收录 | 审核通过，已合并到 main 分支 |
| 🔴 未通过 | 审核未通过，需修改或已关闭 |
| 🔵 修改中 | 投稿人根据反馈修改中 |

## 命名规范

- 文件名使用书名拼音或英文简写，全小写，单词用连字符连接
- 示例：`the-courage-to-be-disliked.md`、`nonviolent-communication.md`
- 每个文件使用统一的投稿模板：[`templates/book-template.md`](../../../templates/book-template.md)

## 问题域分类

社区书籍按主问题域归类，文件头部标注问题域归属：

- **拖延** — 行动力、效率、习惯养成
- **焦虑** — 压力、内耗、紧绷、失眠
- **内耗** — 自我怀疑、纠结、情绪内耗
- **表达** — 沟通、社交、表达困难
- **情商** — 情绪管理、人际关系、共情

## 与核心知识库的关系

```
references/
├── (v1 核心书籍，21本)     ← 个人维护，稳定版
└── community/               ← 社区共建，本目录
    ├── README.md            ← 本文件
    └── *.md                 ← 社区投稿书籍
```

- 核心知识库（21本）由 v1 继承，保证稳定性和质量基线
- 社区书籍在此基础上扩展，覆盖更多细分领域
- 社区书籍不会影响核心书籍的稳定性，两者独立发展

## 投稿方式

详见 [`CONTRIBUTING.md`](../../../CONTRIBUTING.md)

## 审核标准

详见 [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) 中的审核标准章节

## 质量保证

1. 所有社区书籍需通过审核才能收录
2. 收录后接受用户反馈，如有内容问题可在 Issues 中提出
3. 每季度回顾社区书籍，移除因版权或质量问题不再适合收录的书籍
4. 核心书籍的修改需更高标准的审核，社区书籍的修改相对灵活

## 实时动态

社区书籍的投稿、审核、收录状态可通过以下方式实时查看：

- **社区动态页**：[https://josie-design-dhb.github.io/BookPill/community.html](https://josie-design-dhb.github.io/BookPill/community.html)
- **GitHub Issues**：[查看所有书籍投稿](https://github.com/Josie-design-dhb/BookPill/issues?q=label:book-submission)
- **GitHub Commits**：[查看 community 目录提交记录](https://github.com/Josie-design-dhb/BookPill/commits/v2/skills/bookpill/references/community)

社区成员可以互相看到谁投了什么书、系统新增了哪些书籍，真正做到共建共享。
