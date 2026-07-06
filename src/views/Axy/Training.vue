<template>
  <div class="training-page">
    <div class="page-header">
      <h2>培训考证</h2>
      <div class="header-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'class'" class="panel">
      <div class="panel-header">
        <h3>培训班级列表</h3>
        <el-button type="primary">新建班级</el-button>
      </div>
      <div class="panel-body">
        <div class="class-grid">
          <div class="class-card" v-for="item in classList" :key="item.id">
            <div class="class-header">
              <div class="class-icon">📚</div>
              <div class="class-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.type }}</p>
              </div>
            </div>
            <div class="class-stats">
              <span>学员：{{ item.students }}人</span>
              <span>课程：{{ item.courses }}节</span>
            </div>
            <div class="class-footer">
              <span class="class-date">{{ item.startDate }} ~ {{ item.endDate }}</span>
              <span :class="`class-status ${item.status}`">{{ item.statusText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'course'" class="panel">
      <div class="panel-header">
        <h3>在线课程</h3>
        <el-button type="primary">上传课程</el-button>
      </div>
      <div class="panel-body">
        <el-table :data="courseList" border stripe>
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="duration" label="时长" width="80" />
          <el-table-column prop="views" label="播放量" width="80" />
          <el-table-column prop="progress" label="学习进度" width="100">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :stroke-width="8" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button size="small" @click="playCourse(row)">播放</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="activeTab === 'exam'" class="panel">
      <div class="panel-header">
        <h3>考试管理</h3>
        <el-button type="primary">创建考试</el-button>
      </div>
      <div class="panel-body">
        <el-table :data="examList" border stripe>
          <el-table-column prop="name" label="考试名称" />
          <el-table-column prop="type" label="考试类型" width="100" />
          <el-table-column prop="duration" label="时长" width="80" />
          <el-table-column prop="totalScore" label="总分" width="80" />
          <el-table-column prop="passScore" label="及格分" width="80" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small">开始考试</el-button>
              <el-button size="small" type="danger">结束</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="activeTab === 'cert'" class="panel">
      <div class="panel-header">
        <h3>证书管理</h3>
        <el-button type="primary">颁发证书</el-button>
      </div>
      <div class="panel-body">
        <el-table :data="certList" border stripe>
          <el-table-column prop="certNo" label="证书编号" width="140" />
          <el-table-column prop="name" label="证书名称" />
          <el-table-column prop="username" label="获得者" />
          <el-table-column prop="issueDate" label="颁发日期" width="120" />
          <el-table-column prop="expireDate" label="有效期至" width="120" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('class')

const tabs = [
  { key: 'class', name: '培训班级' },
  { key: 'course', name: '在线学习' },
  { key: 'exam', name: '考试管理' },
  { key: 'cert', name: '证书管理' }
]

const classList = reactive([
  { id: 1, name: '电工培训一班', type: '职业技能', students: 30, courses: 12, startDate: '2026-07-01', endDate: '2026-07-31', status: 'doing', statusText: '进行中' },
  { id: 2, name: '焊工培训二班', type: '职业技能', students: 25, courses: 10, startDate: '2026-06-15', endDate: '2026-07-15', status: 'done', statusText: '已完成' },
  { id: 3, name: '安全员培训', type: '安全培训', students: 40, courses: 8, startDate: '2026-07-10', endDate: '2026-07-20', status: 'pending', statusText: '未开始' }
])

const courseList = reactive([
  { name: '电工基础知识', duration: '45分钟', views: 1234, progress: 75 },
  { name: '电气安全规范', duration: '30分钟', views: 987, progress: 60 },
  { name: '电路故障排查', duration: '60分钟', views: 856, progress: 45 },
  { name: '电气设备维护', duration: '50分钟', views: 723, progress: 30 }
])

const examList = reactive([
  { name: '电工初级考试', type: '正式考试', duration: '90分钟', totalScore: 100, passScore: 60, status: 'doing', statusText: '进行中' },
  { name: '焊工模拟考试', type: '模拟考试', duration: '60分钟', totalScore: 100, passScore: 60, status: 'pending', statusText: '未开始' },
  { name: '安全员考核', type: '正式考试', duration: '120分钟', totalScore: 100, passScore: 60, status: 'done', statusText: '已结束' }
])

const certList = reactive([
  { certNo: 'CERT-202607001', name: '电工职业资格证', username: '张三', issueDate: '2026-07-01', expireDate: '2031-07-01' },
  { certNo: 'CERT-202607002', name: '焊工职业资格证', username: '李四', issueDate: '2026-07-02', expireDate: '2031-07-02' },
  { certNo: 'CERT-202607003', name: '安全员证书', username: '王五', issueDate: '2026-07-03', expireDate: '2028-07-03' }
])

const playCourse = (row) => {
  ElMessage.info(`播放课程：${row.name}`)
}
</script>

<style scoped>
.training-page {
  padding-bottom: 24px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}
.header-tabs {
  display: flex;
  gap: 8px;
}
.tab-btn {
  padding: 6px 20px;
  border: none;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #409EFF;
  color: #fff;
}
.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}
.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}
.panel-body {
  padding: 20px;
}
.class-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.class-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
}
.class-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.class-icon {
  width: 48px;
  height: 48px;
  background: #ecf5ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.class-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}
.class-info p {
  font-size: 13px;
  color: #909399;
  margin: 4px 0 0;
}
.class-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #606266;
}
.class-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.class-date {
  font-size: 12px;
  color: #909399;
}
.class-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.class-status.pending { background: #f5f7fa; color: #909399; }
.class-status.doing { background: #ecf5ff; color: #409EFF; }
.class-status.done { background: #ecf5ff; color: #409EFF; }
.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-badge.pending { background: #f5f7fa; color: #909399; }
.status-badge.doing { background: #ecf5ff; color: #409EFF; }
.status-badge.done { background: #ecf5ff; color: #409EFF; }
</style>