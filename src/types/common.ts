// Global type definitions
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationData<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export const FILE_RESOURCE_TITLES: string[] = [
  '委托函',
  '已签字的委托函',
  '船长的信任证书',
  '船上工作人员登轮证', 
  '海船船员信任证书',
  '施工船证书',
  '作业安全管理规定及防范措施',
  '工作船船舶租赁合同',
  '工作船船长身份证',
  '船舶在港备案证书',
  '水上水下活动方案',
  '海事申报手续文件',
  '完工单',
  '清洗报告'
]


