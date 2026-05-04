# 个人展示网页 - 技术架构设计文档

## 文档信息
| 项目 | 内容 |
|------|------|
| 版本 | v1.1 |
| 创建日期 | 2026-05-04 |
| 更新日期 | 2026-05-04 |
| 文档类型 | 技术架构设计 |

---

## 1. 架构层级设计 (Architecture Layers)

### 1.1 分层架构图（前端边界）

本项目为**纯前端项目**，无后端服务。所有功能均在前端边界内实现。

```mermaid
flowchart TB
    subgraph FE["前端边界 (Frontend Boundary)"]
        subgraph UI["UI层 - React Components"]
            UI1["Page Layout<br/>React Router"]
            UI2["ProjectCards<br/>Tailwind CSS"]
            UI3["Timeline Items<br/>Tailwind CSS"]
            UI4["Modals<br/>Tailwind CSS"]
        end
        
        subgraph COMP["组件层 - React Components"]
            COMP1["Hero<br/>Tailwind"]
            COMP2["ProjectList<br/>Tailwind"]
            COMP3["Experience<br/>Tailwind"]
            COMP4["Keywords<br/>Tailwind"]
            COMP5["JDMatcher<br/>Tailwind"]
            COMP6["KnowledgeGraph<br/>D3.js"]
            COMP7["ThemeToggle<br/>Tailwind CSS"]
            COMP8["FilterPanel<br/>Tailwind CSS"]
        end
        
        subgraph STATE["状态层 - React Hooks"]
            ST1["DataStore<br/>useState/useContext"]
            ST2["ThemeState<br/>useState + localStorage"]
            ST3["JDMatchState<br/>useState"]
            ST4["FilterState<br/>useState"]
        end
        
        subgraph UTIL["工具层 - TypeScript"]
            UT1["MarkdownParser<br/>react-markdown"]
            UT2["KeywordMatcher<br/>纯函数"]
            UT3["GraphBuilder<br/>纯函数"]
            UT4["Storage<br/>localStorage API"]
        end
        
        subgraph DATA["数据层 - 静态文件"]
            D1["projects/*.md<br/>Markdown"]
            D2["experiences/*.md<br/>Markdown"]
            D3["config.json<br/>JSON"]
        end
    end
    
    UI1 --> COMP1
    UI2 --> COMP2
    UI3 --> COMP3
    UI4 --> COMP5
    
    UI --> COMP
    COMP --> STATE
    STATE --> UTIL
    UTIL --> DATA
```

### 1.2 层级职责说明

| 层级 | 职责 | 依赖方向 |
|------|------|---------|
| **UI层** | 页面布局、视觉呈现、用户交互 | 依赖组件层 |
| **组件层** | 业务组件封装、状态消费、事件处理 | 依赖状态层 |
| **状态层** | 数据管理、状态同步、缓存控制 | 依赖解析层 |
| **解析层** | 数据格式转换、内容解析、类型校验 | 依赖数据层 |
| **数据层** | 数据存储、文件管理、配置维护 | 无依赖 |

---

## 2. 模块职责边界 (Module Responsibilities)

### 2.1 核心模块

```mermaid
flowchart TB
    subgraph CORE["核心模块 (Core Modules)"]
        Hero["Hero Module<br/>职责：个人信息展示<br/>输入：config.json<br/>输出：UI组件<br/>状态：无"]
        
        ProjectList["ProjectList Module<br/>职责：项目列表展示与筛选<br/>输入：projects/*.md, filterState<br/>输出：项目卡片列表<br/>状态：筛选条件"]
        
        Experience["Experience Module<br/>职责：经历时间线展示<br/>输入：experiences/*.md<br/>输出：时间线组件<br/>状态：无"]
        
        MarkdownParser["MarkdownParser Module<br/>职责：Markdown文件解析<br/>输入：*.md文件内容<br/>输出：结构化数据对象<br/>状态：解析缓存"]
    end
```

### 2.2 扩展模块

