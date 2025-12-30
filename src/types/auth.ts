export enum UserType {
  SHIP_AGENT = 'SHIP_AGENT',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN'
}


export interface Permission {
  id: string
  name: string
  code: string
  description?: string
  resource: string
  action: string
}

export interface User {
  id?: number
  userName: string
  realName?: string
  email?: string
  phone?: string
  userType: UserType
  enabled: boolean
  // permissions: Permission[]
  lastLoginTime?: string
  createTime: string
  updateTime: string
}

export interface LoginRequest {
  account: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}