<template>
  <div class="training-study-page">
    <div class="page-header">
      <h2>在线学习</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索课程名称" clearable style="width: 260px;" />
        <el-select v-model="filterType" placeholder="课程类型" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="安全教育" value="安全教育" />
          <el-option label="技能培训" value="技能培训" />
          <el-option label="政策法规" value="政策法规" />
        </el-select>
        <el-button @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="course-grid">
      <div v-for="course in courseList" :key="course.id" class="course-card" @click="showCourseDetail(course)">
        <div class="course-cover">
          <img :src="course.cover" :alt="course.title" />
          <div class="course-duration">{{ course.duration }}</div>
        </div>
        <div class="course-info">
          <h3>{{ course.title }}</h3>
          <p class="course-desc">{{ course.description }}</p>
          <div class="course-meta">
            <span class="meta-item">{{ course.category }}</span>
            <span class="meta-item">{{ course.learnCount }}人学习</span>
          </div>
          <div class="course-progress">
            <el-progress v-if="course.progress > 0" :percentage="course.progress" :stroke-width="6" />
            <span v-else class="not-started">未开始学习</span>
          </div>
          <el-button type="primary" @click.stop="startLearn(course)">
            {{ course.progress === 100 ? '已完成' : course.progress > 0 ? '继续学习' : '开始学习' }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="learning-section">
      <h3>我的学习进度</h3>
      <el-table :data="learningList" border style="width: 100%;">
        <el-table-column prop="title" label="课程名称" min-width="200" />
        <el-table-column prop="category" label="课程类型" width="120" />
        <el-table-column prop="duration" label="课程时长" width="100" />
        <el-table-column prop="progress" label="学习进度" width="180">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" :stroke-width="12" :text-inside="true" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="学习状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已完成' ? 'success' : scope.row.status === '学习中' ? 'primary' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLearn" label="上次学习" width="160" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="small" type="primary">继续学习</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterType = ref('')

const courseList = ref([
  { id: 1, title: '建筑施工安全操作规程', description: '学习建筑施工中的各项安全操作规程和注意事项，确保施工安全。', category: '安全教育', duration: '45分钟', learnCount: 1256, progress: 75, cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop' },
  { id: 2, title: '电工技能培训基础', description: '掌握电工基础知识，包括电路原理、电气设备操作等。', category: '技能培训', duration: '2小时', learnCount: 892, progress: 0, cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop' },
  { id: 3, title: '劳务派遣政策法规解读', description: '了解最新的劳务派遣政策法规，合规开展业务。', category: '政策法规', duration: '1小时', learnCount: 678, progress: 100, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=225&fit=crop' },
  { id: 4, title: '高处作业安全培训', description: '学习高处作业的安全防护措施和操作规程。', category: '安全教育', duration: '30分钟', learnCount: 543, progress: 40, cover: 'https://images.unsplash.com/photo-1593279074389-b83d75992556?w=400&h=225&fit=crop' },
  { id: 5, title: '消防安全知识', description: '掌握消防安全知识，学会使用消防器材。', category: '安全教育', duration: '40分钟', learnCount: 1123, progress: 0, cover: 'https://images.unsplash.com/photo-1634849167835-7a9009d575d3?w=400&h=225&fit=crop' },
  { id: 6, title: '物流仓储管理', description: '学习物流仓储的基本流程和管理方法。', category: '技能培训', duration: '1.5小时', learnCount: 432, progress: 60, cover: 'https://images.unsplash.com/photo-1551524749-08740f6d1f40?w=400&h=225&fit=crop' }
])

const learningList = ref([
  { title: '建筑施工安全操作规程', category: '安全教育', duration: '45分钟', progress: 75, status: '学习中', lastLearn: '2026-07-07 14:30' },
  { title: '劳务派遣政策法规解读', category: '政策法规', duration: '1小时', progress: 100, status: '已完成', lastLearn: '2026-07-05 16:00' },
  { title: '高处作业安全培训', category: '安全教育', duration: '30分钟', progress: 40, status: '学习中', lastLearn: '2026-07-06 10:15' },
  { title: '物流仓储管理', category: '技能培训', duration: '1.5小时', progress: 60, status: '学习中', lastLearn: '2026-07-08 09:00' }
])

const handleSearch = () => {}
const showCourseDetail = (course) => {}
const startLearn = (course) => {
  ElMessage.success(`开始学习：${course.title}`)
}
</script>

<style scoped>
.training-study-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-cover {
  position: relative;
  height: 180px;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-info {
  padding: 16px;
}

.course-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
}

.course-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 12px;
  color: #909399;
}

.course-progress {
  margin-bottom: 16px;
}

.not-started {
  font-size: 12px;
  color: #909399;
}

.course-info .el-button {
  width: 100%;
}

.learning-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.learning-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}
</style>