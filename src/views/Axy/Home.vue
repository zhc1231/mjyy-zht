<template>
  <div class="home-page">
    <div class="page-header">
      <h2>欢迎回来，{{ username }}</h2>
      <p>今天是 {{ currentDate }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👤</div>
        <div class="stat-content">
          <div class="stat-value">12,345</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon task-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">892</div>
          <div class="stat-label">进行中任务</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon settle-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">¥234.56万</div>
          <div class="stat-label">本月结算</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon train-icon">📚</div>
        <div class="stat-content">
          <div class="stat-value">1,567</div>
          <div class="stat-label">培训人数</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <div class="panel">
          <div class="panel-header">
            <h3>任务统计</h3>
            <div class="panel-tabs">
              <button class="tab-btn active">今日</button>
              <button class="tab-btn">本周</button>
              <button class="tab-btn">本月</button>
            </div>
          </div>
          <div class="panel-body">
            <div class="chart-placeholder">
              <div class="bar-chart">
                <div class="bar" style="height: 80%;"><span>发布</span></div>
                <div class="bar" style="height: 65%;"><span>进行中</span></div>
                <div class="bar" style="height: 90%;"><span>完成</span></div>
                <div class="bar" style="height: 40%;"><span>取消</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>最近任务</h3>
            <a href="/axy/task" class="view-all">查看全部</a>
          </div>
          <div class="panel-body">
            <el-table :data="taskList" border stripe>
              <el-table-column prop="name" label="任务名称" />
              <el-table-column prop="company" label="企业名称" />
              <el-table-column prop="workers" label="人数" />
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="创建时间" />
            </el-table>
          </div>
        </div>
      </div>

      <div class="col-4">
        <div class="panel">
          <div class="panel-header">
            <h3>用户增长</h3>
          </div>
          <div class="panel-body">
            <div class="chart-placeholder">
              <div class="line-chart">
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>企业排名</h3>
          </div>
          <div class="panel-body">
            <div class="ranking-list">
              <div class="ranking-item" v-for="(item, index) in companyRanking" :key="index">
                <span class="rank-num" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
                <div class="rank-info">
                  <span class="rank-name">{{ item.name }}</span>
                  <span class="rank-count">{{ item.count }}个任务</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = ref(localStorage.getItem('username') || '用户')

const currentDate = computed(() => {
  const date = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  return date.toLocaleDateString('zh-CN', options)
})

const taskList = ref([
  { name: '工地施工任务', company: '陕西火车侠建设', workers: 5, status: 'doing', statusText: '进行中', date: '2026-07-04' },
  { name: '培训课程助教', company: '西安职业培训', workers: 2, status: 'doing', statusText: '进行中', date: '2026-07-03' },
  { name: '设备安装调试', company: '华能电力', workers: 8, status: 'done', statusText: '已完成', date: '2026-07-02' },
  { name: '保洁服务', company: '万达物业', workers: 10, status: 'done', statusText: '已完成', date: '2026-07-01' },
  { name: '搬运装卸', company: '顺丰物流', workers: 6, status: 'cancel', statusText: '已取消', date: '2026-06-30' }
])

const companyRanking = ref([
  { name: '陕西火车侠建设工程', count: 25 },
  { name: '西安职业培训学校', count: 18 },
  { name: '华能电力集团', count: 15 },
  { name: '万达物业管理', count: 12 },
  { name: '顺丰物流', count: 10 }
])
</script>

<style scoped>
.home-page {
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
.page-header p {
  font-size: 14px;
  color: #909399;
  margin: 4px 0 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.user-icon { background: #ecf5ff; }
.task-icon { background: #fdf6ec; }
.settle-icon { background: #ecf5ff; }
.train-icon { background: #fef0f0; }
.stat-content {
  flex: 1;
}
.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.row {
  display: flex;
  gap: 20px;
}
.col-8 { flex: 2; }
.col-4 { flex: 1; }
.panel {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
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
.panel-tabs {
  display: flex;
  gap: 8px;
}
.tab-btn {
  padding: 4px 12px;
  border: none;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
}
.tab-btn.active {
  background: #409EFF;
  color: #fff;
}
.view-all {
  font-size: 13px;
  color: #409EFF;
  text-decoration: none;
}
.panel-body {
  padding: 20px;
}
.chart-placeholder {
  height: 200px;
  background: #f8f9fc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bar-chart {
  display: flex;
  gap: 30px;
  align-items: flex-end;
  height: 150px;
}
.bar {
  width: 40px;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
}
.bar span {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
.line-chart {
  width: 280px;
  height: 150px;
  position: relative;
}
.line {
  position: absolute;
  top: 60px;
  left: 20px;
  right: 20px;
  height: 3px;
  background: linear-gradient(90deg, #409EFF, #66b1ff);
  border-radius: 2px;
}
.line::before, .line::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409EFF;
  border-radius: 50%;
  top: -2px;
}
.line::before { left: 0; }
.line::after { right: 0; }
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rank-num {
  width: 24px;
  height: 24px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #909399;
}
.rank-num.top-three {
  background: #409EFF;
  color: #fff;
}
.rank-info {
  flex: 1;
}
.rank-name {
  font-size: 14px;
  color: #303133;
}
.rank-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-badge.doing { background: #ecf5ff; color: #409EFF; }
.status-badge.done { background: #ecf5ff; color: #409EFF; }
.status-badge.cancel { background: #fef0f0; color: #F56C6C; }
</style>