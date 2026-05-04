# 个人展示网页 - 最终产品需求文档 (FINAL\_PRD)

## 文档信息

| 项目   | 内容         |
| ---- | ---------- |
| 产品名称 | 个人展示网页     |
| 版本   | v1.0       |
| 创建日期 | 2026-05-04 |
| 状态   | 已确认        |

***

## \[Core Value]

简洁高效的个人项目与经历展示平台，支持JD智能匹配与知识图谱可视化。

## \[First Action Path]

游客访问 -> 浏览主页 -> 查看项目/经历详情 -> (可选) JD匹配 -> (可选) 知识图谱导航。

***

## 1. 问题陈述 (Problem Statement)

### 1.1 背景

当前个人简历或作品集通常以PDF或静态文档形式存在，缺乏交互性和视觉吸引力，难以在短时间内给访问者留下深刻印象。需要一个现代化、响应式的个人展示平台，能够直观地展示个人能力、项目经历和专业技能，同时支持与招聘需求的智能匹配。

### 1.2 目标用户

- **主要用户**：潜在雇主、合作伙伴、学术导师
- **次要用户**：同行、朋友、其他感兴趣的访问者

### 1.3 核心痛点

- PDF简历难以展示项目细节和交互内容
- 静态网页缺乏响应式设计，在移动端体验不佳
- 技能和关键词展示不够直观，难以快速捕捉核心能力
- 无法快速判断候选人是否匹配特定岗位需求

***

3\. 技术选型 (Technical Stack)

### 3.1 前端

| 类别         | 技术选型                    | 说明             |
| ---------- | ----------------------- | -------------- |
| 框架         | React + Vite            | 快速开发、热更新支持     |
| 样式         | Tailwind CSS            | 响应式设计、原子化CSS   |
| 图表         | D3.js                   | 知识图谱可视化        |
| Markdown解析 | react-markdown / marked | 解析Markdown数据文件 |

### 3.2 数据存储

| 类别   | 方案         | 说明        |
| ---- | ---------- | --------- |
| 项目数据 | Markdown文件 | 便于编辑、版本控制 |
| 经历数据 | Markdown文件 | 便于编辑、版本控制 |
| 配置数据 | JSON文件     | 站点配置、主题配置 |

### 3.3 部署

| 平台      | 说明            |
| ------- | ------------- |
| Vercel  | 推荐，自动部署、CDN加速 |
| Netlify | 备选方案          |

***

## 4. 项目架构 (Architecture)

```
project-self-introduction-v1/
├── src/
│   ├── components/
│   │   ├── Hero.tsx              # 主页头部
│   │   ├── ProjectCard.tsx       # 项目卡片
│   │   ├── Experience.tsx        # 经历时间线
│   │   ├── Keywords.tsx          # 关键词云
│   │   ├── JDMatcher.tsx         # JD匹配组件
│   │   ├── KnowledgeGraph.tsx    # 知识图谱组件 (D3.js)
│   │   └── ThemeToggle.tsx       # 主题切换组件
│   ├── data/
│   │   ├── projects/             # 项目Markdown文件目录
│   │   │   ├── project-001.md
│   │   │   └── project-002.md
│   │   ├── experiences/          # 经历Markdown文件目录
│   │   │   ├── exp-001.md
│   │   │   └── exp-002.md
│   │   └── config.json           # 站点配置
│   ├── hooks/
│   │   ├── useTheme.ts           # 主题Hook
│   │   ├── useJDMatch.ts         # JD匹配Hook
│   │   └── useMarkdown.ts        # Markdown解析Hook
│   ├── utils/
│   │   ├── markdownParser.ts     # Markdown解析工具
│   │   ├── keywordMatcher.ts     # 关键词匹配算法
│   │   └── graphBuilder.ts       # 知识图谱数据构建
│   ├── pages/
│   │   ├── index.tsx             # 首页
│   │   └── graph.tsx             # 知识图谱页面
│   ├── styles/
│   │   └── themes.css            # 主题样式变量
│   └── App.tsx
├── public/
└── package.json
```

***

## 5. 功能需求 (Functional Requirements)

### 5.1 主页展示 (P0)

| ID     | 需求描述           | 验收标准                                              |
| ------ | -------------- | ------------------------------------------------- |
| FR-001 | Hero区域展示个人基本信息 | - 显示姓名、职位/身份、简短介绍- 支持添加个人头像- 布局清晰，视觉层次分明          |
| FR-002 | 项目列表展示         | - 以卡片形式展示项目- 每个卡片包含：项目标题、描述、标签、日期- 支持点击查看项目链接（如有） |
| FR-003 | 经历时间线展示        | - 以时间线形式展示工作/学习经历- 每个经历包含：公司/学校、职位、时间段、描述、标签      |
| FR-004 | 关键词/技能展示       | - 聚合展示项目和经历中的标签- 标签大小或颜色可根据出现频率区分- 点击标签可筛选相关项目/经历 |

