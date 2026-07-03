import { createRouter, createWebHashHistory } from 'vue-router'

const commonRoutes = [
  '/system/config-type', '/system/config-table', '/system/notice',
  '/system/log', '/system/login-log', '/system/online', '/system/schedule',
  '/system/data-monitor', '/system/service-monitor', '/system/cache-monitor',
  '/system/cache-list', '/system/form-build', '/system/code-gen', '/system/api',
  '/region/sort', '/user/staff',
  '/platform/person-list', '/platform/enterprise-list', '/platform/contract',
  '/platform/aqian-contract', '/platform/person-register', '/platform/enterprise-register',
  '/platform/db-view', '/platform/face-record', '/platform/face-base', '/platform/company-config',
  '/platform/insurance-price', '/platform/work-type', '/platform/sensitive-word',
  '/platform/task-template', '/platform/pay-later', '/platform/attendance-config',
  '/platform/icc-enterprise',
  '/training-platform/cert-list', '/training-platform/cert-config',
  '/training/student', '/training/payment', '/training/photo',
  '/training/base', '/training/cert',
  '/exercise/bank', '/exercise/question',
  '/finance/refund',
  '/study/simulate', '/study/summary', '/study/detail',
  '/backend/store', '/backend/archive',
  '/salary/batch', '/salary/detail', '/salary/withdraw', '/salary/transaction',
  '/salary/balance',
  '/task/team', '/task/salary-config', '/task/seats',
  '/task/settlement', '/task/finance-report', '/task/message', '/task/white-list',
  '/task/insurance',
  '/statistics/overview', '/statistics/reconciliation', '/statistics/detail', '/statistics/invoice',
  '/operation/merchant', '/operation/service',
  '/order',
  '/enterprise/audit', '/enterprise/user',
  '/city-service/bank-config',
  '/cockpit'
]

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'training/verify', name: 'TrainingVerify', component: () => import('../views/Training/Verify.vue') },
      { path: '401', name: 'Error401', component: () => import('../views/Error401.vue') },
      // 系统管理
      { path: 'system/dict', name: 'SystemDict', component: () => import('../views/System/Dict.vue') },
      { path: 'system/icon', name: 'SystemIcon', component: () => import('../views/System/Icon.vue') },
      { path: 'system/params', name: 'SystemParams', component: () => import('../views/System/Params.vue') },
      { path: 'system/menu', name: 'SystemMenu', component: () => import('../views/System/Menu.vue') },
      { path: 'system/post', name: 'SystemPost', component: () => import('../views/System/Post.vue') },
      // 区域数据
      { path: 'region/local', name: 'RegionLocal', component: () => import('../views/Region/Local.vue') },
      // 用户管理
      { path: 'user/list', name: 'UserList', component: () => import('../views/User/List.vue') },
      { path: 'user/role', name: 'UserRole', component: () => import('../views/User/Role.vue') },
      { path: 'user/dept', name: 'UserDept', component: () => import('../views/User/Dept.vue') },
      // 平台配置
      { path: 'platform/user-list', name: 'PlatformUserList', component: () => import('../views/Platform/UserList.vue') },
      // 培训后台
      { path: 'training/class', name: 'TrainingClass', component: () => import('../views/Training/Class.vue') },
      // 财务管理
      { path: 'finance/transaction', name: 'FinanceTransaction', component: () => import('../views/Finance/Transaction.vue') },
      // 平台任务
      { path: 'task/list', name: 'TaskList', component: () => import('../views/Task/List.vue') },
      // 统计报表
      { path: 'statistics/report', name: 'StatisticsReport', component: () => import('../views/Statistics/Report.vue') },
      ...commonRoutes.map(path => ({
        path: path.slice(1),
        name: 'Common' + path.replace(/\//g, '_'),
        component: () => import('../views/CommonPage.vue')
      }))
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router