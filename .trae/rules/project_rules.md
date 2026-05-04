# 个人展示网页 - 项目开发规则

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0 |
| 创建日期 | 2026-05-04 |
| 文档类型 | 开发规则 |

---

## 1. 分支策略：Trunk-Based Development (TBD)

### 1.1 核心原则

- **单一主干**：团队共享一个名为 `main` 的单一、长寿的、永远处于可发布状态的主分支
- **短命分支**：所有开发工作都在极短生命周期的分支上进行，分支存活不超过1天
- **小步快跑**：每次提交只做一件事，完成后立即合并回 `main`

### 1.2 分支命名规范

```
feat/<功能名称>          # 新功能
fix/<问题描述>           # Bug修复
refactor/<范围>         # 重构
docs/<范围>             # 文档更新
chore/<范围>            # 杂项任务
```

示例：
```
feat/hero-component
fix/theme-toggle-bug
refactor/markdown-parser
```

### 1.3 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

[body]

[footer]
```

**Type类型**：
- `feat`: 新功能
- `fix`: Bug修复
- `refactor`: 重构
- `docs`: 文档
- `style`: 格式（不影响代码含义）
- `test`: 测试
- `chore`: 杂项

**示例**：
```
feat(hero): add hero component with avatar support

- Display user name, title, bio
- Support optional avatar image
- Add responsive layout

Closes #12
```

---

## 2. Worktree并行开发策略

### 2.1 何时使用Worktree

- 需要同时开发多个功能
- 一个任务需要高风险实验
- 需要让多个AI代理并行工作（赛马策略）
- 需要快速切换上下文而不丢失状态

### 2.2 创建Worktree

```bash
# 使用脚本创建（推荐）
./scripts/create-worktree.sh hero-component main claude

# 手动创建
git worktree add -b feat/hero-component ../project-self-introduction-hero main
```

### 2.3 赛马策略

当需要为同一功能探索多个方案时：

```bash
# 创建多个worktree
./scripts/create-worktree.sh jd-matcher-v1 main claude
./scripts/create-worktree.sh jd-matcher-v2 main gpt
./scripts/create-worktree.sh jd-matcher-v3 main gemini

# 每个worktree使用不同的prompt进行开发
# 评审后选择最优方案
# 清理失败的worktree
./scripts/cleanup-worktrees.sh
```

### 2.4 清理已合并的Worktree

```bash
# 自动清理
./scripts/cleanup-worktrees.sh

# 手动清理
git worktree remove ../project-self-introduction-feature
git branch -d feat/feature-name
```

---

## 3. 原子化提交规则

### 3.1 原则

**一个提交只做一件事**。在将AI生成的大块代码合并前，应将其拆分为多个逻辑上独立的、可单独验证的小提交。

### 3.2 正确示例

```bash
# 提交1：添加API工具函数
git add src/utils/markdownParser.ts
git commit -m "feat(parser): add markdown parser utility

- Parse front matter metadata
- Extract tags and content

Closes #15"

# 提交2：添加类型定义
git add src/types/index.ts
git commit -m "feat(types): add Project and Experience interfaces

- Define Project interface with tags, status
- Define Experience interface with company, role

Refs #15"

# 提交3：添加组件
git add src/components/core/Hero/
git commit -m "feat(hero): add Hero component

- Display user name, title, bio
- Support optional avatar
- Add responsive styles"

# 提交4：集成到App
git add src/App.tsx
git commit -m "feat(app): integrate Hero component

- Add Hero to Home page
- Configure routing
- Add error boundary"
```

### 3.3 错误示例

```bash
# ❌ 一个提交做太多事
git add .
git commit -m "add hero component and fix stuff"

# ❌ 提交包含未完成的工作
git commit -m "wip: hero component (not working yet)"

# ❌ 提交无关的变更
git commit -m "add hero and update dependencies"
```

---

## 4. 错误处理规则

### 4.1 30秒报错定位流程

当弹出错误时，按以下流程快速定位：

**1. 冷静阅读错误信息（5秒）**
- 包含 "not found"、"undefined"、"is required"？
- 包含 "type mismatch"、"400/500"？

**2. 判断错误类别（10秒）**

| 错误类型 | 关键词 | 第一反应 |
|---------|-------|---------|
| **环境类** | required, environment, .env | 检查配置文件 |
| **依赖类** | module not found, cannot find | npm install |
| **逻辑类** | undefined, cannot read | 检查代码逻辑 |
| **类型类** | type, assignable | 对照类型定义 |
| **接口契约类** | 401/403/400, api | 检查接口文档 |

**3. 快速验证假设（5秒）**
- 怀疑环境变量：`log.debug('Checking env', { key: 'XXX', value: process.env.XXX })`
- 怀疑依赖：`npm list <package>`
- 怀疑逻辑：打印中间值
- 怀疑类型：对照错误行看数据类型

### 4.2 最小复现模板

向AI或他人求助时，使用以下模板：

```markdown
## 问题描述
[一句话概括错误现象]

## 环境信息
- Node.js版本：18.x
- npm版本：10.x
- 操作系统：Windows/macOS/Linux
- 框架：React 18 + Vite 5

## 重现步骤
1. [步骤1]
2. [步骤2]
3. [触发错误]

## 最小代码
```typescript
// 精简的复现代码
```

## 预期结果
[期望的行为]

## 实际结果
[实际发生的错误]
```

### 4.3 禁止事项

- ❌ 禁止使用 `as any` 跳过类型检查
- ❌ 禁止使用 `// @ts-ignore`
- ❌ 禁止吞掉错误而不处理
- ❌ 禁止在循环中打印调试日志

