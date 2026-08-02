<template>
  <div class="company-common-page">
    <div class="box-card">
      <div class="card-header">
        <span class="card-title">{{ pageTitle }}</span>
      </div>
      <div class="page-content">
        <div class="empty-wrap">
          <div class="empty-icon">
            <svg viewBox="0 0 64 64" width="80" height="80">
              <circle cx="32" cy="32" r="30" fill="#f5f7fa" stroke="#e4e7ed" stroke-width="2"/>
              <path d="M20 24h24v4H20zm0 8h24v4H20zm0 8h16v4H20z" fill="#c0c4cc"/>
            </svg>
          </div>
          <p class="empty-text">{{ pageTitle }}功能开发中</p>
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
</script>

<style scoped>
.company-common-page {
  font-family: Arial, Helvetica, sans-serif;
}

.box-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.page-content {
  padding: 40px 20px;
  min-height: 400px;
}

.empty-wrap {
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #909399;
  margin: 0;
}
</style>
