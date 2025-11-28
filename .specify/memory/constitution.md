<!--
Sync Impact Report:
Version change: 1.0.0 (initial constitution)
Modified principles: None (all new principles created for Vue3 frontend)
Added sections: Core Principles (5), 技术栈约束, 开发流程, 治理规范
Removed sections: None
Templates updated: ✅ plan-template.md, ✅ tasks-template.md, ⚠ spec-template.md (minor alignment needed)
Follow-up TODOs: None (all placeholders resolved)
-->

# 前端工程项目规范

## 核心原则

### 组件化优先
所有UI功能必须以Vue3组件形式构建；组件必须自包含、独立测试、文档完整；每个组件必须有明确的单一职责，禁止为组织结构而创建的组件。

### TypeScript类型安全
所有代码必须使用TypeScript编写；禁止使用any类型，必须提供严格的类型定义；接口和类型定义必须先行于实现代码。

### Composition API规范
必须使用Vue3的Composition API替代Options API；组合式函数必须以use开头命名；逻辑复用必须通过Composables实现。

### 响应式设计与可访问性
所有组件必须支持响应式布局（移动端优先）；必须遵循WCAG 2.1 AA级可访问性标准；必须提供键盘导航支持。

### ElementPlus集成规范
UI组件库统一使用ElementPlus3；自定义样式必须通过CSS变量覆盖主题；禁止直接修改ElementPlus内部样式。

## 技术栈约束

### 开发环境要求
- Vue3.3+
- ElementPlus3.0+
- TypeScript5.0+
- Vite4.0+
- Vitest用于单元测试

### 代码质量标准
所有代码必须通过ESLint和TypeScript编译检查；代码覆盖率不得低于80%；组件必须包含完整的props定义和事件文档。

## 开发流程

### 分支管理规范
主分支：main（生产环境）
开发分支：develop（开发环境）
功能分支：feature/功能名称
修复分支：hotfix/问题描述

### 提交规范
提交信息必须使用约定式提交格式：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建工具或辅助工具的变动

### 代码审查要求
所有代码必须经过至少一人审查才能合并；审查重点包括代码逻辑、类型定义、性能优化、安全性检查。

## 治理规范

本规范优先于所有其他开发实践；修改规范必须记录变更原因，经过团队同意，并提供迁移计划。

所有PR和代码审查必须验证规范合规性；复杂度增加必须提供合理解释；使用项目文档进行运行时开发指导。

**版本**: 1.0.0 | **制定日期**: 2025-11-18 | **最后修改**: 2025-11-18