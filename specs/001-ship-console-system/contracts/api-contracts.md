# API Contracts: Ship Operation Console System

**Date**: 2025-11-18
**API Version**: v1
**Base URL**: `/api/v1`

## Authentication Endpoints

### POST /auth/login
用户登录

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "username": "string",
      "realName": "string",
      "userType": "SHIP_AGENT|OPERATOR|ADMIN",
      "permissions": ["string"]
    },
    "expiresIn": "number"
  }
}
```

**Error Responses:**
- 400: Invalid request parameters
- 401: Invalid credentials
- 429: Too many login attempts

### POST /auth/refresh
刷新访问令牌

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
}
```

### POST /auth/logout
用户登出

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Management Endpoints

### GET /users
获取用户列表

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `userType`: string (optional: SHIP_AGENT|OPERATOR|ADMIN)
- `status`: string (optional: ACTIVE|INACTIVE|SUSPENDED)
- `search`: string (optional: search by username or realName)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "username": "string",
        "realName": "string",
        "email": "string",
        "phone": "string",
        "userType": "SHIP_AGENT|OPERATOR|ADMIN",
        "status": "ACTIVE|INACTIVE|SUSPENDED",
        "lastLoginTime": "string",
        "createTime": "string",
        "updateTime": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

### POST /users
创建新用户

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "realName": "string",
  "email": "string",
  "phone": "string",
  "userType": "SHIP_AGENT|OPERATOR|ADMIN",
  "roleIds": ["string"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "realName": "string",
    "userType": "SHIP_AGENT|OPERATOR|ADMIN",
    "status": "ACTIVE",
    "createTime": "string"
  }
}
```

### GET /users/:id
获取用户详情

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "realName": "string",
    "email": "string",
    "phone": "string",
    "userType": "SHIP_AGENT|OPERATOR|ADMIN",
    "status": "ACTIVE|INACTIVE|SUSPENDED",
    "permissions": ["string"],
    "roles": [
      {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    ],
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### PUT /users/:id
更新用户信息

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "realName": "string",
  "email": "string",
  "phone": "string",
  "status": "ACTIVE|INACTIVE|SUSPENDED",
  "roleIds": ["string"]
}
```

### DELETE /users/:id
删除用户

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Menu Management Endpoints

### GET /menus
获取用户菜单结构

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon": "string",
      "path": "string",
      "sortOrder": "number",
      "children": [
        {
          "id": "string",
          "name": "string",
          "path": "string",
          "sortOrder": "number",
          "permissions": ["string"]
        }
      ]
    }
  ]
}
```

### GET /menus/all
获取所有菜单（管理员用）

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `includeHidden`: boolean (default: false)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon": "string",
      "path": "string",
      "parentId": "string",
      "sortOrder": "number",
      "isHidden": "boolean",
      "permissions": ["string"],
      "createTime": "string"
    }
  ]
}
```

## Role Management Endpoints

### GET /roles
获取角色列表

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `userType`: string (optional: SHIP_AGENT|OPERATOR|ADMIN)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "userType": "SHIP_AGENT|OPERATOR|ADMIN",
      "description": "string",
      "permissionCount": "number",
      "createTime": "string"
    }
  ]
}
```

### GET /roles/:id
获取角色详情

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "code": "string",
    "userType": "SHIP_AGENT|OPERATOR|ADMIN",
    "description": "string",
    "permissions": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "resource": "string",
        "action": "string"
      }
    ],
    "createTime": "string",
    "updateTime": "string"
  }
}
```

## System Management Endpoints

### GET /system/health
系统健康检查

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "string",
    "uptime": "number",
    "version": "string"
  }
}
```

### GET /system/logs
获取系统日志

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `level`: string (optional: ERROR|WARN|INFO|DEBUG)
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "string",
        "level": "ERROR|WARN|INFO|DEBUG",
        "message": "string",
        "userId": "string",
        "username": "string",
        "ip": "string",
        "userAgent": "string",
        "createTime": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes
- `INVALID_REQUEST`: 400 - Invalid request parameters
- `UNAUTHORIZED`: 401 - Authentication required
- `FORBIDDEN`: 403 - Insufficient permissions
- `NOT_FOUND`: 404 - Resource not found
- `CONFLICT`: 409 - Resource already exists
- `RATE_LIMITED`: 429 - Too many requests
- `INTERNAL_ERROR`: 500 - Server error

## Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (for authenticated endpoints)
- `X-Request-ID: string` (optional, for request tracing)

## Response Headers

- `Content-Type: application/json`
- `X-Request-ID: string` (echoed from request)
- `X-Rate-Limit-Remaining: number` (remaining requests)
- `X-Rate-Limit-Reset: number` (reset timestamp)