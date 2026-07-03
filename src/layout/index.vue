<template>
  <div class="layout-container">
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-logo-container" :class="{ collapse: isCollapsed }" style="background-color: #304156;">
        <a href="#/" class="sidebar-logo-link">
          <img src="/static/img/logo1.png" class="sidebar-logo" />
        </a>
      </div>
      <el-scrollbar class="menu-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :collapse-transition="false"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          unique-opened
          router
          @select="handleSelect"
        >
          <el-menu-item index="/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/cockpit">
            <el-icon><Monitor /></el-icon>
            <span>驾驶舱</span>
          </el-menu-item>
          <el-sub-menu index="/system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/dict">字典管理</el-menu-item>
            <el-menu-item index="/system/icon">图标库</el-menu-item>
            <el-menu-item index="/system/params">参数设置</el-menu-item>
            <el-menu-item index="/system/menu">菜单管理</el-menu-item>
            <el-menu-item index="/system/post">岗位管理</el-menu-item>
            <el-menu-item index="/system/config-type">配置类型管理</el-menu-item>
            <el-menu-item index="/system/config-table">配置表管理</el-menu-item>
            <el-menu-item index="/system/notice">通知公告</el-menu-item>
            <el-menu-item index="/system/log">操作日志</el-menu-item>
            <el-menu-item index="/system/login-log">登录日志</el-menu-item>
            <el-menu-item index="/system/online">在线用户</el-menu-item>
            <el-menu-item index="/system/schedule">定时任务</el-menu-item>
            <el-menu-item index="/system/data-monitor">数据监控</el-menu-item>
            <el-menu-item index="/system/service-monitor">服务监控</el-menu-item>
            <el-menu-item index="/system/cache-monitor">缓存监控</el-menu-item>
            <el-menu-item index="/system/cache-list">缓存列表</el-menu-item>
            <el-menu-item index="/system/form-build">表单构建</el-menu-item>
            <el-menu-item index="/system/code-gen">代码生成</el-menu-item>
            <el-menu-item index="/system/api">系统接口</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/region">
            <template #title>
              <el-icon><Location /></el-icon>
              <span>区域数据</span>
            </template>
            <el-menu-item index="/region/local">当地数据</el-menu-item>
            <el-menu-item index="/region/sort">地区排序</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/role">角色管理</el-menu-item>
            <el-menu-item index="/user/dept">部门管理</el-menu-item>
            <el-menu-item index="/user/staff">人员管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/platform">
            <template #title>
              <el-icon><SetUp /></el-icon>
              <span>平台配置</span>
            </template>
            <el-menu-item index="/platform/user-list">用户列表</el-menu-item>
            <el-menu-item index="/platform/person-list">个人列表</el-menu-item>
            <el-menu-item index="/platform/enterprise-list">企业列表</el-menu-item>
            <el-menu-item index="/platform/contract">用工合同</el-menu-item>
            <el-menu-item index="/platform/aqian-contract">爱签合同</el-menu-item>
            <el-menu-item index="/platform/person-register">个人注册</el-menu-item>
            <el-menu-item index="/platform/enterprise-register">企业注册</el-menu-item>
            <el-menu-item index="/platform/db-view">数据库查看</el-menu-item>
            <el-menu-item index="/platform/face-record">上上签人脸记录</el-menu-item>
            <el-menu-item index="/platform/face-base">人脸底片</el-menu-item>
            <el-menu-item index="/platform/company-config">公司配置</el-menu-item>
            <el-menu-item index="/platform/insurance-price">保险定价</el-menu-item>
            <el-menu-item index="/platform/work-type">平台工种</el-menu-item>
            <el-menu-item index="/platform/sensitive-word">企业敏感词</el-menu-item>
            <el-menu-item index="/platform/task-template">任务模版</el-menu-item>
            <el-menu-item index="/platform/pay-later">先用后付</el-menu-item>
            <el-menu-item index="/platform/attendance-config">考勤机配置</el-menu-item>
            <el-menu-item index="/platform/icc-enterprise">ICC企业</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/training-platform">
            <template #title>
              <el-icon><Notebook /></el-icon>
              <span>平台培训</span>
            </template>
            <el-menu-item index="/training-platform/cert-list">证书列表</el-menu-item>
            <el-menu-item index="/training-platform/cert-config">证书配置</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/training">
            <template #title>
              <el-icon><Notebook /></el-icon>
              <span>培训后台(新)</span>
            </template>
            <el-menu-item index="/training/class">班级管理</el-menu-item>
            <el-menu-item index="/training/verify">资料审核</el-menu-item>
            <el-menu-item index="/training/student">学员管理</el-menu-item>
            <el-menu-item index="/training/payment">缴费记录</el-menu-item>
            <el-menu-item index="/training/photo">拍照记录</el-menu-item>
            <el-menu-item index="/training/base">培训底片</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/exercise">
            <template #title>
              <el-icon><EditPen /></el-icon>
              <span>习题管理</span>
            </template>
            <el-menu-item index="/exercise/bank">题库列表</el-menu-item>
            <el-menu-item index="/exercise/question">题目列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/finance">
            <template #title>
              <el-icon><Wallet /></el-icon>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/finance/transaction">交易流水</el-menu-item>
            <el-menu-item index="/finance/refund">退款记录</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/study">
            <template #title>
              <el-icon><Notebook /></el-icon>
              <span>学习记录</span>
            </template>
            <el-menu-item index="/study/simulate">模拟考记录</el-menu-item>
            <el-menu-item index="/study/summary">培训学习汇总</el-menu-item>
            <el-menu-item index="/study/detail">用户培训详情</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/backend">
            <template #title>
              <el-icon><SetUp /></el-icon>
              <span>后台配置</span>
            </template>
            <el-menu-item index="/backend/store">门店配置</el-menu-item>
            <el-menu-item index="/backend/archive">档案配置</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/salary">
            <template #title>
              <el-icon><Wallet /></el-icon>
              <span>薪资发放</span>
            </template>
            <el-menu-item index="/salary/batch">结算审核批量</el-menu-item>
            <el-menu-item index="/salary/detail">结算审核明细</el-menu-item>
            <el-menu-item index="/salary/withdraw">结算提现管理</el-menu-item>
            <el-menu-item index="/salary/transaction">交易流水</el-menu-item>
            <el-menu-item index="/salary/balance">平台余额</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/task">
            <template #title>
              <el-icon><List /></el-icon>
              <span>平台任务</span>
            </template>
            <el-menu-item index="/task/list">任务列表</el-menu-item>
            <el-menu-item index="/task/team">团队列表</el-menu-item>
            <el-menu-item index="/task/salary-config">薪酬工时配置</el-menu-item>
            <el-menu-item index="/task/seats">席位记录</el-menu-item>
            <el-menu-item index="/task/settlement">结算记录</el-menu-item>
            <el-menu-item index="/task/finance-report">财务报表</el-menu-item>
            <el-menu-item index="/task/message">消息通知</el-menu-item>
            <el-menu-item index="/task/white-list">绑卡白名单</el-menu-item>
            <el-menu-item index="/task/insurance">保险订单</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/statistics">
            <template #title>
              <el-icon><PieChart /></el-icon>
              <span>统计报表</span>
            </template>
            <el-menu-item index="/statistics/overview">财务总览</el-menu-item>
            <el-menu-item index="/statistics/reconciliation">资金对账</el-menu-item>
            <el-menu-item index="/statistics/report">对账单</el-menu-item>
            <el-menu-item index="/statistics/detail">收支明细</el-menu-item>
            <el-menu-item index="/statistics/invoice">开票管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/operation">
            <template #title>
              <el-icon><Promotion /></el-icon>
              <span>运营</span>
            </template>
            <el-menu-item index="/operation/merchant">商户拉新管理</el-menu-item>
            <el-menu-item index="/operation/service">服务商管理</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/order">
            <el-icon><ShoppingCart /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-sub-menu index="/enterprise">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>企业管理后台</span>
            </template>
            <el-menu-item index="/enterprise/audit">审核信息</el-menu-item>
            <el-menu-item index="/enterprise/user">用户列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/city-service">
            <template #title>
              <el-icon><MapLocation /></el-icon>
              <span>城市服务商管理</span>
            </template>
            <el-menu-item index="/city-service/bank-config">银行类型配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </aside>
    <main class="main-content">
      <header class="header">
        <div class="header-left">
          <el-button icon="Fold" @click="isCollapsed = !isCollapsed" />
        </div>
        <div class="header-center">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              <a v-if="item.path" @click="router.push(item.path)">{{ item.name }}</a>
              <span v-else>{{ item.name }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-popover placement="bottom" width="320" trigger="click" v-model="messageVisible">
            <template #reference>
              <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="message-badge">
                <el-button icon="Bell" circle />
              </el-badge>
            </template>
            <div class="message-popover">
              <div class="message-header">
                <span>站内信</span>
                <el-link type="primary" @click="handleReadAll">全部已读</el-link>
              </div>
              <el-divider style="margin: 8px 0;" />
              <div class="message-list">
                <div 
                  v-for="item in messages" 
                  :key="item.id" 
                  class="message-item"
                  :class="{ unread: !item.read }"
                  @click="handleMessageClick(item)"
                >
                  <div class="message-title">{{ item.title }}</div>
                  <div class="message-content">{{ item.content }}</div>
                  <div class="message-time">{{ item.time }}</div>
                </div>
              </div>
              <el-divider style="margin: 8px 0;" />
              <div class="message-footer">
                <el-link type="primary" @click="handleViewAll">查看全部</el-link>
              </div>
            </div>
          </el-popover>
          <el-dropdown>
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span>{{ username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  HomeFilled, Setting, Monitor, Notebook, Wallet, List, User, 
  Location, SetUp, EditPen, PieChart, Promotion, ShoppingCart, OfficeBuilding, MapLocation 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const username = ref(localStorage.getItem('username') || '用户')
const messageVisible = ref(false)
const messages = ref([
  { id: 1, title: '系统通知', content: '欢迎使用民匠有约管理系统', time: '2026-07-03 10:00:00', read: false },
  { id: 2, title: '任务提醒', content: '您有新的任务待处理', time: '2026-07-03 09:30:00', read: false },
  { id: 3, title: '培训通知', content: '新增培训课程已上线', time: '2026-07-02 15:00:00', read: true }
])

const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

const handleReadAll = () => {
  messages.value.forEach(m => m.read = true)
  ElMessage.success('已全部标记为已读')
}

const handleMessageClick = (item) => {
  item.read = true
  ElMessage.info('查看消息: ' + item.title)
}

const handleViewAll = () => {
  ElMessage.info('跳转到全部消息页面')
  messageVisible.value = false
}

const activeMenu = computed(() => route.path)

const breadcrumbs = computed(() => {
  const crumbs = []
  const path = route.path
  if (path === '/dashboard') {
    crumbs.push({ name: '首页', path: '/dashboard' })
  } else {
    const moduleMap = {
      '/dashboard': '首页',
      '/cockpit': '驾驶舱',
      '/system': '系统管理',
      '/region': '区域数据',
      '/user': '用户管理',
      '/platform': '平台配置',
      '/training-platform': '平台培训',
      '/training': '培训后台(新)',
      '/exercise': '习题管理',
      '/finance': '财务管理',
      '/study': '学习记录',
      '/backend': '后台配置',
      '/salary': '薪资发放',
      '/task': '平台任务',
      '/statistics': '统计报表',
      '/operation': '运营',
      '/order': '订单管理',
      '/enterprise': '企业管理后台',
      '/city-service': '城市服务商管理'
    }
    crumbs.push({ name: '首页', path: '/dashboard' })
    for (const [key, value] of Object.entries(moduleMap)) {
      if (path.startsWith(key)) {
        crumbs.push({ name: value, path: '' })
        break
      }
    }
    crumbs.push({ name: getMenuName(path), path: '' })
  }
  return crumbs
})

const getMenuName = (path) => {
  const map = {
    '/dashboard': '首页',
    '/cockpit': '驾驶舱',
    '/system/dict': '字典管理',
    '/system/icon': '图标库',
    '/system/params': '参数设置',
    '/system/menu': '菜单管理',
    '/system/post': '岗位管理',
    '/system/config-type': '配置类型管理',
    '/system/config-table': '配置表管理',
    '/system/notice': '通知公告',
    '/system/log': '操作日志',
    '/system/login-log': '登录日志',
    '/system/online': '在线用户',
    '/system/schedule': '定时任务',
    '/system/data-monitor': '数据监控',
    '/system/service-monitor': '服务监控',
    '/system/cache-monitor': '缓存监控',
    '/system/cache-list': '缓存列表',
    '/system/form-build': '表单构建',
    '/system/code-gen': '代码生成',
    '/system/api': '系统接口',
    '/region/local': '当地数据',
    '/region/sort': '地区排序',
    '/user/list': '用户列表',
    '/user/role': '角色管理',
    '/user/dept': '部门管理',
    '/user/staff': '人员管理',
    '/platform/user-list': '用户列表',
    '/platform/person-list': '个人列表',
    '/platform/enterprise-list': '企业列表',
    '/platform/contract': '用工合同',
    '/platform/aqian-contract': '爱签合同',
    '/platform/person-register': '个人注册',
    '/platform/enterprise-register': '企业注册',
    '/platform/db-view': '数据库查看',
    '/platform/face-record': '上上签人脸记录',
    '/platform/face-base': '人脸底片',
    '/platform/company-config': '公司配置',
    '/platform/insurance-price': '保险定价',
    '/platform/work-type': '平台工种',
    '/platform/sensitive-word': '企业敏感词',
    '/platform/task-template': '任务模版',
    '/platform/pay-later': '先用后付',
    '/platform/attendance-config': '考勤机配置',
    '/platform/icc-enterprise': 'ICC企业',
    '/training-platform/cert-list': '证书列表',
    '/training-platform/cert-config': '证书配置',
    '/training/class': '班级管理',
    '/training/verify': '资料审核',
    '/training/student': '学员管理',
    '/training/payment': '缴费记录',
    '/training/photo': '拍照记录',
    '/training/base': '培训底片',
    '/exercise/bank': '题库列表',
    '/exercise/question': '题目列表',
    '/finance/transaction': '交易流水',
    '/finance/refund': '退款记录',
    '/study/simulate': '模拟考记录',
    '/study/summary': '培训学习汇总',
    '/study/detail': '用户培训详情',
    '/backend/store': '门店配置',
    '/backend/archive': '档案配置',
    '/salary/batch': '结算审核批量',
    '/salary/detail': '结算审核明细',
    '/salary/withdraw': '结算提现管理',
    '/salary/transaction': '交易流水',
    '/salary/balance': '平台余额',
    '/task/list': '任务列表',
    '/task/team': '团队列表',
    '/task/salary-config': '薪酬工时配置',
    '/task/seats': '席位记录',
    '/task/settlement': '结算记录',
    '/task/finance-report': '财务报表',
    '/task/message': '消息通知',
    '/task/white-list': '绑卡白名单',
    '/task/insurance': '保险订单',
    '/statistics/overview': '财务总览',
    '/statistics/reconciliation': '资金对账',
    '/statistics/report': '对账单',
    '/statistics/detail': '收支明细',
    '/statistics/invoice': '开票管理',
    '/operation/merchant': '商户拉新管理',
    '/operation/service': '服务商管理',
    '/order': '订单管理',
    '/enterprise/audit': '审核信息',
    '/enterprise/user': '用户列表',
    '/city-service/bank-config': '银行类型配置'
  }
  return map[path] || ''
}

const handleSelect = (index) => {
  router.push(index)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  width: 200px;
  background: #304156;
  color: #bfcbd9;
  transition: width 0.3s;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #263445;
  flex-shrink: 0;
}

.sidebar-logo-container.collapse {
  padding: 0;
}

.sidebar-logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.menu-scrollbar {
  flex: 1;
  height: calc(100vh - 60px);
}

.menu-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}

.sidebar :deep(.el-menu) {
  border-right: none;
  width: 100%;
  background-color: transparent;
}

.sidebar :deep(.el-menu-item) {
  height: 46px;
  line-height: 46px;
}

.sidebar :deep(.el-sub-menu__title) {
  height: 46px;
  line-height: 46px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-left {
  flex-shrink: 0;
}

.header-center {
  flex: 1;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.message-badge {
  cursor: pointer;
}

.message-popover {
  padding: 4px 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f7fa;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item.unread {
  background: #ecf5ff;
  margin: 0 -12px;
  padding: 10px 12px;
}

.message-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.message-content {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 11px;
  color: #909399;
}

.message-footer {
  text-align: center;
  font-size: 13px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>