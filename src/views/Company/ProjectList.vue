<template>
  <div class="project-list-page">
    <div class="page-header">
      <span class="page-title">（{{ companyName }}）项目列表</span>
      <el-button type="primary" size="small" @click="handleAddProject">
        + 新增项目
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
        <div class="project-time">创建时间：{{ project.createTime }}</div>
        <div class="project-footer">
          <span class="project-status" :class="project.statusClass">
            {{ project.status }}
          </span>
          <el-button size="small" @click.stop="editProject(project)">编辑项目</el-button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <svg viewBox="0 0 64 64" width="80" height="80">
          <circle cx="32" cy="32" r="30" fill="#f5f7fa" stroke="#e4e7ed" stroke-width="2"/>
          <path d="M20 28h24v4H20zm0 8h16v4H20z" fill="#c0c4cc"/>
        </svg>
      </div>
      <p class="empty-text">暂无项目，点击右上角新增项目</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const companyName = computed(() => route.query.companyName || '企业')

const projectList = ref([
  { id: 1, name: '11111', createTime: '2026-06-01 10:25:10', status: '认证通过', statusClass: 'pass' },
  { id: 2, name: '232333', createTime: '2026-06-02 15:26:09', status: '认证通过', statusClass: 'pass' },
  { id: 3, name: '售后001', createTime: '2026-06-02 16:04:57', status: '认证通过', statusClass: 'pass' },
  { id: 4, name: '42334234234', createTime: '2026-06-02 16:11:55', status: '认证通过', statusClass: 'pass' }
])

const handleAddProject = () => {
  ElMessage.info('新增项目功能')
}

const enterProject = (project) => {
  ElMessage.info('进入项目：' + project.name)
}

const editProject = (project) => {
  ElMessage.info('编辑项目：' + project.name)
}
</script>

<style scoped>
.project-list-page {
  background: #fff;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.project-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.project-time {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-status {
  font-size: 13px;
  color: #67C23A;
}

.project-status.pass {
  color: #67C23A;
}

.empty-state {
  padding: 60px 0;
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

:deep(.el-button--primary) {
  background-color: #5077E8;
  border-color: #5077E8;
  border-radius: 3px;
}
</style>
