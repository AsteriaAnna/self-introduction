# 任务卡片模板

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | |
| 负责人 | |
| 创建日期 | |
| 截止日期 | |
| 状态 | 待开始 / 进行中 / 已完成 |
| 优先级 | P0 / P1 / P2 |

## 任务目标

[描述这个任务要实现什么目标]

## 功能需求

### 来自PRD
- [ ] [需求ID] [需求描述]

### 详细说明
[更详细的功能描述，包括用户交互、边界条件等]

## 技术要求

### 组件结构
```
src/components/{core|extensions}/{ComponentName}/
├── {ComponentName}.tsx
├── {ComponentName}.styles.ts
└── index.ts
```

### 依赖关系
- 输入数据：
- 输出数据：
- 依赖组件：
- 被依赖组件：

### 接口定义

```typescript
interface ComponentProps {
  // 属性说明
}
```

## 验收标准

- [ ] 功能完整实现
- [ ] 通过所有测试
- [ ] ESLint检查通过
- [ ] TypeScript类型检查通过
- [ ] 响应式适配正常
- [ ] 日志埋点完整
- [ ] 错误处理完善

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| | | |

## 关联文档

- 功能规格：[FINAL_PRD.md](./FINAL_PRD.md)
- 技术架构：[ARCHITECTURE_DESIGN.md](./ARCHITECTURE_DESIGN.md)
- 日志规范：[src/docs/LOGGING_GUIDE.md](./src/docs/LOGGING_GUIDE.md)
- 开发规则：[.trae/rules/project_rules.md](./.trae/rules/project_rules.md)

## 开发日志

### YYYY-MM-DD
- [记录开发过程中的关键节点]

## 完成检查

- [ ] 代码已提交
- [ ] 已合并到main分支
- [ ] Worktree已清理
- [ ] 文档已更新