```mermaid
flowchart TB
    subgraph EXT["扩展模块 (Extension Modules)"]
        Keywords["Keywords Module<br/>职责：关键词聚合与筛选<br/>输入：projects + experiences tags<br/>输出：关键词云组件<br/>状态：选中的关键词<br/>接口：onKeywordClick(keyword)"]
        
        Theme["Theme Module<br/>职责：主题切换管理<br/>输入：用户切换操作<br/>输出：CSS变量更新<br/>状态：当前主题<br/>接口：toggleTheme(), getTheme()"]
        
        JDMatcher["JDMatcher Module<br/>职责：JD关键词匹配<br/>输入：JD文本, 项目/经历数据<br/>输出：匹配结果、高亮状态<br/>状态：匹配结果<br/>接口：match(jdText), clear()"]
        
        KnowledgeGraph["KnowledgeGraph Module<br/>职责：知识图谱可视化<br/>输入：节点数据、边数据<br/>输出：D3.js图谱<br/>状态：选中节点、缩放级别<br/>接口：onNodeClick(id), zoom(level)"]
    end
```

### 2.3 模块间依赖关系

```mermaid
flowchart TB
    App["App.tsx"]
    
    App --> ThemeProvider
    App --> DataStore
    App --> RouterNav
    
    ThemeProvider --> CoreModules
    DataStore --> CoreModules
    DataStore --> ExtensionModules
    
    subgraph CoreModules["Core Modules"]
        Hero["Hero"]
        ProjectList["ProjectList"]
        Experience["Experience"]
        Parser["Parser"]
    end
    
    subgraph ExtensionModules["Extension Modules"]
        Keywords["Keywords"]
        Theme["Theme"]
        JDMatcher["JDMatcher"]
        Graph["KnowledgeGraph"]
    end
    
    subgraph RouterNav["Router/Nav"]
        direction LR
    end
```

---

## 3. 数据流向设计 (Data Flow)

### 3.1 页面加载流程

```mermaid
flowchart TD
    Start["用户访问网站"]
    Init["初始化应用<br/>- 加载配置<br/>- 初始化主题"]
    Parse["解析Markdown<br/>- 读取文件<br/>- 提取元数据<br/>- 解析正文"]
    Build["构建数据存储<br/>- 项目列表<br/>- 经历列表<br/>- 关键词索引"]
    Render["渲染页面组件<br/>- Hero<br/>- ProjectList<br/>- Experience"]
    End["页面展示完成"]
    
    Start --> Init
    Init --> Parse
    Parse --> Build
    Build --> Render
    Render --> End
```

### 3.2 JD匹配流程

```mermaid
flowchart TD
    Start["用户粘贴JD文本"]
    Extract["提取关键词<br/>- 分词处理<br/>- 过滤停用词<br/>- 匹配技能库"]
    Match["标签匹配<br/>- 遍历项目<br/>- 遍历经历<br/>- 计算匹配度"]
    Update["更新UI状态<br/>- 高亮匹配项<br/>- 显示匹配度<br/>- 滚动到结果"]
    End["匹配结果展示"]
    
    Start --> Extract
    Extract --> Match
    Match --> Update
    Update --> End
```

### 3.3 主题切换流程

```mermaid
flowchart TD
    Start["用户点击主题切换"]
    Update["更新主题状态<br/>- light→dark<br/>- dark→light"]
    Persist["持久化存储<br/>- localStorage"]
    Apply["应用CSS变量<br/>- 背景色<br/>- 文字色<br/>- 强调色"]
    End["主题切换完成"]
    
    Start --> Update
    Update --> Persist
    Persist --> Apply
    Apply --> End
```

### 3.4 知识图谱交互流程

```mermaid
flowchart TD
    Start["用户访问图谱页面"]
    Build["构建图谱数据<br/>- 聚合节点<br/>- 生成边<br/>- 计算权重"]
    Render["D3.js渲染<br/>- 力导向布局<br/>- 节点绘制<br/>- 边绘制"]
    Bind["绑定交互事件<br/>- 点击跳转<br/>- 悬停提示<br/>- 缩放拖拽"]
    End["图谱可交互"]
    
    Start --> Build
    Build --> Render
    Render --> Bind
    Bind --> End
```