### 5.2 JD匹配功能 (P1)

| ID     | 需求描述   | 验收标准                                    |
| ------ | ------ | --------------------------------------- |
| FR-005 | JD文本输入 | - 提供文本输入区域- 支持粘贴JD文本- 实时解析关键词           |
| FR-006 | 关键词匹配  | - 前端提取JD中的技能关键词- 与项目/经历标签进行匹配- 匹配度计算并展示 |
| FR-007 | 高亮显示   | - 匹配的标签高亮显示- 相关项目/经历卡片高亮- 提供匹配度百分比      |

### 5.3 知识图谱 (P1)

| ID     | 需求描述 | 验收标准                                       |
| ------ | ---- | ------------------------------------------ |
| FR-008 | 图谱展示 | - 使用D3.js绘制关系图谱- 节点包含：技能、项目、经历- 边表示关联关系    |
| FR-009 | 交互功能 | - 节点可点击跳转到对应详情- 鼠标悬停显示详细信息- 支持缩放和拖拽        |
| FR-010 | 视觉设计 | - 不同类型节点使用不同颜色/形状- 边的粗细表示关联强度- 布局清晰，避免节点重叠 |

### 5.4 主题切换 (P1)

| ID     | 需求描述   | 验收标准                                          |
| ------ | ------ | --------------------------------------------- |
| FR-011 | 明暗主题切换 | - 提供浅色/深色模式切换按钮- 切换动画平滑- 记住用户偏好（localStorage） |
| FR-012 | 主题适配   | - 所有组件支持双主题- 颜色对比度符合可访问性标准- 图片/图标在双主题下均清晰可见   |

### 5.5 响应式设计 (P0)

| ID     | 需求描述  | 验收标准                                |
| ------ | ----- | ----------------------------------- |
| FR-013 | 桌面端适配 | - 在1024px以上屏幕正常显示- 布局合理，内容居中        |
| FR-014 | 平板端适配 | - 在768px-1024px屏幕正常显示- 布局自动调整       |
| FR-015 | 移动端适配 | - 在768px以下屏幕正常显示- 菜单和内容自适应- 触摸友好的交互 |

### 5.6 数据管理 (P1)

| ID     | 需求描述         | 验收标准                                                      |
| ------ | ------------ | --------------------------------------------------------- |
| FR-016 | Markdown数据存储 | - 项目数据以Markdown格式存储- 经历数据以Markdown格式存储- 支持Front Matter元数据 |
| FR-017 | 数据解析         | - 自动解析Markdown文件- 提取元数据和内容- 生成结构化数据                       |

***

## 6. 数据模型 (Data Model)

### 6.1 Project Markdown 格式

```markdown
---
id: project-001
title: 项目标题
date: 2026-01-15
tags: [React, TypeScript, D3.js]
link: https://example.com
image: /images/project-001.png
status: completed
---

## 项目描述

这里是项目的详细描述内容...

## 技术栈
- React
- TypeScript
- D3.js

## 主要成果
- 成果1
- 成果2
```

### 6.2 Experience Markdown 格式

```markdown
---
id: exp-001
company: 公司名称
role: 职位
period: 2024-06 - 2026-04
tags: [React, Node.js, 团队管理]
location: 城市
---

## 工作描述

这里是工作经历的详细描述...

## 主要职责
- 职责1
- 职责2

## 主要成就
- 成就1
- 成就2
```

### 6.3 TypeScript 接口定义

```typescript
// 项目数据结构
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  content: string;  // Markdown内容
}

// 经历数据结构
interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  location?: string;
  content: string;  // Markdown内容
}

// 知识图谱节点
interface GraphNode {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'experience';
  weight: number;  // 关联强度
}

// 知识图谱边
interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

// JD匹配结果
interface JDMatchResult {
  keywords: string[];          // 提取的关键词
  matchedProjects: string[];   // 匹配的项目ID
  matchedExperiences: string[]; // 匹配的经历ID
  matchScore: number;          // 匹配度百分比
}

// 主题配置
interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}
```

***

## 7. 状态机 (State Machine)

### 7.1 主题状态

```
ThemeState: light <-> dark
```

### 7.2 JD匹配状态

```
JDMatchState:
  idle -> parsing -> matched -> idle
         (输入JD)  (解析完成) (清除)
```

### 7.3 知识图谱交互状态

```
GraphState:
  default -> hovered -> selected -> default
            (悬停)     (点击选中)
```

***

## 8. 里程碑计划 (Milestone Plan)

