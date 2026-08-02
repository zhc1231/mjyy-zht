<template>
  <div class="axy-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">🌿</div>
          <span class="logo-text">安心云</span>
        </div>
      </div>
      <nav class="menu">
        <div 
          v-for="item in menuList" 
          :key="item.id" 
          class="menu-item"
          :class="{ 'is-active': activeMenu === item.id, 'is-opened': openedMenus.includes(item.id) }"
          @click="handleMenuClick(item)"
        >
          <div class="menu-link">
            <span class="menu-icon" v-html="item.icon"></span>
            <span class="menu-name">{{ item.name }}</span>
            <span v-if="item.children && item.children.length" class="menu-arrow">▾</span>
          </div>
          <div v-if="item.children && item.children.length && openedMenus.includes(item.id)" class="sub-menu">
            <div 
              v-for="child in item.children" 
              :key="child.id"
              class="sub-menu-item"
              :class="{ 'is-active': route.path === child.path }"
              @click="handleSubMenuClick(child)"
            >
              {{ child.name }}
            </div>
          </div>
        </div>
      </nav>
    </aside>
    <main class="main-content">
      <header class="top-bar">
        <div class="top-left">
          <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">☰</button>
          <span class="page-title">{{ currentPageTitle }}</span>
        </div>
        <div class="top-right">
          <div class="user-info">
            <span class="user-name">{{ username }}</span>
            <span class="user-avatar">👤</span>
          </div>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)
const openedMenus = ref(['home'])
const username = ref(localStorage.getItem('username') || '用户')

