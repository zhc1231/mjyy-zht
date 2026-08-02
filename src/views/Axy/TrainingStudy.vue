<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>在线学习</h2>
        <p>提供安全教育、技能培训等各类在线课程</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出记录
        </el-button>
        <el-button type="primary" @click="handleAddCourse">
          <span>➕</span> 新增课程
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ totalCourses }}</span>
        <span class="stat-label">课程总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ completedCount }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ learningCount }}</span>
        <span class="stat-label">学习中</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ notStartCount }}</span>
        <span class="stat-label">未开始</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索课程名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 140px;">
            <el-option label="安全教育" value="安全教育" />
            <el-option label="技能培训" value="技能培训" />
            <el-option label="政策法规" value="政策法规" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="course-section">
      <div class="section-head">
        <h3>全部课程</h3>
      </div>
      <div class="course-grid">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card" @click="showCourseDetail(course)">
          <div class="course-cover">
            <img :src="course.cover" :alt="course.title" />
            <div class="course-duration">{{ course.duration }}</div>
            <div class="course-category">{{ course.category }}</div>
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-desc">{{ course.description }}</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                {{ course.learnCount }}人学习
              </span>
            </div>
            <div class="course-progress">
              <div v-if="course.progress > 0" class="progress-bar-wrap">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ course.progress }}%</span>
              </div>
              <span v-else class="not-started">未开始学习</span>
            </div>
            <el-button type="primary" @click.stop="startLearn(course)" class="learn-btn">
              {{ course.progress === 100 ? '重新学习' : course.progress > 0 ? '继续学习' : '开始学习' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="section-title">
        <h3>我的学习进度</h3>
      </div>
      <el-table :data="learningList" stripe>
        <el-table-column prop="title" label="课程名称" min-width="220" />
        <el-table-column prop="category" label="课程类型" width="120" />
        <el-table-column prop="duration" label="课程时长" width="100" />
        <el-table-column label="学习进度" width="200">
          <template #default="{ row }">
            <div class="table-progress">
              <div class="progress-bar small">
                <div class="progress-fill" :style="{ width: row.progress + '%' }"></div>
              </div>
              <span class="progress-num">{{ row.progress }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学习状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastLearn" label="上次学习" width="160" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default>
            <el-button size="small" text type="primary">继续学习</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterType = ref('')

const totalCourses = ref(36)
const completedCount = ref(12)
const learningCount = ref(8)
const notStartCount = ref(16)

const searchForm = {
  keyword: '',
  type: ''
}

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

const filteredCourses = computed(() => {
  let list = courseList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.title.toLowerCase().includes(kw))
  }
  if (filterType.value) {
    list = list.filter(item => item.category === filterType.value)
  }
  return list
})

const getStatusClass = (status) => {
  const map = { '未开始': 'unverified', '学习中': 'doing', '已完成': 'done' }
  return map[status] || 'unverified'
}

const handleSearch = () => {}
const handleReset = () => {
  searchKeyword.value = ''
  filterType.value = ''
  ElMessage.success('筛选已重置')
}
const showCourseDetail = (course) => {}
const startLearn = (course) => {
  ElMessage.success(`开始学习：${course.title}`)
}
const handleExport = () => {}
const handleAddCourse = () => {}
</script>

<style scoped>
.list-page {
  padding-bottom: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.page-actions .el-button {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-mini-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}

.stat-mini-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-mini-card.blue::before { background: linear-gradient(180deg, #409EFF, #66b1ff); }
.stat-mini-card.green::before { background: linear-gradient(180deg, #10b981, #34d399); }
.stat-mini-card.orange::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
.stat-mini-card.gray::before { background: linear-gradient(180deg, #6b7280, #9ca3af); }

.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.search-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.course-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-head {
  margin-bottom: 20px;
}

.section-head h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.section-head h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
  border-radius: 2px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
}

.course-card:hover {
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
  transform: translateY(-4px);
  border-color: #c6e2ff;
}

.course-cover {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-cover img {
  transform: scale(1.05);
}

.course-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.course-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  color: #fff;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 38px;
  line-height: 1.4;
}

.course-meta {
  margin-bottom: 12px;
}

.meta-item {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 13px;
}

.course-progress {
  margin-bottom: 14px;
}

.progress-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar.small {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #66b1ff, #409EFF);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
  min-width: 40px;
}

.not-started {
  font-size: 12px;
  color: #9ca3af;
}

.learn-btn {
  width: 100%;
  border-radius: 8px;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.section-title {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.section-title h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
  border-radius: 2px;
}

.table-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-num {
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
  min-width: 40px;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.unverified { background: #f3f4f6; color: #6b7280; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.verified { background: #dbeafe; color: #2563eb; }
.status-tag.doing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }
</style>
