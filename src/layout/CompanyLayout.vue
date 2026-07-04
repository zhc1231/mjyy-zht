<template>
  <div class="company-layout">
    <el-container class="layout-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo-area">
          <div class="logo-text">
            <span class="logo-char">民</span>
            <span class="logo-char">匠</span>
            <span class="logo-char">有</span>
            <span class="logo-char">约</span>
          </div>
        </div>
        <div class="menu-area">
          <div 
            v-for="menu in menuList" 
            :key="menu.id"
            class="menu-item"
          >
            <div 
              class="menu-title"
              :class="{ active: activeMenu === menu.id }"
              @click="handleMenuClick(menu)"
            >
              <span class="menu-text">{{ menu.name }}</span>
              <el-icon v-if="menu.children && menu.children.length > 0" class="menu-arrow">
                <ArrowDown />
              </el-icon>
            </div>
            <div 
              v-if="menu.children && menu.children.length > 0 && expandedMenus.includes(menu.id)"
              class="sub-menu"
            >
              <div 
                v-for="child in menu.children" 
                :key="child.id"
                class="sub-menu-item"
                :class="{ active: isChildActive(child.path) }"
                @click="handleSubMenuClick(child.path)"
              >
                {{ child.name }}
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <el-container class="main-container">
        <el-header class="header">
          <div class="header-left">
            <el-button class="company-selector" @click="showCompanyList">
              <span>操作流程指南:</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </el-button>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click" class="user-dropdown">
              <span class="user-info">
                <el-button class="company-name-btn">
                  {{ currentCompany }}
                  <el-icon class="arrow-icon"><ArrowDown /></el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const expandedMenus = ref(['taskGuide'])
const currentCompany = ref('陕西火车侠建设工程有限公司')

const menuList = [
  { id: 'home', name: '首页', path: '/company/home', children: [] },
  { 
    id: 'taskGuide', 
    name: '任务指南',
    children: [
      { id: 'workType', name: '1.任务工种', path: '/company/work-type' },
      { id: 'taskSchedule', name: '2.任务排期', path: '/company/task-schedule' },
      { id: 'talentPool', name: '3.人才库', path: '/company/talent-pool' },
      { id: 'taskListGuide', name: '4.任务列表', path: '/company/task-list-guide' }
    ]
  },
  { id: 'taskCenter', name: '任务中心', path: '/company/task-center', children: [] },
  { id: 'settlement', name: '结算记录', path: '/company/settlement', children: [] },
  { id: 'attendance', name: '打卡机数据', path: '/company/attendance', children: [] },
  { id: 'account', name: '账户管理', path: '/company/account', children: [] },
  { id: 'project', name: '项目管理', path: '/company/project', children: [] },
  { id: 'system', name: '系统管理', path: '/company/system', children: [] }
]

const activeMenu = computed(() => {
  const path = route.path
  const menuMap = {
    '/company': 'home',
    '/company/home': 'home',
    '/company/work-type': 'taskGuide',
    '/company/task-schedule': 'taskGuide',
    '/company/talent-pool': 'taskGuide',
    '/company/task-list-guide': 'taskGuide',
    '/company/task-center': 'taskCenter',
    '/company/settlement': 'settlement',
    '/company/attendance': 'attendance',
    '/company/account': 'account',
    '/company/project': 'project',
    '/company/system': 'system'
  }
  return menuMap[path] || 'home'
})

const isChildActive = (path) => {
  return route.path === path
}

const handleMenuClick = (menu) => {
  if (menu.children && menu.children.length > 0) {
    const index = expandedMenus.value.indexOf(menu.id)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    } else {
      expandedMenus.value.push(menu.id)
    }
  } else if (menu.path) {
    router.push(menu.path)
  }
}

const handleSubMenuClick = (path) => {
  router.push(path)
}

const showCompanyList = () => {
  router.push('/company/company-list')
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
  --primary-color: #E6A23C;
  --primary-light: #f0ad4e;
  --primary-bg: #fff7e6;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-area {
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #E6A23C;
}

.logo-char {
  display: inline-block;
}

.menu-area {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.menu-area::-webkit-scrollbar {
  width: 4px;
}

.menu-area::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.menu-item {
  margin-bottom: 2px;
}

.menu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-title:hover {
  background: #fff7e6;
  color: #E6A23C;
}

.menu-title.active {
  color: #E6A23C;
  font-weight: 500;
  background: #fff7e6;
}

.menu-title.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #E6A23C;
}

.menu-text {
  flex: 1;
}

.menu-arrow {
  font-size: 12px;
  transition: transform 0.3s;
}

.sub-menu {
  padding: 4px 0 8px;
}

.sub-menu-item {
  padding: 10px 24px 10px 44px;
  font-size: 13px;
  color: #909399;
  cursor: pointer;
  transition: all 0.3s;
}

.sub-menu-item:hover {
  color: #E6A23C;
  background: #fffaf0;
}

.sub-menu-item.active {
  color: #E6A23C;
  font-weight: 500;
  background: #fffaf0;
}

.main-container {
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.company-selector {
  background: #fff7e6 !important;
  color: #E6A23C !important;
  border: 1px solid #ffd591 !important;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 13px;
  height: 36px;
}

.company-selector:hover {
  background: #ffecd4 !important;
}

.arrow-icon {
  margin-left: 6px;
  font-size: 12px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
}

.company-name-btn {
  background: #f5f7fa !important;
  color: #303133 !important;
  border: none !important;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 14px;
  height: 36px;
  font-weight: 500;
}

.company-name-btn:hover {
  background: #ebeef5 !important;
}

.main-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

:deep(.el-dropdown-menu__item) {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 13px !important;
}
</style>
