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

      <!-- 右上角：站内信铃铛 + 用户 -->
      <div class="header-right">
        <el-popover
          v-model:visible="bellVisible"
          placement="bottom-end"
          :width="420"
          trigger="click"
          popper-class="msg-popover"
        >
          <template #reference>
            <div class="bell-wrap" @click="onBellClick">
              <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0" type="danger">
                <el-icon class="bell-icon"><Bell /></el-icon>
              </el-badge>
            </div>
          </template>

          <div class="msg-panel">
            <div class="msg-panel-head">
              <span class="mp-title">消息通知</span>
              <el-button link type="primary" size="small" @click="onMarkAllRead" :disabled="unreadCount === 0">全部已读</el-button>
            </div>

            <el-tabs v-model="bellTab" class="msg-tabs">
              <el-tab-pane name="all">
                <template #label>
                  <span>全部<el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0" type="danger" /></span>
                </template>
              </el-tab-pane>
              <el-tab-pane name="recharge">
                <template #label>
                  <span>充值<el-badge :value="unreadCountByType('recharge')" :max="99" :hidden="unreadCountByType('recharge') === 0" type="danger" /></span>
                </template>
              </el-tab-pane>
              <el-tab-pane name="settle">
                <template #label>
                  <span>结算<el-badge :value="unreadCountByType('settle')" :max="99" :hidden="unreadCountByType('settle') === 0" type="danger" /></span>
                </template>
              </el-tab-pane>
              <el-tab-pane name="insurance">
                <template #label>
                  <span>保险<el-badge :value="unreadCountByType('insurance')" :max="99" :hidden="unreadCountByType('insurance') === 0" type="danger" /></span>
                </template>
              </el-tab-pane>
            </el-tabs>

            <div class="msg-list">
              <div
                v-for="m in bellList"
                :key="m.id"
                class="msg-item"
                :class="{ unread: !m.read }"
                @click="onMsgClick(m)"
              >
                <div class="msg-item-icon" :class="m.type">
                  <el-icon><component :is="typeIcon(m.type)" /></el-icon>
                </div>
                <div class="msg-item-body">
                  <div class="msg-item-head">
                    <span class="msg-item-title">{{ m.title }}</span>
                    <span class="msg-item-time">{{ m.time }}</span>
                  </div>
                  <div class="msg-item-content">{{ m.content }}</div>
                  <div class="msg-item-foot">
                    <el-tag :type="typeColor(m.type)" size="small" effect="light">{{ m.typeLabel }}</el-tag>
                    <span v-if="m.amount" class="msg-item-amount" :style="{ color: m.type === 'recharge' ? '#00b578' : '#ff4d4f' }">
                      {{ m.type === 'recharge' ? '+' : '-' }}¥{{ Number(m.amount).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
              <el-empty v-if="bellList.length === 0" description="暂无消息" :image-size="80" />
            </div>

            <div class="msg-panel-foot" @click="goMessageCenter">
              <span>查看全部消息</span>
              <el-icon><Right /></el-icon>
            </div>
          </div>
        </el-popover>

        <div class="user-wrap">
          <el-icon><User /></el-icon>
          <span class="username">{{ username }}</span>
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
import { Bell, User, Right, Wallet, Money, Umbrella, Document } from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/messageStore'

const router = useRouter()
const route = useRoute()
const activeStep = ref(3)

const steps = ['工种配置', '任务排期', '人才库', '发布任务', '任务详情', '添加成员', '完成']

// 站内信
const {
  unreadCount,
  unreadCountByType,
  getList,
  markRead,
  markAllRead,
  state: msgState
} = useMessageStore()

const bellVisible = ref(false)
const bellTab = ref('all')
const username = ref(localStorage.getItem('company_username') || '管理员')

const bellList = computed(() => getList({ type: bellTab.value, read: 'all' }).slice(0, 10))

const typeColor = (type) => {
  const map = { recharge: 'success', settle: 'primary', insurance: 'warning', task: 'info', system: 'info' }
  return map[type] || 'info'
}
const typeIcon = (type) => {
  const map = { recharge: Wallet, settle: Money, insurance: Umbrella, task: Document, system: Bell }
  return map[type] || Bell
}

const onBellClick = () => {}
const onMarkAllRead = () => {
  markAllRead()
  ElMessage.success('全部已读')
}
const onMsgClick = (m) => {
  if (!m.read) markRead(m.id)
  if (m.link) {
    bellVisible.value = false
    router.push(m.link)
  }
}
const goMessageCenter = () => {
  bellVisible.value = false
  router.push('/company/messages')
}

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
      { id: 'notice', name: '系统公告', path: '/company/notice' },
      { id: 'messages', name: '站内信', path: '/company/messages' }
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
    '/company/project-manage': 'accountMgr',
    '/company/messages': 'system'
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
  justify-content: space-between;
  padding-right: 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.bell-wrap {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}
.bell-wrap:hover {
  background: #f2f3f5;
}
.bell-icon {
  font-size: 22px;
  color: #4e5969;
}

.user-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4e5969;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}
.user-wrap:hover { background: #f2f3f5; }
.username { font-weight: 500; }

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

<!-- 站内信 popover 全局样式（非 scoped，因 popover 渲染在 body） -->
<style>
.msg-popover.el-popover.el-popper {
  padding: 0 !important;
  border-radius: 10px !important;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.12) !important;
}

.msg-panel {
  display: flex;
  flex-direction: column;
  max-height: 540px;
}

.msg-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 6px;
  border-bottom: 1px solid #f0f0f0;
}
.mp-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
}

.msg-tabs {
  padding: 0 8px;
}
.msg-tabs .el-tabs__header {
  margin: 0 8px;
}
.msg-tabs .el-tabs__nav-wrap::after {
  background: #f0f0f0;
}
.msg-tabs .el-badge__content {
  transform: translateY(-50%) translateX(80%);
}

.msg-list {
  flex: 1;
  overflow-y: auto;
  max-height: 360px;
  padding: 4px 0;
}
.msg-list::-webkit-scrollbar { width: 4px; }
.msg-list::-webkit-scrollbar-thumb { background: #e5e6eb; border-radius: 2px; }

.msg-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f7f8fa;
}
.msg-item:hover { background: #f7f9ff; }
.msg-item.unread { background: #fff7e6; }
.msg-item.unread:hover { background: #fff1cc; }

.msg-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
}
.msg-item-icon.recharge { background: linear-gradient(135deg, #00b578, #14c98a); }
.msg-item-icon.settle { background: linear-gradient(135deg, #1e6bff, #36bffb); }
.msg-item-icon.insurance { background: linear-gradient(135deg, #ff9500, #ffb55a); }
.msg-item-icon.task { background: linear-gradient(135deg, #7b61ff, #a78bfa); }
.msg-item-icon.system { background: linear-gradient(135deg, #86909c, #a0a4ab); }

.msg-item-body { flex: 1; min-width: 0; }
.msg-item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.msg-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2329;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msg-item.unread .msg-item-title { color: #ff7a45; }
.msg-item-time {
  font-size: 11px;
  color: #a0a4ab;
  flex-shrink: 0;
}
.msg-item-content {
  font-size: 12px;
  color: #4e5969;
  margin-top: 4px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.msg-item-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.msg-item-amount {
  font-size: 13px;
  font-weight: 700;
}

.msg-panel-foot {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  color: #1e6bff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.msg-panel-foot:hover { background: #f7f9ff; }
</style>