---

## 5. 日志埋点规则

### 5.1 必须在以下位置打日志

**入口日志（INFO）**：
```typescript
log.info(`==> Fetch data request`, { userId, filterKeyword })
```

**出口日志（INFO）**：
```typescript
log.info(`<== Fetch data completed`, { success: true, duration_ms: 52 })
```

**关键业务动作（INFO）**：
```typescript
log.info(`User [${userId}] clicked project card`, { projectId })
```

**错误日志（ERROR）**：
```typescript
log.error(`Failed to parse markdown`, { filePath }, error as Error)
```

### 5.2 禁止事项

- ❌ 禁止在日志中打印密码、token、手机号（系统自动脱敏）
- ❌ 禁止使用 console.log/console.error（必须使用logger）
- ❌ 禁止在高频循环中打印DEBUG日志
- ❌ 禁止记录无意义的日志如 "进入函数"

---

## 6. 代码审查清单

### 6.1 AI提交审查重点

- [ ] 代码是否删除了已有功能？（AI常见问题）
- [ ] 是否有未处理的错误边界？
- [ ] 是否有类型安全隐患？
- [ ] 是否引入了性能问题？
- [ ] 是否遵循了项目结构？

### 6.2 提交前必查

```bash
# 1. 运行类型检查
npm run typecheck

# 2. 运行代码检查
npm run lint

# 3. 运行测试
npm run test

# 4. 格式化代码
npm run format:write
```

### 6.3 提交信息审查

- [ ] 是否符合 Conventional Commits 格式？
- [ ] Subject是否简洁明了？
- [ ] 是否关联了相关Issue？

---

## 7. 开发流程

### 7.1 日常开发流程

```
1. 每天开始工作前
   - git pull origin main
   - npm run doctor 检查环境

2. 开始新任务
   - 创建worktree: ./scripts/create-worktree.sh <task-name>
   - 阅读TASK.md了解任务详情

3. 开发过程中
   - 遵循原子化提交原则
   - 每个功能点单独提交
   - 提交前运行检查

4. 完成任务后
   - 合并到main分支
   - 清理worktree: ./scripts/cleanup-worktrees.sh
```

### 7.2 高风险任务流程

对于AI重构或实验性任务：

```bash
# 1. 创建专门用于实验的worktree
./scripts/create-worktree.sh risky-refactor main claude

# 2. 在worktree中大胆尝试
cd ../project-self-introduction-risky-refactor

# 3. 如果成功，合并到main
git checkout main
git merge feat/risky-refactor

# 4. 如果失败，直接删除worktree
git worktree remove ../project-self-introduction-risky-refactor
git branch -D feat/risky-refactor
```

---

## 8. 环境检查规则

### 8.1 Doctor检查项

每次开发前运行 `npm run doctor`：

| 检查项 | 说明 |
|-------|------|
| Node.js版本 | 必须是18.20.4（Volta锁定） |
| npm版本 | 必须是10.8.0（Volta锁定） |
| Dependencies | package-lock.json必须同步 |
| TypeScript | 必须无类型错误 |
| Vite Config | 必须存在 |
| Tailwind Config | 必须存在 |

### 8.2 环境问题处理

```bash
# 依赖不同步
npm install

# TypeScript错误
npm run typecheck  # 查看具体错误

# Volta版本不对
volta pin node@18.20.4
volta pin npm@10.8.0
```

---

## 9. 附录：AI协作守则

### 9.1 给AI的指令模板

```
你是一名具有丰富生产环境经验的前端工程师。

【项目背景】
- 技术栈：React 18 + Vite 5 + Tailwind CSS + TypeScript
- 项目类型：个人展示网页（静态站点）
- 数据存储：Markdown文件

【任务】
[描述具体任务]

【约束】
1. 遵循项目结构（见ARCHITECTURE_DESIGN.md）
2. 使用结构化日志（见src/docs/LOGGING_GUIDE.md）
3. 所有组件必须使用ErrorBoundary错误处理
4. 遵循原子化提交原则
5. 禁止删除任何已有代码，除非明确要求

【验收标准】
[列出具体的验收标准]
```

### 9.2 AI工作后的检查

AI完成工作后，必须检查：

1. **代码完整性**：是否有代码被意外删除？
2. **功能正确性**：功能是否按预期工作？
3. **类型安全**：是否有TypeScript错误？
4. **日志规范**：是否添加了适当的日志？
5. **错误处理**：是否有适当的错误边界？

---

## 10. 文件结构规范

```
src/
├── components/
│   ├── core/                    # 核心业务组件
│   │   ├── Hero/
│   │   ├── ProjectList/
│   │   └── Experience/
│   ├── extensions/              # 扩展功能组件
│   │   ├── Keywords/
│   │   ├── Theme/
│   │   ├── JDMatcher/
│   │   └── KnowledgeGraph/
│   └── common/                  # 通用组件
│       ├── ErrorBoundary/
│       └── LogProvider/
├── hooks/                       # 自定义Hooks
├── utils/                       # 工具函数
├── types/                       # 类型定义
├── data/                        # 数据文件
├── styles/                      # 样式文件
├── pages/                       # 页面组件
└── docs/                        # 文档
```

**每个组件目录必须包含**：
- `index.ts` 导出文件
- `*.tsx` 组件文件
- `*.styles.ts` 样式文件（如需要）
