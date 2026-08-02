<template>
  <div class="home-page">
    <div class="page-header">
      <div class="header-left">
        <h2>欢迎回来，{{ username }} 👋</h2>
        <p>今天是 {{ currentDate }}，祝您工作顺利！</p>
      </div>
      <div class="header-right">
        <div class="quick-actions">
          <button class="quick-btn primary" @click="goToPublish">
            <span class="btn-icon">+</span>
            <span>发布任务</span>
          </button>
          <button class="quick-btn" @click="goToSettlement">
            <span class="btn-icon">💰</span>
            <span>费用结算</span>
          </button>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card gradient-blue">
        <div class="stat-header">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">👤</span>
          </div>
          <span class="stat-trend up">↑ 12.5%</span>
        </div>
        <div class="stat-value">12,345</div>
        <div class="stat-label">注册用户</div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 75%"></div>
        </div>
      </div>
      <div class="stat-card gradient-orange">
        <div class="stat-header">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">📋</span>
          </div>
          <span class="stat-trend up">↑ 8.3%</span>
        </div>
        <div class="stat-value">892</div>
        <div class="stat-label">进行中任务</div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 65%"></div>
        </div>
      </div>
      <div class="stat-card gradient-green">
        <div class="stat-header">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">💰</span>
          </div>
          <span class="stat-trend up">↑ 23.1%</span>
        </div>
        <div class="stat-value">¥234.56万</div>
        <div class="stat-label">本月结算</div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 85%"></div>
        </div>
      </div>
      <div class="stat-card gradient-purple">
        <div class="stat-header">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">🛡️</span>
          </div>
          <span class="stat-trend up">↑ 15.7%</span>
        </div>
        <div class="stat-value">5,678</div>
        <div class="stat-label">已投保人数</div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 55%"></div>
        </div>
      </div>
    </div>

    <div class="content-row">
      <div class="content-col main">
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
            <div class="chart-container">
              <div class="bar-chart">
                <div class="bar-item" v-for="(item, index) in taskStats" :key="index">
                  <div class="bar" :style="{ height: item.percent + '%' }">
                    <span class="bar-value">{{ item.value }}</span>
                  </div>
                  <span class="bar-label">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>最近任务</h3>
            <span class="view-all" @click="goToTaskList">查看全部 →</span>
          </div>
          <div class="panel-body no-padding">
            <div class="task-list">
              <div class="task-item" v-for="task in recentTasks" :key="task.id">
                <div class="task-info">
                  <div class="task-name">{{ task.name }}</div>
                  <div class="task-meta">
                    <span class="task-company">{{ task.company }}</span>
                    <span class="task-date">{{ task.date }}</span>
                  </div>
                </div>
                <div class="task-right">
                  <div class="task-workers">👥 {{ task.workers }}人</div>
                  <span class="status-tag" :class="task.status">{{ task.statusText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-col side">
        <div class="panel">
          <div class="panel-header">
            <h3>用户增长趋势</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container line-chart-container">
              <div class="line-chart-wrapper">
                <svg class="line-chart" viewBox="0 0 280 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,100 L40,80 L80,90 L120,50 L160,60 L200,30 L240,40 L280,20 L280,150 L0,150 Z" fill="url(#lineGradient)" />
                  <path d="M0,100 L40,80 L80,90 L120,50 L160,60 L200,30 L240,40 L280,20" fill="none" stroke="#409EFF" stroke-width="2" />
                  <circle cx="120" cy="50" r="4" fill="#409EFF" />
                  <circle cx="200" cy="30" r="4" fill="#409EFF" />
                  <circle cx="280" cy="20" r="4" fill="#409EFF" />
                </svg>
                <div class="chart-labels">
                  <span>周一</span><span>周二</span><span>周三</span><span>周四</span>
                  <span>周五</span><span>周六</span><span>周日</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>活跃企业排行</h3>
          </div>
          <div class="panel-body">
            <div class="ranking-list">
              <div class="ranking-item" v-for="(item, index) in companyRanking" :key="index">
                <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                <div class="rank-info">
                  <div class="rank-name">{{ item.name }}</div>
                  <div class="rank-bar">
                    <div class="rank-bar-fill" :style="{ width: (item.count / maxRankCount * 100) + '%' }"></div>
                  </div>
                </div>
                <div class="rank-count">{{ item.count }}个</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel quick-access">
          <div class="panel-header">
            <h3>快捷入口</h3>
          </div>
          <div class="panel-body">
            <div class="quick-grid">
              <div class="quick-item" @click="goToUserList">
                <span class="quick-icon blue">👥</span>
                <span class="quick-name">人员管理</span>
              </div>
              <div class="quick-item" @click="goToAttendance">
                <span class="quick-icon green">✅</span>
                <span class="quick-name">考勤确认</span>
              </div>
              <div class="quick-item" @click="goToTraining">
                <span class="quick-icon orange">📚</span>
                <span class="quick-name">培训学习</span>
              </div>
              <div class="quick-item" @click="goToInsurance">
                <span class="quick-icon purple">🛡️</span>
                <span class="quick-name">保险服务</span>
              </div>
              <div class="quick-item" @click="goToContract">
                <span class="quick-icon cyan">📄</span>
                <span class="quick-name">合同管理</span>
              </div>
              <div class="quick-item" @click="goToSystem">
                <span class="quick-icon gray">⚙️</span>
                <span class="quick-name">系统设置</span>
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
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')

const currentDate = computed(() => {
  const date = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  return date.toLocaleDateString('zh-CN', options)
})

const taskStats = ref([
  { label: '已发布', value: 156, percent: 85 },
  { label: '进行中', value: 892, percent: 65 },
  { label: '已完成', value: 2341, percent: 95 },
  { label: '已取消', value: 67, percent: 30 },
  { label: '待审核', value: 234, percent: 50 }
])

const recentTasks = ref([
  { id: 1, name: '建筑工地钢筋绑扎任务', company: '陕西火车侠建设工程', workers: 15, status: 'doing', statusText: '进行中', date: '2026-07-08' },
  { id: 2, name: '写字楼日常保洁服务', company: '万达物业管理有限公司', workers: 8, status: 'doing', statusText: '进行中', date: '2026-07-08' },
  { id: 3, name: '电气设备安装调试', company: '华能电力集团', workers: 6, status: 'done', statusText: '已完成', date: '2026-07-07' },
  { id: 4, name: '仓库货物分拣搬运', company: '顺丰物流有限公司', workers: 12, status: 'done', statusText: '已完成', date: '2026-07-07' },
  { id: 5, name: '线上课程助教服务', company: '西安职业培训学校', workers: 3, status: 'doing', statusText: '进行中', date: '2026-07-06' }
])

const companyRanking = ref([
  { name: '陕西火车侠建设工程', count: 25 },
  { name: '西安职业培训学校', count: 18 },
  { name: '华能电力集团', count: 15 },
  { name: '万达物业', count: 12 },
  { name: '顺丰物流', count: 10 }
])

const maxRankCount = computed(() => Math.max(...companyRanking.value.map(item => item.count)))

const goToPublish = () => router.push('/axy/task/publish')
const goToSettlement = () => router.push('/axy/settlement/list')
const goToTaskList = () => router.push('/axy/task/list')
const goToUserList = () => router.push('/axy/user/list')
const goToAttendance = () => router.push('/axy/attendance/check')
const goToTraining = () => router.push('/axy/training/course')
const goToInsurance = () => router.push('/axy/insurance/policy')
const goToContract = () => router.push('/axy/contract/list')
const goToSystem = () => router.push('/axy/system')
</script>

<style scoped>
.home-page {
  padding-bottom: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding: 24px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.header-left h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.header-left p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.quick-btn.primary {
  background: #fff;
  color: #667eea;
}

.quick-btn.primary:hover {
  background: #f0f0ff;
}

.btn-icon {
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
}

.stat-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
}

.stat-trend.up {
  background: #f0f9eb;
  color: #67c23a;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

.stat-bar {
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.gradient-blue .stat-bar-fill { background: linear-gradient(90deg, #409EFF, #66b1ff); }
.gradient-orange .stat-bar-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.gradient-green .stat-bar-fill { background: linear-gradient(90deg, #10b981, #34d399); }
.gradient-purple .stat-bar-fill { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

.content-row {
  display: flex;
  gap: 20px;
}

.content-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-col.main {
  flex: 2;
}

.content-col.side {
  flex: 1;
}

.panel {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.panel-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  padding: 6px 14px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #e5e7eb;
}

.tab-btn.active {
  background: #409EFF;
  color: #fff;
}

.view-all {
  font-size: 13px;
  color: #409EFF;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #66b1ff;
}

.panel-body {
  padding: 24px;
}

.panel-body.no-padding {
  padding: 0;
}

.chart-container {
  height: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-chart {
  display: flex;
  gap: 40px;
  align-items: flex-end;
  height: 100%;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 48px;
  background: linear-gradient(180deg, #409EFF 0%, #66b1ff 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  min-height: 20px;
  transition: height 0.6s ease;
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.bar-label {
  font-size: 13px;
  color: #6b7280;
}

.task-list {
  padding: 8px 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.2s ease;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  background: #fafafa;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 6px;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-workers {
  font-size: 13px;
  color: #6b7280;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.doing {
  background: #ecf5ff;
  color: #409EFF;
}

.status-tag.done {
  background: #f0f9eb;
  color: #67c23a;
}

.status-tag.cancel {
  background: #fef2f2;
  color: #ef4444;
}

.line-chart-container {
  height: 180px;
}

.line-chart-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.line-chart {
  flex: 1;
  width: 100%;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
  padding-top: 8px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-badge {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: #f3f4f6;
  color: #6b7280;
}

.rank-badge.rank-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; }
.rank-badge.rank-2 { background: linear-gradient(135deg, #9ca3af, #6b7280); color: #fff; }
.rank-badge.rank-3 { background: linear-gradient(135deg, #d97706, #b45309); color: #fff; }

.rank-info {
  flex: 1;
}

.rank-name {
  font-size: 13px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 500;
}

.rank-bar {
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.rank-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #66b1ff);
  border-radius: 2px;
  transition: width 0.6s ease;
}

.rank-count {
  font-size: 13px;
  font-weight: 600;
  color: #409EFF;
  min-width: 40px;
  text-align: right;
}

.quick-access .panel-body {
  padding: 16px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.quick-item:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.quick-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.quick-icon.blue { background: #ecf5ff; }
.quick-icon.green { background: #f0f9eb; }
.quick-icon.orange { background: #fdf6ec; }
.quick-icon.purple { background: #f5f0ff; }
.quick-icon.cyan { background: #e6fffb; }
.quick-icon.gray { background: #f4f4f5; }

.quick-name {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
</style>