---

description: "Task list template for feature implementation"
---

# Tasks: Ship Operation Console System

**Input**: Design documents from `/specs/001-ship-console-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included for core authentication and user management functionality to ensure quality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Vue3前端项目**: `src/`, `tests/` at repository root，使用推荐的项目结构
- 路径规范：使用Vue3前端项目结构标准

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 创建Vue3项目结构（components、views、composables等目录）
- [X] T002 初始化Vue3项目依赖（Vue3.3+、ElementPlus3.0+、TypeScript5.0+、Vite4.0+、Vitest）
- [X] T003 [P] 配置代码质量工具（ESLint、Prettier、TypeScript严格模式）

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 配置Vue Router路由结构在 src/router/index.ts
- [X] T005 [P] 实现Pinia状态管理配置在 src/stores/index.ts
- [X] T006 [P] 配置ElementPlus主题和全局样式在 src/styles/variables.css 和 src/plugins/element-plus.ts
- [X] T007 创建TypeScript类型定义结构在 src/types/ 目录
- [X] T008 配置API请求基础设施（Axios、错误处理、拦截器）在 src/utils/request.ts
- [X] T009 配置环境变量管理（Vite环境配置）在 .env.development 和 .env.production
- [X] T010 创建路由守卫处理权限验证在 src/router/guards.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 用户登录与控制台访问 (Priority: P1) 🎯 MVP

**Goal**: 用户能够通过登录页面认证身份并进入主控制台界面

**Independent Test**: 可以独立测试通过用户名和密码登录系统，验证身份后进入主控制台界面

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] 认证store单元测试在 tests/unit/auth.test.ts
- [X] T012 [P] [US1] 登录表单组件测试在 tests/unit/LoginForm.spec.ts
- [ ] T013 [P] [US1] 登录流程集成测试在 tests/integration/test_login.ts

### Implementation for User Story 1

- [X] T014 [P] [US1] 创建认证相关类型定义在 src/types/auth.ts
- [X] T015 [P] [US1] 创建认证组合函数在 src/composables/useAuth.ts
- [X] T016 [P] [US1] 创建认证API接口在 src/api/auth.ts
- [X] T017 [US1] 创建认证状态管理在 src/stores/auth.ts (depends on T014, T015, T016)
- [X] T018 [US1] 创建登录页面组件在 src/views/Login.vue (depends on T017)
- [X] T019 [US1] 创建登录表单业务组件在 src/components/business/LoginForm.vue (depends on T015)
- [X] T020 [US1] 创建主控制台页面布局在 src/views/Dashboard.vue (depends on T017)
- [X] T021 [US1] 创建应用布局组件在 src/components/common/AppLayout.vue (depends on T020)
- [X] T022 [US1] 实现登录表单验证和错误处理在 LoginForm.vue
- [X] T023 [US1] 添加JWT令牌存储和刷新逻辑在 useAuth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 主控制台导航与菜单操作 (Priority: P1)

**Goal**: 用户进入主控制台后能够看到清晰的菜单结构，通过点击菜单导航到不同的功能页面

**Independent Test**: 可以独立测试登录后用户能够看到完整的菜单结构，点击菜单项能够正确导航到对应功能页面

### Tests for User Story 2 ⚠️

- [ ] T024 [P] [US2] 菜单store单元测试在 tests/unit/menu.test.ts
- [ ] T025 [P] [US2] 侧边栏组件测试在 tests/unit/AppSidebar.spec.ts

### Implementation for User Story 2

- [ ] T026 [P] [US2] 创建菜单相关类型定义在 src/types/menu.ts
- [ ] T027 [P] [US2] 创建菜单组合函数在 src/composables/useMenu.ts
- [ ] T028 [P] [US2] 创建菜单API接口在 src/api/menu.ts
- [ ] T029 [US2] 创建菜单状态管理在 src/stores/menu.ts (depends on T026, T027, T028)
- [ ] T030 [US2] 创建应用侧边栏组件在 src/components/common/AppSidebar.vue (depends on T029)
- [ ] T031 [US2] 创建应用头部组件在 src/components/common/AppHeader.vue
- [ ] T032 [US2] 创建菜单项业务组件在 src/components/business/MenuItem.vue (depends on T027)
- [ ] T033 [US2] 实现多级菜单展开/折叠逻辑在 AppSidebar.vue
- [ ] T034 [US2] 集成logo显示在侧边栏顶部
- [ ] T035 [US2] 更新路由配置支持新功能页面路由在 router/index.ts
- [ ] T036 [US2] 添加菜单权限控制逻辑在 useMenu.ts (depends on T017)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 多级用户管理功能 (Priority: P2)

**Goal**: 管理员能够管理不同类型的用户账户，包括船方代理、作业方用户和运营后台用户

**Independent Test**: 可以独立测试管理员能够查看、创建、编辑和删除不同类型的用户账户

### Tests for User Story 3 ⚠️

- [ ] T037 [P] [US3] 用户管理store单元测试在 tests/unit/user.test.ts
- [ ] T038 [P] [US3] 用户表格组件测试在 tests/unit/UserTable.spec.ts
- [ ] T039 [P] [US3] 用户管理集成测试在 tests/integration/test_userManagement.ts

### Implementation for User Story 3

- [ ] T040 [P] [US3] 创建用户相关类型定义在 src/types/user.ts
- [ ] T041 [P] [US3] 创建用户管理组合函数在 src/composables/useUser.ts
- [ ] T042 [P] [US3] 创建用户API接口在 src/api/user.ts
- [ ] T043 [US3] 创建用户状态管理在 src/stores/user.ts (depends on T040, T041, T042)
- [ ] T044 [US3] 创建用户管理主页面在 src/views/UserManagement.vue (depends on T043)
- [ ] T045 [US3] 创建用户表格业务组件在 src/components/business/UserTable.vue (depends on T041)
- [ ] T046 [US3] 创建用户类型管理页面在 src/views/UserTypeManagement.vue (depends on T043)
- [ ] T047 [US3] 创建用户表单组件（新增/编辑）在 src/components/business/UserForm.vue (depends on T041)
- [ ] T048 [US3] 实现用户列表查询和分页功能在 UserTable.vue
- [ ] T049 [US3] 实现用户创建表单和验证逻辑在 UserForm.vue
- [ ] T050 [US3] 实现用户编辑功能在 UserForm.vue
- [ ] T051 [US3] 实现用户删除确认和逻辑删除功能
- [ ] T052 [US3] 添加用户类型筛选功能在 UserManagement.vue
- [ ] T053 [US3] 更新路由配置添加用户管理页面路由在 router/index.ts
- [ ] T054 [US3] 添加用户管理权限控制在 useUser.ts (depends on T036)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - 系统管理功能 (Priority: P3)

**Goal**: 系统管理员需要能够访问系统设置和配置管理功能

**Independent Test**: 可以独立测试系统管理员能够访问系统管理页面并进行相关配置操作

### Implementation for User Story 4

- [ ] T055 [P] [US4] 创建系统管理相关类型定义在 src/types/system.ts
- [ ] T056 [P] [US4] 创建系统管理组合函数在 src/composables/useSystem.ts
- [ ] T057 [P] [US4] 创建系统管理API接口在 src/api/system.ts
- [ ] T058 [US4] 创建系统管理状态管理在 src/stores/system.ts (depends on T055, T056, T057)
- [ ] T059 [US4] 创建系统管理主页面在 src/views/SystemManagement.vue (depends on T058)
- [ ] T060 [US4] 创建系统设置页面组件在 src/components/business/SystemSettings.vue
- [ ] T061 [US4] 创建操作日志页面组件在 src/components/business/OperationLogs.vue
- [ ] T062 [US4] 实现系统配置表单和保存功能在 SystemSettings.vue
- [ ] T063 [US4] 实现操作日志查询和显示功能在 OperationLogs.vue
- [ ] T064 [US4] 更新路由配置添加系统管理页面路由在 router/index.ts
- [ ] T065 [US4] 添加系统管理权限控制在 useSystem.ts (depends on T054)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - 作业管理功能扩展 (Priority: P2)

**Goal**: 实现基础的作业管理功能页面，为后续作业功能扩展提供框架

**Independent Test**: 可以独立测试作业管理页面能够正常加载和基本导航

### Implementation for User Story 5

- [ ] T066 [P] [US5] 创建作业管理相关类型定义在 src/types/job.ts
- [ ] T067 [P] [US5] 创建作业管理组合函数在 src/composables/useJob.ts
- [ ] T068 [P] [US5] 创建作业管理API接口在 src/api/job.ts
- [ ] T069 [US5] 创建作业管理状态管理在 src/stores/job.ts (depends on T066, T067, T068)
- [ ] T070 [US5] 创建作业管理主页面在 src/views/JobManagement.vue (depends on T069)
- [ ] T071 [US5] 创建作业列表组件在 src/components/business/JobList.vue
- [ ] T072 [US5] 更新路由配置添加作业管理页面路由在 router/index.ts
- [ ] T073 [US5] 添加作业管理权限控制在 useJob.ts (depends on T065)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T074 [P] 添加全局错误处理和用户提示机制在 src/utils/errorHandler.ts
- [ ] T075 [P] 实现响应式设计适配移动端布局在各组件中
- [ ] T076 [P] 添加可访问性支持（ARIA标签、键盘导航）在所有交互组件
- [ ] T077 [P] 优化组件懒加载和代码分割性能优化
- [ ] T078 [P] 添加页面加载状态和骨架屏组件在 src/components/common/LoadingSkeleton.vue
- [ ] T079 [P] 创建主题切换功能在 src/composables/useTheme.ts
- [ ] T080 完善文档注释和组件props定义
- [ ] T081 运行端到端测试验证完整用户流程
- [ ] T082 性能测试和优化（首屏加载时间、交互响应）
- [ ] T083 安全性检查和修复（XSS防护、CSRF防护等）
- [ ] T084 代码审查和质量检查
- [ ] T085 部署配置和生产环境优化

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (US1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (US2)**: Can start after Foundational (Phase 2) - Depends on US1 authentication
- **User Story 3 (US3)**: Can start after Foundational (Phase 2) - Depends on US1 and US2 (menu system)
- **User Story 4 (US4)**: Can start after Foundational (Phase 2) - Depends on US1, US2, US3 (user management)
- **User Story 5 (US5)**: Can start after Foundational (Phase 2) - Depends on US1 and US2

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Types → Composables → API → Store → Components → Integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, multiple user stories can be worked on in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Types within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "认证store单元测试在 tests/unit/auth.test.ts"
Task: "登录表单组件测试在 tests/unit/LoginForm.spec.ts"
Task: "登录流程集成测试在 tests/integration/test_login.ts"

# Launch all types and composables for User Story 1 together:
Task: "创建认证相关类型定义在 src/types/auth.ts"
Task: "创建认证组合函数在 src/composables/useAuth.ts"
Task: "创建认证API接口在 src/api/auth.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (Navigation)
   - Developer C: User Story 3 (User Management)
3. Stories complete and integrate independently
4. Later phases: Developer D: User Story 4, Developer E: User Story 5

---

## Task Summary

**Total Tasks**: 85
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (US1 - Login): 13 tasks (including 3 tests)
- Phase 4 (US2 - Navigation): 13 tasks (including 2 tests)
- Phase 5 (US3 - User Management): 18 tasks (including 3 tests)
- Phase 6 (US4 - System Management): 11 tasks
- Phase 7 (US5 - Job Management): 8 tasks
- Polish & Cross-cutting: 12 tasks

**Tasks with Tests**: 11 test tasks across critical user stories
**Parallel Opportunities**: 57 parallelizable tasks (67% of total)
**Critical Path**: T001-T010 (Setup + Foundational) → Any User Story → Polish

### MVP Scope (User Story 1)
Tasks T014-T023: 10 implementation tasks + 3 test tasks = 13 tasks total
Estimated effort: ~2-3 days for 1 developer

### Full System
All tasks: 85 total tasks
Estimated effort: ~2-3 weeks for 1 developer, ~1 week for 3 developers

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence