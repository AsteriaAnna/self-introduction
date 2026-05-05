# 日志埋点规范指南

## 概述

本文档定义项目中的日志埋点标准，确保所有日志符合结构化日志规范，便于问题排查和系统监控。

## 日志格式

所有日志输出为JSON格式，字段说明：

| 字段         | 说明              | 示例                     |
| ------------ | ----------------- | ------------------------ |
| timestamp    | ISO 8601格式时间  | 2026-05-04T10:30:25.123Z |
| level        | 日志级别          | DEBUG/INFO/WARN/ERROR    |
| service_name | 服务名称          | self-introduction-web    |
| traceId      | 请求追踪ID        | abc123-def456            |
| thread_name  | 线程名称          | main                     |
| logger_name  | 日志记录器名称    | HeroComponent            |
| message      | 日志消息          | User profile loaded      |
| details      | 业务详情对象      | {userId: "123"}          |
| stack_trace  | 错误堆栈(仅ERROR) | Error stack...           |

## 日志级别使用场景

| 级别      | 场景                               | 示例                              |
| --------- | ---------------------------------- | --------------------------------- |
| **DEBUG** | 复杂逻辑调试、中间变量             | Loop 1: memberId=123              |
| **INFO**  | 入口/出口、关键业务动作、结果+耗时 | ==> Send message request received |
| **WARN**  | 外部服务异常但可恢复               | APNS push failed, retrying...     |
| **ERROR** | 导致功能失败的异常                 | Insert message failed. msgId=123  |

## 埋点原则

### 原则一：入口和出口必须打日志

```typescript
// ✅ 正确示例
import { useModuleLogger } from '@hooks/useLogger';

function MyComponent() {
  const log = useModuleLogger('MyComponent');

  const fetchData = async (userId: string) => {
    log.info(`==> Fetch user data request received`, { userId });

    const endTimer = log.startTimer();
    try {
      const data = await api.getUser(userId);
      endTimer();
      log.info(`<== Fetch user data completed`, { userId, success: true });
      return data;
    } catch (error) {
      endTimer();
      log.error(`<== Fetch user data failed`, { userId }, error as Error);
      throw error;
    }
  };
}

// ❌ 错误示例
const fetchData = async (userId: string) => {
  console.log('fetching data'); // 无上下文、无关键信息
  return await api.getUser(userId);
};
```

### 原则二：关键业务动作使用Who+Action+What格式

```typescript
// ✅ 正确示例
log.info(`User [${userId}] updated profile`);
log.info(`Project [${projectId}] created by user [${userId}]`);
log.info(`Keyword [${keyword}] filtered ${count} projects`);

// ❌ 错误示例
log.info('profile updated'); // 缺少Who
log.info('project created'); // 缺少执行者和对象
```

### 原则三：敏感信息必须脱敏

系统自动脱敏以下字段：password, token, phone, mobile, idCard, 密码

```typescript
// ✅ 正确：details会被自动脱敏
log.info(`User login successful`, { userId: '123', phone: '13800138000' });
// 输出: { userId: '123', phone: '***MASKED***' }

// ❌ 错误：手动拼接可能泄露信息
log.info(`User ${phone} logged in`); // phone直接暴露在消息中
```

### 原则四：耗时日志是性能分析的关键

```typescript
// ✅ 正确：使用startTimer
const endTimer = log.startTimer();
await heavyOperation();
endTimer(); // 自动记录 duration_ms

// ✅ 正确：手动记录耗时
const start = performance.now();
const result = await fetchData();
log.info(`Data fetched`, { duration_ms: Math.round(performance.now() - start) });
```

### 原则五：错误日志必须包含完整堆栈

```typescript
// ✅ 正确
try {
  await riskyOperation();
} catch (error) {
  log.error(`Operation failed`, { operationId: '123' }, error as Error);
}

// ❌ 错误
try {
  await riskyOperation();
} catch (error) {
  log.error(`Operation failed: ${error.message}`); // 丢失堆栈
}
```

## 组件内使用日志

### 在React组件中使用

```typescript
import { useModuleLogger } from '@hooks/useLogger'

function ProjectCard({ project }: { project: Project }) {
  const log = useModuleLogger('ProjectCard')

  const handleClick = () => {
    log.info(`Project card clicked`, { projectId: project.id })
    // 业务逻辑
  }

  return <div onClick={handleClick}>{project.title}</div>
}
```

### 在工具函数中使用

```typescript
import { createModuleLogger } from '@utils/logger';

const log = createModuleLogger('markdownParser');

export function parseMarkdown(content: string): Document {
  log.debug(`Parsing markdown content`, { length: content.length });

  const endTimer = log.startTimer();
  const result = doParse(content);
  endTimer();

  log.info(`Markdown parsed successfully`, { resultLength: result.length });
  return result;
}
```

## 禁止事项

1. **禁止在日志消息中直接打印敏感信息**
2. **禁止在高频循环中逐条打印DEBUG日志**
3. **禁止使用console.log/console.error** - 必须使用logger
4. **禁止记录无意义的调试信息** - 如 "进入函数"、"退出函数"

## 快速检查清单

添加日志后，自问：

- [ ] 这条日志能回答"发生了什么"吗？
- [ ] 包含足够的业务标识(userId, projectId等)吗？
- [ ] 敏感信息是否会被脱敏？
- [ ] 耗时操作是否有耗时记录？
- [ ] 错误是否有堆栈信息？

## 示例场景

### 场景1：用户点击项目卡片

```typescript
// Hero Component
log.info(`User [${userId}] clicked project card`, { projectId: 'project-001' });
```

### 场景2：JD匹配操作

```typescript
// JDMatcher Component
log.info(`==> JD matching started`, { jdLength: jdText.length });
const endTimer = log.startTimer();
const result = keywordMatcher.match(jdText, allTags);
endTimer();
log.info(`<== JD matching completed`, {
  matchedCount: result.matchedProjects.length,
  matchScore: result.matchScore,
});
```

### 场景3：知识图谱渲染

```typescript
// KnowledgeGraph Component
log.info(`==> Graph rendering started`, { nodeCount: nodes.length, edgeCount: edges.length });
const endTimer = log.startTimer();
await renderGraph(nodes, edges);
endTimer();
log.info(`<== Graph rendered`, { success: true });
```
