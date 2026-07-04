<template>
  <div class="agentv2-layout">
    <el-container class="layout-container">
      <el-header class="header">
        <div class="nav-top">
          <div class="left">
            <div class="wavy">
              <span :style="{ '--i': 1 }">城</span>
              <span :style="{ '--i': 2 }">市</span>
              <span :style="{ '--i': 3 }">服</span>
              <span :style="{ '--i': 4 }">务</span>
              <span :style="{ '--i': 5 }">商</span>
              <span :style="{ '--i': 6 }">系</span>
              <span :style="{ '--i': 7 }">统</span>
            </div>
          </div>
          <div class="right">
            <div class="head-search-form">
              <input type="text" placeholder="搜索..." />
              <button>搜索</button>
            </div>
            <el-dropdown trigger="click">
              <span class="shop-name cursor-pointer">
                <span class="shop-image-wrapper">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%235077e8'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='white' font-size='40'%3E%E6%9C%8D%3C/text%3E%3C/svg%3E" class="shop-image" />
                </span>
                <span class="shop-name-text">{{ username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handlePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container class="main-container">
        <div class="navBar">
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
              <img :src="menu.icon" class="navImage" />
              <span>{{ menu.name }}</span>
            </div>
            <div 
              v-if="menu.children && menu.children.length > 0 && expandedMenus.includes(menu.id)"
              class="nav-item-group"
            >
              <div 
                v-for="child in menu.children" 
                :key="child.id"
                class="nav-item-text"
                :class="{ 'spanAct': activeMenu === child.id }"
                @click="handleMenuClick(child.path)"
              >
                {{ child.name }}
              </div>
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

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '服务商')
const passwordVisible = ref(false)
const expandedMenus = ref(['home', 'finance'])
const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

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
}

.layout-container {
  height: 100%;
}

.header {
  padding: 0;
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.nav-top {
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  height: 100%;
  display: flex;
  align-items: center;
}

.wavy {
  position: relative;
  padding-left: 12px;
}

.wavy span {
  position: relative;
  display: inline-block;
  color: #5077e8;
  font-size: 26px;
  font-weight: 700;
  animation: animate 2s ease-in-out infinite;
  animation-delay: calc(.2s * var(--i));
  padding-right: 2px;
}

@keyframes animate {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.right {
  display: flex;
  align-items: center;
}

.head-search-form {
  position: relative;
  height: 45px;
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.head-search-form input {
  box-sizing: border-box;
  float: left;
  width: 300px;
  height: 32px;
  padding: 0 41px 0 10px;
  border-style: solid;
  border-color: #5077e8;
  border-width: 2px 0 2px 2px;
  border-radius: 8px 0 0 8px;
  background: #fff;
  outline: none;
}

.head-search-form button {
  float: left;
  width: 58px;
  height: 32px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 8px 8px 0;
  color: #fff;
  cursor: pointer;
  background-color: #5077e8;
}

.shop-name {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.shop-image-wrapper {
  margin-right: 8px;
}

.shop-image {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  object-fit: cover;
}

.shop-name-text {
  font-size: 14px;
  color: #333;
}

.main-container {
  height: calc(100vh - 80px);
}

.navBar {
  height: 100%;
  width: 230px;
  padding: 16px;
  padding-top: 5px;
  overflow: hidden;
  overflow-y: auto;
  cursor: pointer;
  background: #fff;
}

.navBar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.navTitle {
  font-size: 14px;
  line-height: 34px;
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #030217;
  transition: color 0.3s;
  padding-left: 8px;
}

.navTitle:hover {
  color: #5077e8;
}

.navImage {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}

.nav-item-group {
  margin: 6px 0;
  font-size: 14px;
  padding-left: 22px;
  display: flex;
  flex-wrap: wrap;
  color: #666;
}

.nav-item-text {
  width: 100%;
  line-height: 30px;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-item-text:hover {
  color: #5077e8;
}

.spanAct {
  color: #5077e8 !important;
  font-weight: 500;
}

.main-content {
  background-color: #eff0f4;
  width: calc(100% - 230px);
  padding: 0;
  border-top-right-radius: 30px;
  overflow: auto;
}

.content-inner {
  padding: 20px;
}
</style>