---

## 4. 接口设计 (Interface Design)

### 4.1 核心接口

```typescript
// ==================== 数据接口 ====================

interface Project {
  id: string;
  title: string;
  description: string;
  skillTags: string[];      // 技术标签：React, TypeScript 等
  abilityTags: string[];   // 能力标签：团队协作, 学习能力 等
  link?: string;
  image?: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  content: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  skillTags: string[];      // 技术标签：React, Node.js 等
  abilityTags: string[];   // 能力标签：团队管理, 沟通 等
  location?: string;
  content: string;
}

interface Keyword {
  name: string;
  count: number;
  type: 'skill' | 'tool' | 'domain';
}

// ==================== 状态接口 ====================

interface ThemeState {
  mode: 'light' | 'dark';
  toggle: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

interface FilterState {
  selectedKeyword: string | null;
  setSelectedKeyword: (keyword: string | null) => void;
  clearFilter: () => void;
}

interface JDMatchState {
  jdText: string;
  matchedProjectIds: string[];
  matchedExperienceIds: string[];
  matchScore: number;
  setJDText: (text: string) => void;
  clearMatch: () => void;
}

// ==================== 组件接口 ====================

interface HeroProps {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

interface ProjectListProps {
  projects: Project[];
  highlightedIds?: string[];
  filterKeyword?: string | null;
  onProjectClick?: (project: Project) => void;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
  highlightedIds?: string[];
  filterKeyword?: string | null;
}

interface KeywordsCloudProps {
  keywords: Keyword[];
  selectedKeyword: string | null;
  onKeywordClick: (keyword: string) => void;
}

interface JDMatcherProps {
  onMatch: (result: JDMatchResult) => void;
  onClear: () => void;
}

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick: (node: GraphNode) => void;
}

// ==================== 图谱数据接口 ====================

interface GraphNode {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'experience';
  weight: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

interface JDMatchResult {
  keywords: string[];
  matchedProjects: string[];
  matchedExperiences: string[];
  matchScore: number;
}
```

### 4.2 Hook接口

```typescript
// ==================== 自定义Hooks ====================

interface UseThemeReturn {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface UseMarkdownReturn {
  data: Project[] | Experience[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseJDMatchReturn {
  match: (jdText: string) => JDMatchResult;
  clear: () => void;
  result: JDMatchResult | null;
  isMatching: boolean;
}

interface UseFilterReturn {
  selectedKeyword: string | null;
  setSelectedKeyword: (keyword: string | null) => void;
  filteredProjects: Project[];
  filteredExperiences: Experience[];
  clearFilter: () => void;
}
```

---

## 5. 文件结构设计 (File Structure)

