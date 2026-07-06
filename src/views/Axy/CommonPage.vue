<template>
  <div class="common-page">
    <div class="page-header">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="empty-state">
          <div class="empty-icon">{{ emptyIcon }}</div>
          <p>该页面功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => route.meta.title || '页面')

const emptyIcon = computed(() => {
  const iconMap = {
    '薪资结算': '💰',
    '保险管理': '🛡️',
    '数据统计': '📊',
    '系统管理': '⚙️'
  }
  return iconMap[route.meta.title] || '📋'
})
</script>

<style scoped>
.common-page {
  padding-bottom: 24px;
}
.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}
.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.panel-body {
  padding: 40px;
  min-height: 400px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.empty-state p {
  font-size: 14px;
  color: #909399;
}
</style>