<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <div class="page-placeholder">{{ title }} - 待实现</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const title = ref('页面')
</script>

<style scoped>
.page-container { padding: 20px; }
.page-placeholder { color: #999; text-align: center; padding: 60px 0; }
</style>
