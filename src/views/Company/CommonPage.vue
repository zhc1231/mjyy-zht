<template>
  <div class="company-common-page">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>
    <div class="page-content">
      <el-empty :description="pageTitle + '功能开发中'">
        <template #image>
          <el-icon class="empty-icon"><Document /></el-icon>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

const route = useRoute()

const pageTitle = computed(() => route.meta.title || '页面')
</script>

<style scoped>
.company-common-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.page-content {
  background: #fff;
  border-radius: 10px;
  padding: 40px 20px;
  min-height: 400px;
}

.empty-icon {
  font-size: 80px;
  color: #dcdfe6;
}
</style>
