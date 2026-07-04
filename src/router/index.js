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
  '/city-service/bank-config'
]

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '首页' } },
      { path: 'cockpit', name: 'Cockpit', component: () => import('../views/Cockpit.vue'), meta: { title: '驾驶舱' } },
      { path: 'training/verify', name: 'TrainingVerify', component: () => import('../views/Training/Verify.vue'), meta: { title: '培训审核' } },
      { path: '401', name: 'Error401', component: () => import('../views/Error401.vue'), meta: { title: '无权限' } },
      { path: 'system/dict', name: 'SystemDict', component: () => import('../views/System/Dict.vue'), meta: { title: '字典管理' } },
      { path: 'system/message', name: 'SystemMessage', component: () => import('../views/System/Message.vue'), meta: { title: '消息管理' } },
      { path: 'system/icon', name: 'SystemIcon', component: () => import('../views/System/Icon.vue'), meta: { title: '图标库' } },
      { path: 'system/params', name: 'SystemParams', component: () => import('../views/System/Params.vue'), meta: { title: '参数设置' } },
      { path: 'system/menu', name: 'SystemMenu', component: () => import('../views/System/Menu.vue'), meta: { title: '菜单管理' } },
      { path: 'system/post', name: 'SystemPost', component: () => import('../views/System/Post.vue'), meta: { title: '岗位管理' } },
      { path: 'region/local', name: 'RegionLocal', component: () => import('../views/Region/Local.vue'), meta: { title: '当地数据' } },
      { path: 'user/list', name: 'UserList', component: () => import('../views/User/List.vue'), meta: { title: '用户列表' } },
      { path: 'user/role', name: 'UserRole', component: () => import('../views/User/Role.vue'), meta: { title: '角色管理' } },
      { path: 'user/dept', name: 'UserDept', component: () => import('../views/User/Dept.vue'), meta: { title: '部门管理' } },
      { path: 'platform/user-list', name: 'PlatformUserList', component: () => import('../views/Platform/UserList.vue'), meta: { title: '用户列表' } },
      { path: 'training/class', name: 'TrainingClass', component: () => import('../views/Training/Class.vue'), meta: { title: '班级管理' } },
      { path: 'finance/transaction', name: 'FinanceTransaction', component: () => import('../views/Finance/Transaction.vue'), meta: { title: '交易流水' } },
      { path: 'task/list', name: 'TaskList', component: () => import('../views/Task/List.vue'), meta: { title: '任务列表' } },
      { path: 'statistics/report', name: 'StatisticsReport', component: () => import('../views/Statistics/Report.vue'), meta: { title: '统计报表' } },
      ...commonRoutes.map(path => ({
        path: path.slice(1),
        name: 'Common' + path.replace(/\//g, '_'),
        component: () => import('../views/CommonPage.vue'),
        meta: { title: path.split('/').pop() }
      }))
    ]
  },
  {
    path: '/agentv2/login',
    name: 'AgentV2Login',
    component: () => import('../views/AgentV2/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/agentv2',
    name: 'AgentV2Layout',
    component: () => import('../layout/AgentV2Layout.vue'),
    redirect: '/agentv2/home',
    children: [
      { path: 'home', name: 'AgentV2Home', component: () => import('../views/AgentV2/Home.vue'), meta: { title: '企业信息' } },
      { path: 'personal', name: 'AgentV2Personal', component: () => import('../views/AgentV2/Personal.vue'), meta: { title: '个人代理' } },
      { path: 'personal/add', name: 'AgentV2PersonalAdd', component: () => import('../views/AgentV2/Personal.vue'), meta: { title: '新增业务员' } },
      { path: 'enterprise', name: 'AgentV2Enterprise', component: () => import('../views/AgentV2/Enterprise.vue'), meta: { title: '企业列表' } },
      { path: 'purchase', name: 'AgentV2Purchase', component: () => import('../views/AgentV2/Purchase.vue'), meta: { title: '购买明细' } },
      { path: 'settlement', name: 'AgentV2Settlement', component: () => import('../views/AgentV2/Settlement.vue'), meta: { title: '结算明细' } },
      { path: 'incentive', name: 'AgentV2Incentive', component: () => import('../views/AgentV2/Incentive.vue'), meta: { title: '激励奖励' } }
    ]
  },
  {
    path: '/company/login',
    name: 'CompanyLogin',
    component: () => import('../views/Company/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/company/company-list',
    name: 'CompanyListPage',
    component: () => import('../views/Company/CompanyList.vue'),
    meta: { title: '企业列表' }
  },
  {
    path: '/company',
    name: 'CompanyLayout',
    component: () => import('../layout/CompanyLayout.vue'),
    redirect: '/company/home',
    children: [
      { path: 'home', name: 'CompanyHome', component: () => import('../views/Company/Home.vue'), meta: { title: '首页' } },
      { path: 'work-type', name: 'CompanyWorkType', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '任务工种' } },
      { path: 'task-schedule', name: 'CompanyTaskSchedule', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '任务排期' } },
      { path: 'talent-pool', name: 'CompanyTalentPool', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '人才库' } },
      { path: 'task-list-guide', name: 'CompanyTaskListGuide', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '任务列表' } },
      { path: 'task-center', name: 'CompanyTaskCenter', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '任务中心' } },
      { path: 'settlement', name: 'CompanySettlement', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '结算记录' } },
      { path: 'attendance', name: 'CompanyAttendance', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '打卡机数据' } },
      { path: 'account', name: 'CompanyAccount', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '账户管理' } },
      { path: 'project', name: 'CompanyProject', component: () => import('../views/Company/ProjectList.vue'), meta: { title: '项目管理' } },
      { path: 'system', name: 'CompanySystem', component: () => import('../views/Company/CommonPage.vue'), meta: { title: '系统管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const companyToken = localStorage.getItem('company_token')
  if (to.meta.title) {
    if (to.path.startsWith('/agentv2')) {
      document.title = to.meta.title + ' - 城市服务商系统'
    } else if (to.path.startsWith('/company')) {
      document.title = to.meta.title + ' - 民匠有约'
    } else {
      document.title = to.meta.title + ' - 民匠有约管理系统'
    }
  }
  if (to.path === '/login' || to.path === '/agentv2/login' || to.path === '/company/login') {
    next()
  } else if (to.path === '/company/company-list') {
    if (companyToken) {
      next()
    } else {
      next('/company/login')
    }
  } else if (to.path.startsWith('/company')) {
    if (companyToken) {
      next()
    } else {
      next('/company/login')
    }
  } else {
    if (token) {
      next()
    } else {
      if (to.path.startsWith('/agentv2')) {
        next('/agentv2/login')
      } else {
        next('/login')
      }
    }
  }
})

export default router