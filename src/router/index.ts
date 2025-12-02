import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        requiresAuth: false,
        title: '登录'
      }
    },
    {
      path: '/',
      component: () => import('@/components/common/AppLayout.vue'),
      redirect: '/job-management',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'job-management',
          name: 'JobManagement',
          component: () => import('@/views/JobManagement.vue'),
          meta: { requiresAuth: true, title: '作业管理' }
        },
        {
          path: 'job-management/job-detail/:id',
          name: 'JobDetail',
          component: () => import('@/views/JobDetail.vue'),
          meta: { requiresAuth: true, title: '作业详情' }
        },
                {
          path: 'job-management/create',
          name: 'CreateJob',
          component: () => import('@/views/CreateJob.vue'),
          meta: { requiresAuth: true, title: '创建作业' }
        },
        {
          path: 'user-management',
          name: 'UserManagement',
          redirect: 'shipownerUserList',
          meta: { requiresAuth: true, title: '用户管理' },
          children: [
            {
              path: 'shipownerUserList',
              name: 'UserList',
              component: () => import('@/views/ShipownerUserList.vue'),
              meta: { requiresAuth: true, title: '船方用户列表' }
            },
            {
              path: 'supplierUserList',
              name: 'SupplierUserList',
              component: () => import('@/views/SupplierUserList.vue'),
              meta: { requiresAuth: true, title: '作业方用户列表' }
            },
            {
              path: 'adminUserList',
              name: 'AdminUserList',
              component: () => import('@/views/AdminUserList.vue'),
              meta: { requiresAuth: true, title: '运营后台用户列表' }
            }
          ]
        },

        {
          path: 'supplier-management',
          name: 'SupplierManagement',
          component: () => import('@/views/SupplierList.vue'),
          meta: { requiresAuth: true, title: '作业方管理' }
        },


        {
          path: 'system-management',
          name: 'SystemManagement',
          redirect: 'data-dict-list',
          meta: { requiresAuth: true, title: '系统管理' },
          children: [
            {
              path: 'data-dict',
              name: 'DataDictList',
              component: () => import('@/views/DataDictList.vue'),
              meta: { requiresAuth: true, title: '数据字典列表' }
            },
            {
              path: 'export-task-list',
              name: 'ExportTaskList',
              component: () => import('@/views/ExportTaskList.vue'),
              meta: { requiresAuth: true, title: '导出任务列表' }
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '页面未找到'
      }
    }
  ]
})

export default router
