<template>
  <div class="statistics-page">
    <div class="page-header">
      <h2>数据统计</h2>
      <div class="header-actions">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 240px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button @click="handleExport">导出报表</el-button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👤</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.userTotal }}</div>
          <div class="stat-label">用户总数</div>
          <div class="stat-change up">+{{ stats.userGrowth }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon task-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.taskTotal }}</div>
          <div class="stat-label">任务总数</div>
          <div class="stat-change up">+{{ stats.taskGrowth }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon settle-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.settleAmount }}万</div>
          <div class="stat-label">结算总额</div>
          <div class="stat-change up">+{{ stats.settleGrowth }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon train-icon">📚</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.trainTotal }}</div>
          <div class="stat-label">培训人数</div>
          <div class="stat-change down">-{{ stats.trainDecline }}%</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <div class="panel">
          <div class="panel-header">
            <h3>任务趋势</h3>
            <div class="panel-tabs">
              <button :class="['tab-btn', { active: trendTab === 'week' }]" @click="trendTab = 'week'">本周</button>
              <button :class="['tab-btn', { active: trendTab === 'month' }]" @click="trendTab = 'month'">本月</button>
              <button :class="['tab-btn', { active: trendTab === 'year' }]" @click="trendTab = 'year'">本年</button>
            </div>
          </div>
          <div class="panel-body">
            <div class="chart-area">
              <div class="bar-group">
                <div class="bar-item" v-for="(item, idx) in trendData" :key="idx">
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
                  </div>
                  <span class="bar-label">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="panel">
          <div class="panel-header"><h3>用户分布</h3></div>
          <div class="panel-body">
            <div class="pie-chart">
              <div class="pie-item" v-for="(item, idx) in userDist" :key="idx">
                <span class="pie-color" :style="{ background: item.color }"></span>
                <span class="pie-name">{{ item.name }}</span>
                <span class="pie-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>结算排行</h3></div>
      <div class="panel-body">
        <el-table :data="rankList" border stripe>
          <el-table-column type="index" label="排名" width="70" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="taskCount" label="完成任务" width="100" />
          <el-table-column prop="workDays" label="工作天数" width="100" />
          <el-table-column prop="totalAmount" label="结算金额" width="130">
            <template #default="{ row }"><strong>¥{{ row.totalAmount }}</strong></template>
          </el-table-column>
          <el-table-column prop="avgSalary" label="平均日薪" width="110">
            <template #default="{ row }">¥{{ row.avgSalary }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const trendTab = ref('week')

const stats = reactive({
  userTotal: '12,345',
  userGrowth: 12.5,
  taskTotal: '8,920',
  taskGrowth: 8.3,
  settleAmount: '234.56',
  settleGrowth: 15.2,
  trainTotal: '1,567',
  trainDecline: 2.1
})

const trendData = ref([
  { label: '周一', value: 45 },
  { label: '周二', value: 62 },
  { label: '周三', value: 55 },
  { label: '周四', value: 78 },
  { label: '周五', value: 85 },
  { label: '周六', value: 40 },
  { label: '周日', value: 35 }
])

const userDist = ref([
  { name: '已认证', value: 68, color: '#409EFF' },
  { name: '审核中', value: 18, color: '#E6A23C' },
  { name: '未认证', value: 14, color: '#909399' }
])

const rankList = ref([
  { username: '张三', taskCount: 25, workDays: 120, totalAmount: '42,000', avgSalary: 350 },
  { username: '李四', taskCount: 22, workDays: 110, totalAmount: '38,500', avgSalary: 350 },
  { username: '王五', taskCount: 20, workDays: 100, totalAmount: '35,000', avgSalary: 350 },
  { username: '赵六', taskCount: 18, workDays: 90, totalAmount: '31,500', avgSalary: 350 },
  { username: '钱七', taskCount: 15, workDays: 80, totalAmount: '28,000', avgSalary: 350 }
])

const handleReset = () => {
  dateRange.value = []
  trendTab.value = 'week'
  ElMessage.success('已重置')
}

const handleExport = () => {
  ElMessage.success('报表导出成功')
}
</script>

<style scoped>
.statistics-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: 8px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.user-icon { background: #ecf5ff; }
.task-icon { background: #fdf6ec; }
.settle-icon { background: #f0f9eb; }
.train-icon { background: #fef0f0; }
.stat-content { flex: 1; }
.stat-value { font-size: 24px; font-weight: 600; color: #303133; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.stat-change { font-size: 12px; margin-top: 4px; font-weight: 500; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
.row { display: flex; gap: 20px; margin-bottom: 20px; }
.col-8 { flex: 2; }
.col-4 { flex: 1; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #ebeef5; }
.panel-header h3 { font-size: 16px; font-weight: 600; color: #303133; margin: 0; }
.panel-tabs { display: flex; gap: 8px; }
.tab-btn { padding: 4px 12px; border: none; background: #f5f7fa; border-radius: 4px; font-size: 12px; color: #909399; cursor: pointer; }
.tab-btn.active { background: #409EFF; color: #fff; }
.panel-body { padding: 20px; }
.chart-area { height: 260px; display: flex; align-items: flex-end; }
.bar-group { display: flex; gap: 24px; align-items: flex-end; width: 100%; height: 220px; padding: 0 12px; }
.bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.bar-track { width: 100%; height: 180px; background: #f5f7fa; border-radius: 4px 4px 0 0; position: relative; overflow: hidden; }
.bar-fill { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(180deg, #409EFF, #66b1ff); border-radius: 4px 4px 0 0; transition: height 0.5s; }
.bar-label { font-size: 12px; color: #606266; }
.pie-chart { display: flex; flex-direction: column; gap: 16px; padding: 12px; }
.pie-item { display: flex; align-items: center; gap: 10px; }
.pie-color { width: 12px; height: 12px; border-radius: 2px; }
.pie-name { flex: 1; font-size: 14px; color: #303133; }
.pie-value { font-size: 14px; font-weight: 600; color: #303133; }
</style>
