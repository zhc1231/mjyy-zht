<template>
  <div class="project-list-page">
    <div class="page-header">
      <h2 class="page-title">（{{ companyName }}）项目列表</h2>
      <el-button type="primary" class="add-btn" @click="handleAddProject">
        <el-icon><Plus /></el-icon>
        新增项目
      </el-button>
    </div>

    <div class="project-list" v-if="projectList.length > 0">
      <div 
        v-for="project in projectList" 
        :key="project.id"
        class="project-card"
        @click="enterProject(project)"
      >
        <div class="project-name">{{ project.name }}</div>
        <div class="project-info">
          <span class="project-status" :class="project.status">
            {{ project.status }}
          </span>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <el-empty description="暂无项目，点击右上角新增项目">
        <template #image>
          <el-icon class="empty-icon"><FolderOpened /></el-icon>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, FolderOpened } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const companyName = computed(() => route.query.companyName || '企业')

const projectList = ref([])

const handleAddProject = () => {
  ElMessage.info('新增项目功能')
}

const enterProject = (project) => {
  ElMessage.info('进入项目：' + project.name)
}
</script>

<style scoped>
.project-list-page {
  min-height: 100vh;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.add-btn {
  background: linear-gradient(135deg, #E6A23C 0%, #f0ad4e 100%) !important;
  border: none !important;
  border-radius: 6px;
  padding: 0 16px;
  height: 36px;
  font-size: 14px;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #E6A23C;
  transform: translateY(-2px);
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.project-info {
  display: flex;
  justify-content: flex-end;
}

.project-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
}

.project-status.进行中 {
  background: #ecf5ff;
  color: #409eff;
}

.project-status.已完成 {
  background: #f0f9eb;
  color: #67c23a;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  color: #dcdfe6;
}
</style>