const menuList = [
  { id: 'home', name: '首页', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', path: '/axy', children: [] },
  { 
    id: 'user', 
    name: '用户', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', 
    children: [
      { id: 'user_list', name: '人员列表', path: '/axy/user/list' }
    ]
  },
  { 
    id: 'task', 
    name: '任务管理', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', 
    children: [
      { id: 'task_list', name: '任务列表', path: '/axy/task/list' },
      { id: 'task_publish', name: '任务发布', path: '/axy/task/publish' },
      { id: 'task_schedule', name: '任务排期', path: '/axy/task/schedule' }
    ]
  },
  { 
    id: 'attendance', 
    name: '考勤管理', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', 
    children: [
      { id: 'attendance_check', name: '考勤确认', path: '/axy/attendance/check' },
      { id: 'attendance_record', name: '打卡记录', path: '/axy/attendance/record' },
      { id: 'attendance_stat', name: '考勤统计', path: '/axy/attendance/stat' }
    ]
  },
  { 
    id: 'settlement', 
    name: '费用结算', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>', 
    children: [
      { id: 'settlement_list', name: '结算单列表', path: '/axy/settlement/list' },
      { id: 'settlement_confirm', name: '费用确认', path: '/axy/settlement/confirm' },
      { id: 'salary_structure', name: '费用规则', path: '/axy/settlement/salary-rule' }
    ]
  },
  { 
    id: 'training', 
    name: '培训考证', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', 
    children: [
      { id: 'training_course', name: '培训课程', path: '/axy/training/course' },
      { id: 'training_study', name: '在线学习', path: '/axy/training/study' },
      { id: 'training_exam', name: '考试管理', path: '/axy/training/exam' },
      { id: 'training_cert', name: '证书管理', path: '/axy/training/cert' }
    ]
  },
  { 
    id: 'insurance', 
    name: '保险管理', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9"/><path d="M14 17H5"/><path d="M14 12a2 2 0 0 0-2-2H7"/><path d="M14 7a2 2 0 0 0-2-2H7"/><path d="M14 17a2 2 0 0 0-2 2H7"/><path d="M20 12h-5"/></svg>', 
    children: [
      { id: 'insurance_policy', name: '保单管理', path: '/axy/insurance/policy' },
      { id: 'insurance_apply', name: '投保申请', path: '/axy/insurance/apply' }
    ]
  },
  { 
    id: 'contract', 
    name: '合同管理', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', 
    children: [
      { id: 'contract_list', name: '合同列表', path: '/axy/contract/list' },
      { id: 'contract_template', name: '合同模板', path: '/axy/contract/template' },
      { id: 'evidence', name: '证据存证', path: '/axy/contract/evidence' }
    ]
  },
  { id: 'announcement', name: '企业公告', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>', path: '/axy/announcement', children: [] },
  { id: 'message', name: '消息通知', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>', path: '/axy/message', children: [] },
  { id: 'statistics', name: '数据统计', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', path: '/axy/statistics', children: [] },
  { id: 'system', name: '系统设置', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', path: '/axy/system', children: [] }
]

const activeMenu = computed(() => {
  const path = route.path
  const menuMap = {
    '/axy': 'home',
    '/axy/home': 'home',
    '/axy/user/list': 'user',
    '/axy/task/list': 'task',
    '/axy/task/publish': 'task',
    '/axy/task/schedule': 'task',
    '/axy/attendance/check': 'attendance',
    '/axy/attendance/record': 'attendance',
    '/axy/attendance/stat': 'attendance',
    '/axy/settlement/list': 'settlement',
    '/axy/settlement/confirm': 'settlement',
    '/axy/settlement/salary-rule': 'settlement',
    '/axy/training/course': 'training',
    '/axy/training/study': 'training',
    '/axy/training/exam': 'training',
    '/axy/training/cert': 'training',
    '/axy/insurance/policy': 'insurance',
    '/axy/insurance/apply': 'insurance',
    '/axy/contract/list': 'contract',
    '/axy/contract/template': 'contract',
    '/axy/contract/evidence': 'contract',
    '/axy/announcement': 'announcement',
    '/axy/message': 'message',
    '/axy/statistics': 'statistics',
    '/axy/system': 'system'
  }
  return menuMap[path] || 'home'
})

const currentPageTitle = computed(() => {
  const path = route.path
  const titleMap = {
    '/axy': '首页仪表盘',
    '/axy/home': '首页仪表盘',
    '/axy/user/list': '人员列表',
    '/axy/task/list': '任务列表',
    '/axy/task/publish': '任务发布',
    '/axy/task/schedule': '任务排期',
    '/axy/attendance/check': '考勤确认',
    '/axy/attendance/record': '打卡记录',
    '/axy/attendance/stat': '考勤统计',
    '/axy/settlement/list': '结算单列表',
    '/axy/settlement/confirm': '费用确认',
    '/axy/settlement/salary-rule': '费用规则',
    '/axy/training/course': '培训课程',
    '/axy/training/study': '在线学习',
    '/axy/training/exam': '考试管理',
    '/axy/training/cert': '证书管理',
    '/axy/insurance/policy': '保单管理',
    '/axy/insurance/apply': '投保申请',
    '/axy/contract/list': '合同列表',
    '/axy/contract/template': '合同模板',
    '/axy/contract/evidence': '证据存证',
    '/axy/announcement': '企业公告',
    '/axy/message': '消息通知',
    '/axy/statistics': '数据统计',
    '/axy/system': '系统设置'
  }
  return titleMap[path] || '安心云'
})

const handleMenuClick = (item) => {
  if (item.children && item.children.length) {
    if (openedMenus.value.includes(item.id)) {
      openedMenus.value = openedMenus.value.filter(id => id !== item.id)
    } else {
      openedMenus.value.push(item.id)
    }
  } else if (item.path) {
    router.push(item.path)
  }
}

const handleSubMenuClick = (child) => {
  if (child.path) {
    router.push(child.path)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('退出成功')
  router.push('/axy/login')
}
</script>

<style scoped>
.axy-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #001529 0%, #002140 100%);
  color: #fff;
  flex-shrink: 0;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}
.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
}
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}
.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #91d5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}
.menu {
  padding: 12px 8px;
}
.menu-item {
  cursor: pointer;
  margin-bottom: 4px;
}
.menu-link {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 14px;
  color: rgba(255,255,255,0.75);
  transition: all 0.25s ease;
  border-radius: 8px;
  font-weight: 500;
}
.menu-link:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
  transform: translateX(2px);
}
.menu-item.is-active > .menu-link {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(64,158,255,0.3);
}
.menu-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.menu-name {
  flex: 1;
  font-size: 14px;
}
.menu-arrow {
  font-size: 10px;
  transition: transform 0.25s ease;
  opacity: 0.6;
}
.menu-item.is-opened .menu-arrow {
  transform: rotate(180deg);
}
.sub-menu {
  padding: 4px 0 8px 8px;
  margin-left: 20px;
  border-left: 2px solid rgba(64,158,255,0.3);
}
.sub-menu-item {
  display: block;
  padding: 11px 16px 11px 20px;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  transition: all 0.2s ease;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2px;
}
.sub-menu-item:hover {
  background: rgba(64,158,255,0.1);
  color: #91d5ff;
}
.sub-menu-item.is-active {
  color: #409EFF;
  background: rgba(64,158,255,0.15);
  font-weight: 500;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.top-bar {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}
.top-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.toggle-btn {
  background: #f5f7fa;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #606266;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.toggle-btn:hover {
  background: #ecf5ff;
  color: #409EFF;
}
.page-title {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
}
.top-right {
  display: flex;
  align-items: center;
  gap: 24px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  background: #f5f7fa;
  transition: all 0.2s ease;
}
.user-info:hover {
  background: #ecf5ff;
}
.user-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}
.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.25);
}
.logout-btn {
  padding: 8px 20px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #ef4444;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}
.logout-btn:hover {
  background: #fef2f2;
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(239,68,68,0.15);
}
.content-wrapper {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}
</style>