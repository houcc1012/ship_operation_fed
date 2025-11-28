# Data Model: Ship Operation Console System

**Date**: 2025-11-18
**Context**: Entity relationships and data structures for the ship operation management system

## Core Entities

### User (用户)

```typescript
interface User {
  id: string;                    // 用户唯一标识
  username: string;              // 用户名
  password: string;              // 加密密码（仅传输）
  email?: string;                // 邮箱地址
  phone?: string;                // 手机号码
  realName: string;              // 真实姓名
  userType: UserType;            // 用户类型
  status: UserStatus;            // 用户状态
  permissions: Permission[];     // 用户权限列表
  lastLoginTime?: Date;          // 最后登录时间
  createTime: Date;              // 创建时间
  updateTime: Date;              // 更新时间
}
```

### UserType (用户类型枚举)

```typescript
enum UserType {
  SHIP_AGENT = 'SHIP_AGENT',           // 船方代理
  OPERATOR = 'OPERATOR',               // 作业方用户
  ADMIN = 'ADMIN'                      // 运营后台用户
}
```

### UserStatus (用户状态枚举)

```typescript
enum UserStatus {
  ACTIVE = 'ACTIVE',                   // 激活
  INACTIVE = 'INACTIVE',               // 未激活
  SUSPENDED = 'SUSPENDED',             // 暂停
  DELETED = 'DELETED'                  // 已删除
}
```

### Permission (权限)

```typescript
interface Permission {
  id: string;                   // 权限标识
  name: string;                 // 权限名称
  code: string;                 // 权限代码
  description?: string;         // 权限描述
  resource: string;             // 资源路径
  action: string;               // 操作类型（CREATE, READ, UPDATE, DELETE）
}
```

### Menu (菜单)

```typescript
interface MenuItem {
  id: string;                   // 菜单唯一标识
  name: string;                 // 菜单名称
  icon?: string;                // 菜单图标
  path?: string;                // 路由路径
  parentId?: string;            // 父菜单ID
  sortOrder: number;            // 排序序号
  isHidden: boolean;            // 是否隐藏
  permissions: string[];        // 访问所需权限代码
  children?: MenuItem[];        // 子菜单
  createTime: Date;             // 创建时间
  updateTime: Date;             // 更新时间
}
```

### Session (会话)

```typescript
interface UserSession {
  token: string;                // JWT令牌
  refreshToken: string;         // 刷新令牌
  userId: string;               // 用户ID
  userType: UserType;           // 用户类型
  permissions: Permission[];    // 用户权限
  expiresAt: Date;              // 过期时间
  lastActivity: Date;           // 最后活动时间
}
```

### Role (角色)

```typescript
interface Role {
  id: string;                   // 角色唯一标识
  name: string;                 // 角色名称
  code: string;                 // 角色代码
  userType: UserType;           // 适用用户类型
  permissions: Permission[];    // 角色权限
  description?: string;         // 角色描述
  createTime: Date;             // 创建时间
  updateTime: Date;             // 更新时间
}
```

## Entity Relationships

### User Relationships
- User 1:N Session (一个用户可以有多个会话)
- User N:M Role (用户可以有多个角色)
- User N:N Permission (用户直接关联权限)

### Menu Relationships
- MenuItem 1:N MenuItem (自关联，支持无限层级)
- MenuItem N:M Permission (菜单项需要特定权限访问)

### Role Relationships
- Role N:M Permission (角色包含多个权限)

## Data Validation Rules

### User Validation
- username: 必填，3-20字符，只能包含字母、数字、下划线
- password: 必填，最少8字符，包含大小写字母、数字
- email: 邮箱格式验证
- phone: 手机号码格式验证
- realName: 必填，2-50字符

### Menu Validation
- name: 必填，1-50字符
- path: 路径格式验证，以/开头
- sortOrder: 数字，0-9999
- parentId: 必须是有效的菜单ID

### Session Validation
- token: JWT格式验证
- expiresAt: 必须是未来时间
- lastActivity: 不能超过会话超时时间

## State Transitions

### User Status Transitions
```
INACTIVE → ACTIVE (管理员激活)
ACTIVE → SUSPENDED (管理员暂停)
SUSPENDED → ACTIVE (管理员恢复)
ACTIVE → DELETED (管理员删除)
```

### Session Lifecycle
```
Login → Create Session → Valid → Expire/Logout → Delete
```

## Default Data

### Default Menu Structure
```
作业管理 (/job-management)
├── 作业列表 (/job-management/list)
├── 作业创建 (/job-management/create)
└── 作业详情 (/job-management/detail/:id)

用户管理 (/user-management)
├── 船方代理 (/user-management/ship-agent)
├── 作业方用户 (/user-management/operator)
└── 运营后台用户 (/user-management/admin)

系统管理 (/system-management)
├── 系统设置 (/system-management/settings)
└── 操作日志 (/system-management/logs)
```

### Default Permissions
- 用户管理权限
- 作业管理权限
- 系统管理权限
- 角色管理权限

### Default Roles
- 系统管理员：所有权限
- 作业管理员：作业管理、用户管理权限
- 普通用户：基础查看权限