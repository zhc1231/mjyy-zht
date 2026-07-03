<template>
  <div class="error-401">
    <div class="error-content">
      <div class="error-icon">401</div>
      <h1 class="error-title">401错误!</h1>
      <h2 class="error-subtitle">您没有访问权限！</h2>
      <p class="error-desc">对不起，您没有访问权限，请您联系管理员！您可以返回主页面</p>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button @click="goHome">返回菜单</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.error-401 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f2f5;
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-icon {
  font-size: 120px;
  font-weight: bold;
  color: #e6a23c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 36px;
  color: #303133;
  margin: 0 0 10px 0;
}

.error-subtitle {
  font-size: 24px;
  color: #606266;
  margin: 0 0 15px 0;
}

.error-desc {
  font-size: 14px;
  color: #909399;
  margin: 0 0 30px 0;
  line-height: 1.8;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>