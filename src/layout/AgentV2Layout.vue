<template>
  <div class="agentv2-layout">
    <el-container class="layout-container">
      <el-header class="header">
        <div class="nav-top">
          <div class="left">
            <div class="logo-wrapper">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#5077e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="9,22 9,12 15,12 15,22" stroke="#5077e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="logo-text">
                <div class="logo-title">城市服务商系统</div>
                <div class="logo-subtitle">City Service Provider</div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="search-box">
              <el-input 
                v-model="searchKeyword"
                placeholder="搜索功能菜单..." 
                clearable
                class="search-input"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="header-actions">
              <el-tooltip content="消息通知" placement="bottom">
                <el-badge :value="3" class="notification-badge">
                  <el-button circle size="small" class="action-btn">
                    <el-icon><Bell /></el-icon>
                  </el-button>
                </el-badge>
              </el-tooltip>
              <el-tooltip content="帮助中心" placement="bottom">
                <el-button circle size="small" class="action-btn">
                  <el-icon><QuestionFilled /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="全屏" placement="bottom">
                <el-button circle size="small" class="action-btn" @click="toggleFullscreen">
                  <el-icon><FullScreen /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
            <el-dropdown trigger="click" class="user-dropdown">
              <span class="user-info">
                <el-avatar :size="36" class="user-avatar">
                  服
                </el-avatar>
                <div class="user-detail">
                  <div class="user-name">{{ username }}</div>
                  <div class="user-role">服务商管理员</div>
                </div>
                <el-icon class="arrow-icon"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handlePassword">
                    <el-icon><Lock /></el-icon>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container class="main-container">
        <div class="navBar">
          <div class="menu-list">
            <div 
              v-for="menu in menuList" 
              :key="menu.id" 
              class="menu-item"
            >
              <div 
                class="navTitle"
                :class="{ 'spanAct': activeMenu === menu.id }"
                @click="toggleMenu(menu.id)"
              >
                <div class="nav-icon">
                  <img :src="menu.icon" />
                </div>
                <span class="nav-text">{{ menu.name }}</span>
                <el-icon class="nav-arrow" v-if="menu.children && menu.children.length > 0">
                  <ArrowDown />
                </el-icon>
              </div>
              <transition name="slide">
                <div 
                  v-if="menu.children && menu.children.length > 0 && expandedMenus.includes(menu.id)"
                  class="nav-item-group"
                >
                  <div 
                    v-for="child in menu.children" 
                    :key="child.id"
                    class="nav-item-text"
                    :class="{ 'spanAct': isChildActive(child.path) }"
                    @click="handleMenuClick(child.path)"
                  >
                    <span class="child-dot"></span>
                    <span>{{ child.name }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <el-main class="main-content">
          <div class="content-inner">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog v-model="passwordVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="旧密码">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Bell, QuestionFilled, FullScreen, Lock, SwitchButton, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '服务商')
const passwordVisible = ref(false)
const expandedMenus = ref(['home', 'finance'])
const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const searchKeyword = ref('')

const menuList = [
  { id: 'home', name: '企业信息', icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235077e8\' stroke-width=\'2\'%3E%3Cpath d=\'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E', path: '/agentv2/home', children: [] },
  { 
    id: 'personal', 
    name: '个人代理', 
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235077e8\' stroke-width=\'2\'%3E%3Cpath d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E',
    children: [
      { id: 'personal_list', name: '业务员列表', path: '/agentv2/personal' },
      { id: 'personal_add', name: '新增业务员', path: '/agentv2/personal/add' }
    ]
  },
  { 
    id: 'enterprise', 
    name: '企业列表', 
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235077e8\' stroke-width=\'2\'%3E%3Cpath d=\'M3 7v6h6\'/%3E%3Cpath d=\'M21 17a2 2 0 0 0-2-2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\'/%3E%3C/svg%3E',
    children: [
      { id: 'enterprise_list', name: '企业列表', path: '/agentv2/enterprise' }
    ]
  },
  { 
    id: 'finance', 
    name: '财务管理', 
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235077e8\' stroke-width=\'2\'%3E%3Cpath d=\'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\'/%3E%3C/svg%3E',
    children: [
      { id: 'purchase', name: '购买明细', path: '/agentv2/purchase' },
      { id: 'settlement', name: '结算明细', path: '/agentv2/settlement' },
      { id: 'incentive', name: '激励奖励', path: '/agentv2/incentive' }
    ]
  }
]

const activeMenu = computed(() => {
  const path = route.path
  const menuMap = {
    '/agentv2': 'home',
    '/agentv2/home': 'home',
    '/agentv2/personal': 'personal',
    '/agentv2/personal/add': 'personal',
    '/agentv2/enterprise': 'enterprise',
    '/agentv2/purchase': 'finance',
    '/agentv2/settlement': 'finance',
    '/agentv2/incentive': 'finance'
  }
  return menuMap[path] || 'home'
})

const isChildActive = (path) => {
  return route.path === path
}

const toggleMenu = (id) => {
  const menu = menuList.find(m => m.id === id)
  if (menu && menu.children && menu.children.length > 0) {
    const index = expandedMenus.value.indexOf(id)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    } else {
      expandedMenus.value.push(id)
    }
  } else if (menu && menu.path) {
    router.push(menu.path)
  }
}

