# 开发流程指南

## 项目概述

个人展示网页是一个基于 React + Vite + Tailwind CSS 的静态网站，支持项目展示、经历展示、JD智能匹配和知识图谱可视化。

## 技术栈

| 类别         | 技术选型              |
| ------------ | --------------------- |
| 框架         | React 18 + Vite 5     |
| 样式         | Tailwind CSS 3        |
| 图表         | D3.js 7               |
| Markdown解析 | react-markdown 9      |
| 路由         | React Router 6        |
| 状态管理     | React Hooks + Context |
| 部署         | Vercel                |

## 环境配置

### 1. 安装依赖

```bash
npm run init
```

### 2. 检查环境

```bash
npm run doctor
```

### 3. 启动开发

```bash
npm run dev
```

## 开发阶段

### Phase 1: MVP核心（Week 1-2）

| 任务            | 交付物                      | 状态 |
| --------------- | --------------------------- | ---- |
| 项目初始化      | Vite + React + Tailwind配置 | ✅   |
| Markdown解析    | 解析工具函数                | ✅   |
| Hero组件        | Hero.tsx                    | ✅   |
| ProjectList组件 | ProjectList.tsx             | ✅   |
| Experience组件  | ExperienceTimeline.tsx      | ✅   |
| 响应式布局      | 全局样式                    | ✅   |

### Phase 2: 扩展模块（Week 3-4）

| 任务         | 交付物             | 状态 |
| ------------ | ------------------ | ---- |
| 关键词模块   | KeywordsCloud.tsx  | ✅   |
| 主题模块     | ThemeProvider.tsx  | ✅   |
| JD匹配模块   | JDMatcher.tsx      | ✅   |
| 知识图谱模块 | KnowledgeGraph.tsx | ✅   |

### Phase 3: 优化与部署（Week 4）

| 任务     | 交付物           | 状态 |
| -------- | ---------------- | ---- |
| 性能优化 | 代码分割、懒加载 | ✅   |
| 测试     | 单元测试         | 📋   |
| 部署     | Vercel配置       | ✅   |

## 目录结构

```
project-self-introduction-v1/
├── src/
│   ├── components/
│   │   ├── core/                      # 核心组件
│   │   ├── extensions/                # 扩展组件
│   │   └── common/                    # 通用组件
│   ├── hooks/                         # 自定义Hooks
│   ├── utils/                         # 工具函数
│   ├── types/                         # 类型定义
│   ├── data/                          # 数据文件
│   ├── styles/                        # 样式文件
│   ├── pages/                         # 页面组件
│   └── docs/                          # 文档
├── scripts/                           # 脚本
├── .trae/
│   ├── rules/                         # 开发规则
│   └── templates/                     # 模板
├── package.json
└── ...
```

## 数据格式

### 项目数据 (src/data/projects/\*.md)

```markdown
---
id: project-001
title: 项目标题
date: 2026-01-15
tags: [React, TypeScript, D3.js]
link: https://example.com
status: completed
---

## 项目描述

...
```

### 经历数据 (src/data/experiences/\*.md)

```markdown
---
id: exp-001
company: 公司名称
role: 职位
period: 2024-06 - 2026-04
tags: [React, Node.js]
location: 城市
---

## 工作描述

...
```

## 常用命令

| 命令                   | 说明           |
| ---------------------- | -------------- |
| `npm run init`         | 初始化环境     |
| `npm run dev`          | 启动开发服务器 |
| `npm run build`        | 构建生产版本   |
| `npm run test`         | 运行测试       |
| `npm run lint`         | ESLint检查     |
| `npm run lint:fix`     | ESLint自动修复 |
| `npm run format:write` | Prettier格式化 |
| `npm run typecheck`    | TypeScript检查 |
| `npm run doctor`       | 环境健康检查   |

## 开发规范

### 分支策略

- 使用 Trunk-Based Development (TBD)
- 所有功能在短命分支开发，完成后合并到 main

### 提交规范

遵循 Conventional Commits：

```bash
feat(hero): add hero component
fix(jd-matcher): correct keyword extraction
refactor(theme): simplify color variables
```

### Worktree使用

```bash
# 创建worktree
./scripts/create-worktree.sh feature-name

# 清理已合并的worktree
./scripts/cleanup-worktrees.sh
```

## 相关文档

- [产品需求文档](./FINAL_PRD.md)
- [技术架构文档](./ARCHITECTURE_DESIGN.md)
- [开发规则](../.trae/rules/project_rules.md)
- [日志埋点规范](../src/docs/LOGGING_GUIDE.md)