| 阶段  | 时间     | 交付内容                       | 优先级 |
| --- | ------ | -------------------------- | --- |
| 阶段1 | Week 1 | 项目初始化、基础布局、Hero区域、主题切换基础   | P0  |
| 阶段2 | Week 2 | 项目卡片组件、项目列表展示、Markdown数据解析 | P0  |
| 阶段3 | Week 2 | 经历时间线组件、经历数据展示             | P0  |
| 阶段4 | Week 3 | 关键词展示组件、标签筛选功能             | P1  |
| 阶段5 | Week 3 | JD匹配功能、关键词高亮               | P1  |
| 阶段6 | Week 4 | 知识图谱组件、D3.js集成             | P1  |
| 阶段7 | Week 4 | 响应式适配、测试、部署                | P0  |

***

## 9. 非功能需求 (Non-Functional Requirements)

| ID      | 类别   | 需求描述                                |
| ------- | ---- | ----------------------------------- |
| NFR-001 | 性能   | 页面首次加载时间 < 2秒                       |
| NFR-002 | 性能   | 知识图谱渲染流畅，帧率 > 30fps                 |
| NFR-003 | 可用性  | 支持主流浏览器（Chrome、Firefox、Safari、Edge） |
| NFR-004 | 可维护性 | 代码结构清晰，注释完善，易于后续扩展                  |
| NFR-005 | 可访问性 | 遵循基本的WCAG可访问性原则                     |
| NFR-006 | 兼容性  | 主题切换在所有组件上一致生效                      |

***

## 10. 风险评估 (Risk Assessment)

| 风险           | 可能性 | 影响 | 缓解措施                          |
| ------------ | --- | -- | ----------------------------- |
| 移动端适配复杂      | 中   | 高  | 采用Tailwind CSS响应式类，从设计初期考虑移动端 |
| D3.js学习曲线    | 中   | 中  | 参考成熟案例，逐步实现功能                 |
| JD关键词匹配准确度   | 中   | 中  | 使用多关键词库，支持同义词匹配               |
| Markdown解析性能 | 低   | 低  | 使用成熟的解析库，缓存解析结果               |
| 主题切换样式冲突     | 低   | 中  | 使用CSS变量，统一管理颜色系统              |

***

## 11. 验收标准 (Acceptance Criteria)

### 11.1 功能验收

- [ ] Hero区域正确显示个人信息
- [ ] 项目列表以卡片形式展示，包含所有必要信息
- [ ] 经历以时间线形式展示
- [ ] 关键词正确聚合和展示
- [ ] 点击标签可筛选相关内容
- [ ] JD匹配功能正常工作，关键词高亮显示
- [ ] 知识图谱正确展示技能/项目/经历的关联关系
- [ ] 节点可点击跳转到对应详情
- [ ] 明暗主题切换正常工作
- [ ] 在桌面、平板、手机上均能正常显示和交互

### 11.2 技术验收

- [ ] 使用React + Vite + Tailwind CSS技术栈
- [ ] 使用D3.js实现知识图谱
- [ ] 数据存储为Markdown文件
- [ ] 无数据库依赖
- [ ] 代码结构清晰，符合架构文档要求

***

## 12. Not-To-Do List

以下功能明确不在本项目范围内：

- ❌ 后端服务（本项目为纯静态站点）
- ❌ 数据库（使用Markdown文件存储）
- ❌ 用户认证系统
- ❌ 在线编辑功能（通过Git直接编辑Markdown文件）
- ❌ AI智能推荐（JD匹配仅使用前端关键词匹配）
- ❌ 多语言支持（V1版本仅支持中文）
- ❌ 评论系统
- ❌ 访问统计（可后续集成第三方服务）
- ❌ 社交分享功能
- ❌ 导出PDF功能

***

## 附录

### 附录A：关键词匹配算法说明

JD匹配功能采用前端关键词匹配策略：

1. **关键词提取**：从JD文本中提取技能关键词（基于预定义关键词库）
2. **标签匹配**：将提取的关键词与项目/经历的tags字段进行匹配
3. **匹配度计算**：`匹配度 = 匹配关键词数 / 总关键词数 * 100%`
4. **高亮显示**：匹配的标签和卡片添加高亮样式

### 附录B：知识图谱数据构建

知识图谱数据从Markdown文件自动生成：

1. **节点生成**：
   - 技能节点：从所有tags聚合去重
   - 项目节点：每个项目生成一个节点
   - 经历节点：每个经历生成一个节点
2. **边生成**：
   - 项目-技能边：项目tags中的每个技能
   - 经历-技能边：经历tags中的每个技能
   - 边权重：根据共现频率计算

### 附录C：主题切换实现方案

使用CSS变量 + Tailwind CSS实现：

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-color: #3b82f6;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #60a5fa;
}
```

用户偏好存储在localStorage中，页面加载时自动应用。