const handleMenuClick = (path) => {
  router.push(path)
}

const handleSearch = () => {
  ElMessage.info('搜索: ' + searchKeyword.value)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handlePassword = () => {
  passwordVisible.value = true
}

const handlePasswordSubmit = () => {
  if (!passwordForm.oldPassword) {
    ElMessage.warning('请输入旧密码')
    return
  }
  if (!passwordForm.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  passwordVisible.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  ElMessage.success('密码修改成功')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('退出成功')
  router.push('/agentv2/login')
}
</script>

<style scoped>
.agentv2-layout {
  height: 100%;
  --primary-color: #5077e8;
  --primary-light: #6c8cff;
  --primary-bg: #f0f4ff;
}

.layout-container {
  height: 100%;
}

.header {
  padding: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8ecf1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.nav-top {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #5077e8, #6c8cff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(80, 119, 232, 0.3);
}

.logo-icon svg {
  width: 22px;
  height: 22px;
}

.logo-icon svg path,
.logo-icon svg polyline {
  stroke: #fff !important;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 11px;
  color: #909399;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  background: #f5f7fa;
  box-shadow: none;
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 2px rgba(80, 119, 232, 0.1);
}

.search-input :deep(.el-input__inner) {
  font-size: 13px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 36px !important;
  height: 36px !important;
  background: #f5f7fa !important;
  border: none !important;
  color: #606266 !important;
  transition: all 0.3s !important;
}

.action-btn:hover {
  background: #e8ecf1 !important;
  color: #5077e8 !important;
  transform: translateY(-1px);
}

.notification-badge {
  cursor: pointer;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.user-info:hover {
  background: #eef2ff;
}

.user-avatar {
  background: linear-gradient(135deg, #5077e8, #6c8cff) !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

.user-detail {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.user-role {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}

.main-container {
  height: calc(100vh - 64px);
}

.navBar {
  height: 100%;
  width: 240px;
  padding: 16px 12px;
  overflow: hidden;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #e8ecf1;
}

.navBar::-webkit-scrollbar {
  width: 4px;
}

.navBar::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.navBar::-webkit-scrollbar-track {
  background: transparent;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  border-radius: 8px;
  overflow: hidden;
}

.navTitle {
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.25s;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
}

.navTitle:hover {
  background: #f0f4ff;
  color: #5077e8;
}

.navTitle.spanAct {
  background: linear-gradient(90deg, rgba(80, 119, 232, 0.1), rgba(80, 119, 232, 0.05));
  color: #5077e8;
  font-weight: 600;
}

.navTitle.spanAct::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #5077e8, #6c8cff);
  border-radius: 0 3px 3px 0;
}

.nav-icon {
  width: 36px;
  height: 36px;
  background: #f0f4ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s;
}

.navTitle:hover .nav-icon,
.navTitle.spanAct .nav-icon {
  background: #fff;
  box-shadow: 0 2px 8px rgba(80, 119, 232, 0.2);
}

.nav-icon img {
  width: 18px;
  height: 18px;
}

.nav-text {
  flex: 1;
  font-size: 14px;
}

.nav-arrow {
  font-size: 12px;
  color: #909399;
  transition: transform 0.25s;
}

.navTitle.spanAct .nav-arrow {
  transform: rotate(180deg);
  color: #5077e8;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 200px;
}

.nav-item-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0 8px 14px;
  margin-left: 24px;
  border-left: 1px dashed #e0e4eb;
}

.nav-item-text {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  border-radius: 6px;
  color: #606266;
  transition: all 0.25s;
}

.nav-item-text:hover {
  background: #f0f4ff;
  color: #5077e8;
}

.nav-item-text.spanAct {
  background: #e8f0ff;
  color: #5077e8;
  font-weight: 500;
}

.child-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c0c4cc;
  flex-shrink: 0;
  transition: all 0.25s;
}

.nav-item-text:hover .child-dot,
.nav-item-text.spanAct .child-dot {
  background: #5077e8;
  box-shadow: 0 0 6px rgba(80, 119, 232, 0.5);
}

.main-content {
  background-color: #f5f7fa;
  width: calc(100% - 240px);
  padding: 0;
  border-top-left-radius: 20px;
  overflow: auto;
}

.content-inner {
  padding: 20px;
}

:deep(.el-dropdown-menu__item) {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 13px !important;
}
</style>