```
project-self-introduction-v1/
├── src/
│   ├── components/                    # 组件目录
│   │   ├── core/                      # 核心组件
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Hero.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── ProjectList/
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectList.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── Experience/
│   │   │       ├── ExperienceTimeline.tsx
│   │   │       ├── TimelineItem.tsx
│   │   │       ├── Experience.styles.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── extensions/                # 扩展组件
│   │   │   ├── Keywords/
│   │   │   │   ├── KeywordsCloud.tsx
│   │   │   │   ├── KeywordTag.tsx
│   │   │   │   ├── Keywords.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── Theme/
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   ├── ThemeProvider.tsx
│   │   │   │   ├── Theme.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── JDMatcher/
│   │   │   │   ├── JDMatcher.tsx
│   │   │   │   ├── JDInput.tsx
│   │   │   │   ├── MatchResult.tsx
│   │   │   │   ├── JDMatcher.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── KnowledgeGraph/
│   │   │       ├── KnowledgeGraph.tsx
│   │   │       ├── GraphCanvas.tsx
│   │   │       ├── NodeTooltip.tsx
│   │   │       ├── KnowledgeGraph.styles.ts
│   │   │       └── index.ts
│   │   │
│   │   └── common/                    # 通用组件
│   │       ├── Layout/
│   │       ├── Button/
│   │       ├── Card/
│   │       └── Modal/
│   │
│   ├── hooks/                         # 自定义Hooks
│   │   ├── useTheme.ts
│   │   ├── useMarkdown.ts
│   │   ├── useJDMatch.ts
│   │   ├── useFilter.ts
│   │   └── useGraph.ts
│   │
│   ├── utils/                         # 工具函数
│   │   ├── markdownParser.ts          # Markdown解析
│   │   ├── keywordMatcher.ts          # 关键词匹配
│   │   ├── graphBuilder.ts            # 图谱数据构建
│   │   └── storage.ts                 # 本地存储
│   │
│   ├── types/                         # 类型定义
│   │   ├── project.ts
│   │   ├── experience.ts
│   │   ├── theme.ts
│   │   ├── graph.ts
│   │   └── index.ts
│   │
│   ├── data/                          # 数据文件
│   │   ├── projects/                  # 项目Markdown
│   │   │   ├── project-001.md
│   │   │   └── project-002.md
│   │   ├── experiences/               # 经历Markdown
│   │   │   ├── exp-001.md
│   │   │   └── exp-002.md
│   │   └── config.json                # 站点配置
│   │
│   ├── styles/                        # 全局样式
│   │   ├── themes.css                 # 主题变量
│   │   ├── globals.css                # 全局样式
│   │   └── variables.css              # CSS变量
│   │
│   ├── pages/                         # 页面组件
│   │   ├── Home.tsx                   # 首页
│   │   ├── Graph.tsx                  # 知识图谱页
│   │   └── NotFound.tsx               # 404页面
│   │
│   ├── App.tsx                        # 应用入口
│   └── main.tsx                       # 渲染入口
│
├── public/                            # 静态资源
│   ├── images/
│   └── favicon.ico
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 6. 开发阶段规划 (Development Phases)

### Phase 1: MVP核心 (Week 1-2)

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 项目初始化 | Vite + React + Tailwind配置 | 项目可运行 |
| Markdown解析 | 解析工具函数 | 正确解析Front Matter |
| Hero组件 | Hero.tsx | 显示个人信息 |
| ProjectList组件 | ProjectList.tsx | 卡片列表展示 |
| Experience组件 | ExperienceTimeline.tsx | 时间线展示 |
| 响应式布局 | 全局样式 | 移动端适配 |

### Phase 2: 扩展模块 (Week 3-4)

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 关键词模块 | KeywordsCloud.tsx | 标签聚合展示 |
| 主题模块 | ThemeProvider.tsx | 明暗切换 |
| JD匹配模块 | JDMatcher.tsx | 关键词匹配 |
| 知识图谱模块 | KnowledgeGraph.tsx | D3.js图谱 |

### Phase 3: 优化与部署 (Week 4)

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 性能优化 | 代码分割、懒加载 | 首屏<2s |
| 测试 | 单元测试 | 覆盖率>70% |
| 部署 | Vercel配置 | 线上可访问 |

---

## 7. 风险与缓解 (Risks & Mitigation)

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|---------|
| Markdown解析性能 | 低 | 中 | 使用缓存、按需加载 |
| D3.js学习曲线 | 中 | 中 | 参考成熟案例、逐步实现 |
| 主题切换样式冲突 | 低 | 中 | 使用CSS变量统一管理 |
| 移动端适配复杂 | 中 | 高 | 采用Tailwind响应式类 |

---

## 附录：技术栈确认

| 类别 | 技术选型 | 版本 |
|------|---------|------|
| 框架 | React | 18.x |
| 构建工具 | Vite | 5.x |
| 样式 | Tailwind CSS | 3.x |
| 图表 | D3.js | 7.x |
| Markdown解析 | react-markdown | 9.x |
| 路由 | React Router | 6.x |
| 部署 | Vercel | - |
