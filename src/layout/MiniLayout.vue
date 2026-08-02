<template>
  <div class="mini-layout">
    <div class="phone-frame">
      <div class="phone-screen">
        <div class="status-bar">
          <span class="status-time">9:41</span>
          <div class="status-icons">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        <div class="nav-bar">
          <div class="nav-back" @click="handleBack">
            <svg v-if="showBack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div class="nav-title">{{ pageTitle }}</div>
          <div class="nav-close" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
        <div class="content-area">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <div class="tab-bar" v-if="showTabBar">
          <div 
            v-for="tab in tabList" 
            :key="tab.path" 
            class="tab-item"
            :class="{ active: route.path.startsWith(tab.path) }"
            @click="router.push(tab.path)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  const titleMap = {
    '/mini/home': '民匠有约',
    '/mini/task-list': '我的任务',
    '/mini/settlement': '结算收入明细',
    '/mini/settlement-confirm': '结算单确认',
    '/mini/profile': '个人中心'
  }
  return titleMap[route.path] || '民匠有约小程序'
})

const showBack = computed(() => {
  return route.path !== '/mini/home' && route.path !== '/mini/task-list' && route.path !== '/mini/settlement' && route.path !== '/mini/profile'
})

const showTabBar = computed(() => {
  return !['/mini/settlement-confirm'].includes(route.path)
})

const tabList = [
  { path: '/mini/home', icon: '🏠', label: '首页' },
  { path: '/mini/task-list', icon: '📋', label: '我的任务' },
  { path: '/mini/settlement', icon: '💰', label: '结算' },
  { path: '/mini/profile', icon: '👤', label: '我的' }
]

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/mini/home')
  }
}

const handleClose = () => {
  ElMessage.info('关闭小程序')
}
</script>

<style scoped>
.mini-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.phone-frame {
  width: 375px;
  height: 750px;
  background: #000;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.3),
    inset 0 0 0 2px #333;
  position: relative;
}

.phone-frame::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 24px;
  background: #000;
  border-radius: 12px;
  z-index: 10;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #f5f6fa;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.status-bar {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  padding-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  background: #fff;
  flex-shrink: 0;
}

.status-icons {
  display: flex;
  gap: 4px;
  font-size: 12px;
}

.nav-bar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.nav-back,
.nav-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
}

.nav-back svg {
  width: 22px;
  height: 22px;
}

.nav-close svg {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  text-align: center;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: #f5f6fa;
}

.content-area::-webkit-scrollbar {
  width: 0;
  display: none;
}

.tab-bar {
  height: 56px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-shrink: 0;
  padding-bottom: 4px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item .tab-icon {
  font-size: 20px;
  opacity: 0.5;
}

.tab-item .tab-label {
  font-size: 11px;
  color: #999;
}

.tab-item.active .tab-icon {
  opacity: 1;
}

.tab-item.active .tab-label {
  color: #409EFF;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
