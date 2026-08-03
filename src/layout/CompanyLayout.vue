<template>
  <div class="company-layout">
    <div class="layout-header">
      <div class="header-left">
        <div class="logo-area">
          <span class="logo-char" v-for="(ch, i) in '民匠有约'" :key="i">{{ ch }}</span>
        </div>
        <div class="guide-banner">
          <span class="guide-icon">📖</span>
          <span class="guide-text">操作流程<span class="guide-highlight">指南</span>:</span>
        </div>
        <div class="steps-flow">
          <div class="step-unit" v-for="(step, i) in steps" :key="i">
            <div v-if="i > 0" class="connector" :class="{ done: i <= activeStep }"></div>
            <div class="step-body">
              <div class="step-circle" :class="{ done: i < activeStep, active: i === activeStep, todo: i > activeStep }">
                <span v-if="i >= activeStep">{{ i + 1 }}</span>
                <span v-else>✓</span>
              </div>
              <span class="step-title" :class="{ done: i < activeStep, active: i === activeStep, todo: i > activeStep }">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-body">
      <div class="navBar">
        <div v-for="menu in menuList" :key="menu.id" class="nav-group">
          <div
            class="navTitle"
            :class="{ active: activeMenu === menu.id }"
            @click="handleMenuClick(menu)"
          >
            <img v-if="menu.icon" :src="menu.icon" class="navImage" />
            <span class="navText" :class="{ spanAct: activeMenu === menu.id }">{{ menu.name }}</span>
          </div>
          <div v-if="menu.children && visibleChildren(menu.children).length > 0" class="nav-item-group">
            <div class="nav-item-row">
              <div
                v-for="child in visibleChildren(menu.children)"
                :key="child.id"
                class="nav-item-text"
                :class="{ active: isChildActive(child.path) }"
                @click="handleSubMenuClick(child.path)"
              >
                {{ child.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const activeStep = ref(3)

const steps = ['工种配置', '任务排期', '人才库', '发布任务', '任务详情', '添加成员', '完成']

const menuList = [
  { id: 'home', name: '首页', icon: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/54acb41c7cf4476f93301f71851d5157.png', path: '/company/home', children: [] },
  {
    id: 'taskCenter',
    name: '任务中心',
    icon: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/c2cf78e53cd544bab5d9ce0add4f5065.png',
    children: [
      { id: 'taskList', name: '任务列表', path: '/company/task-list-guide' },
      { id: 'settlement', name: '结算记录', path: '/company/settlement' },
      { id: 'taskManage', name: '任务管理', path: '/company/task-center' },
      { id: 'talentPool', name: '人才库', path: '/company/talent-pool' }
    ]
  },
  {
    id: 'finance',
    name: '财务管理',
    icon: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/7e79be6d82004754b29a86e4b2523a82.png',
    children: [
      { id: 'account', name: '账户总览', path: '/company/account' },
      { id: 'reconciliation', name: '对账单', path: '/company/attendance' },
      { id: 'billDetail', name: '账单明细', path: '/company/bill-detail' },
      { id: 'invoiceInfo', name: '开票信息', path: '/company/invoice-info' }
    ]
  },
  {
    id: 'accountMgr',
    name: '账号管理',
    icon: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/c2cf78e53cd544bab5d9ce0add4f5065.png',
    children: [
      { id: 'basicInfo', name: '基本信息', path: '/company/basic-info' },
      { id: 'accountSetting', name: '账户设置', path: '/company/account-setting' },
      { id: 'userList', name: '用户列表', path: '/company/user-list' },
      { id: 'projectManage', name: '项目管理', path: '/company/project-manage', needMaster: true }
    ]
  },
  {
    id: 'system',
    name: '系统管理',
    icon: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/7e79be6d82004754b29a86e4b2523a82.png',
    children: [
      { id: 'role', name: '角色管理', path: '/company/system' },
      { id: 'notice', name: '系统公告', path: '/company/notice' }
    ]
  }
]

const activeMenu = computed(() => {
  const path = route.path
  const menuMap = {
    '/company': 'home',
    '/company/home': 'home',
    '/company/task-list-guide': 'taskCenter',
    '/company/settlement': 'taskCenter',
    '/company/task-center': 'taskCenter',
    '/company/talent-pool': 'taskCenter',
    '/company/work-type': 'taskCenter',
    '/company/task-schedule': 'taskCenter',
    '/company/account': 'finance',
    '/company/attendance': 'finance',
    '/company/system': 'system',
    '/company/project': 'home',
    '/company/project-manage': 'accountMgr'
  }
  return menuMap[path] || 'home'
})

const isChildActive = (path) => {
  return route.path === path
}

// 模拟账号角色：master=主账号，sub=子账号；真实场景从接口/本地存储读取
const accountRole = computed(() => {
  return localStorage.getItem('company_role') || 'master'
})
const isMasterAccount = computed(() => accountRole.value === 'master')

const visibleChildren = (children) => {
  if (!children) return []
  return children.filter(c => !c.needMaster || isMasterAccount.value)
}

const handleMenuClick = (menu) => {
  if (menu.path) {
    router.push(menu.path)
  }
}

const handleSubMenuClick = (path) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.removeItem('company_token')
  localStorage.removeItem('company_username')
  ElMessage.success('退出成功')
  router.push('/company/login')
}
</script>

<style scoped>
.company-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #EFEFF4;
  font-family: Arial, Helvetica, sans-serif;
}

/* Header */
.layout-header {
  height: 60px;
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

/* Logo */
.logo-area {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo-char {
  font-size: 26px;
  color: #5077E8;
  font-weight: 700;
  margin: 0 1px;
}

/* Guide Banner */
.guide-banner {
  background: #0B70FF;
  color: #fff;
  padding: 8px 18px 8px 8px;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
}

.guide-icon {
  font-size: 14px;
}

.guide-highlight {
  color: #FFD700;
}

/* Steps Flow */
.steps-flow {
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 4px;
}

.step-unit {
  display: flex;
  align-items: center;
}

.step-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}

.step-circle.done {
  background: #0B70FF;
  color: #fff;
}

.step-circle.active {
  background: #0B70FF;
  color: #fff;
}

.step-circle.todo {
  background: #E4E7ED;
  color: #909399;
}

.step-title {
  font-size: 11px;
  white-space: nowrap;
}

.step-title.done {
  color: #303133;
}

.step-title.active {
  color: #0B70FF;
  font-weight: 500;
}

.step-title.todo {
  color: #909399;
}

.connector {
  width: 20px;
  height: 2px;
  background: #E4E7ED;
  margin: 0 4px;
  margin-bottom: 16px;
}

.connector.done {
  background: #0B70FF;
}

/* Body Layout */
.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* NavBar (Sidebar) */
.navBar {
  width: 238px;
  background: #fff;
  padding: 5px 16px 16px;
  flex-shrink: 0;
  overflow-y: auto;
  height: 100%;
}

.navBar::-webkit-scrollbar {
  width: 4px;
}

.navBar::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.nav-group {
  margin-bottom: 8px;
}

.navTitle {
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #030217;
  transition: color 0.2s;
}

.navTitle:hover {
  color: #5077E8;
}

.navImage {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.navText {
  font-size: 14px;
}

.navText.spanAct {
  color: #5077E8;
}

.nav-item-group {
  padding-left: 22px;
}

.nav-item-row {
  display: flex;
  flex-wrap: wrap;
}

.nav-item-text {
  font-size: 14px;
  color: #666;
  padding: 4px 8px 4px 0;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item-text:hover {
  color: #5077E8;
}

.nav-item-text.active {
  color: #5077E8;
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #EFEFF4;
}
</style>
